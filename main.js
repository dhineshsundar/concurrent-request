const express = require('express');
const cluster = require('cluster');
const request = require('request') // https://www.npmjs.com/package/request
const async = require('async'); // https://www.npmjs.com/package/async

// Check the number of available CPU.
const numCPUs = require('os').cpus().length;

const app = express();
const port = 8081;

// For Master process
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  // This event is firs when worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
 
// For Worker
else{
 
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.listen(port, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`Worker ${process.pid} started`);
  });
}


var loaderQueue = []; // passed to async.parallel
//var multipleInvocation = ['https://jsonplaceholder.typicode.com/users/1', 'https://jsonplaceholder.typicode.com/users/2'] // 1000+ urls here
var multipleInvocation = ['http://localhost:8081/delayedResponse?delay=10',
'http://localhost:8081/delayedResponse?delay=12',
'http://localhost:8081/delayedResponse?delay=15'
]; // 1000+ urls here


var ParallelRequest = require('parallel-http-request');
 
var config = {
    response: "simple"    // [optional] detail|simple|unirest, if empty then the response output is simple
};
 
var parallelReq = new ParallelRequest(config);
 
//or without config
var parallelReq = new ParallelRequest();


app.get('/parallel', (req, res) => {

  parallelReq.add({url:'http://localhost:8081/delayedResponse?delay=10',method:'get',timeout:30000})
    .add({url:'http://localhost:8081/delayedResponse?delay=50',method:'get',timeout:30000})
    .send(function(response){
        console.log(response);
    });
  res.end('Hello World!');
});


/**
 * 
 * 
 */
app.get('/',  (req, res) => {

     async.map(multipleInvocation, function(url, callback) {
         request(url, function(error, response, html) {
          console.log(console.log('Current Time: ' +new Date(new Date().getTime()) + response.body));
          //console.log(response.statusCode);
          callback(error, html);
        });
      }, function(err, results) {
          //console.log(results)
          //console.log('Final Results: ' + results);
          //console.log('call back by dhinesh');
          res.end('Hello World!');
      });
});

/**
 * 
 */
 app.get('/delayedResponse', (req, res) => {
  var currentTime = new Date();
  var waitTill = new Date(currentTime.getTime() + req.query.delay * 1000);

  console.log('Request Received at: ' +currentTime.getHours() +':' + currentTime.getMinutes() + ':' + currentTime.getSeconds() + 
  ' for delay of ' + req.query.delay + ' secs '+
  " Response delay: " + waitTill.getHours() +':' + waitTill.getMinutes() + ':' + waitTill.getSeconds());
  while(waitTill > new Date()){};
  //res.end('Delay: ' + req.query.delay );
  res.end(JSON.stringify({'Delay': + req.query.delay} ));
});

/**
 * 
 */
app.get('/test', (req, res) => {
    console.log(req.query.q);
    console.log(req.route.path);
    //console.log(req.route.stack[0]);
    res.end('omg!');
});
/*
app.listen(port, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`app listening at http://localhost:${port}`);
  });

*/