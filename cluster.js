const express = require('express');
const cluster = require('cluster');
const async = require('async'); // https://www.npmjs.com/package/async
const request = require('request') // https://www.npmjs.com/package/request

// Check the number of available CPU.
const numCPUs = require('os').cpus().length;
 
const app = express();
const port = 3000;

var multipleInvocation = ['http://localhost:8081/delayedResponse?delay=10',
'http://localhost:8081/delayedResponse?delay=12',
'http://localhost:8081/delayedResponse?delay=15'
]; // 1000+ urls here


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


/**
 * 
 */
 app.get('/test', (req, res) => {
  
  res.end(fetchNames().toString());
});


const fetchNames = async () => {
  try {
    const res = await Promise.all([
      fetch("http://localhost:8081/delayedResponse?delay=10")
    ]);
    const data = await Promise.all(res.map(r => r.json()))
    console.log(data.flat());
  } catch (e){
    console.log(e);
    throw Error("Promise failed");
  }
};

app.get('/delayedResponse', (req, res) => {
    var currentTime = new Date();
    var waitTill = new Date(currentTime.getTime() + req.query.delay * 1000);

    console.log('Request Received at: ' +currentTime.getHours() +':' + currentTime.getMinutes() + ':' + currentTime.getSeconds() + 
    ' for delay of ' + req.query.delay + ' secs '+
    " Response delay: " + waitTill.getHours() +':' + waitTill.getMinutes() + ':' + waitTill.getSeconds());
    while(waitTill > new Date()){};
    res.end('Delay: ' + req.query.delay );
    //res.end({'Delay': + req.query.delay} );
});

/**
 * 
 */ 
 app.get('/',   (req, res) => {
     async.map(multipleInvocation, function(url, callback) {
        request(url, function(error, response, html) {
          console.log(console.log('Response Received: ' +new Date(new Date().getTime()) + response.body));
          //console.log(response.statusCode);
          callback(error, html);
        });
      }, function(err, results) {
          //console.log('Final Results: ' + results);
          if(err)
              console.log(err);
          res.end(new Date(new Date().getTime()) + " :: "+results.toString());
      });

});


/*
app.listen(port, err =>{
  err ?
  console.log("Error in server setup") :
  console.log(`app listening at http://localhost:${port}`);
});
*/