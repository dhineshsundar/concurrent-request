const express = require('express');
const cluster = require('cluster');
const async = require('async'); // https://www.npmjs.com/package/async
const request = require('request') // https://www.npmjs.com/package/request

// Check the number of available CPU.
const numCPUs = require('os').cpus().length;
 
const app = express();
const port = 3000;

var multipleInvocation = ['https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=19',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=19',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=19',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=19',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=10',
  'https://reqres.in/api/users?delay=15'

//  'http://localhost:8081/delayedResponse?delay=15'
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
      var startTime = new Date().getTime();
      var endTime;
      var timeTaken;
     async.map(multipleInvocation, function(url, callback) {
        request(url, function(error, response, html) {
          console.log(console.log('Response Received: ' +new Date(new Date().getTime()) + response.body));
          callback(error, html);
        });
      }, function(err, results) {
        var response;
          if(err){
            console.log(err);
            response=err
          }else{
            response = results;
          }
          endTime = new Date().getTime();
          timeTaken =  (endTime - startTime)/1000;
          res.end(new Date(new Date().getTime()) + " Time take to process the requests are:: " + timeTaken + " Seconds " + " :: "+response.toString());
      });
});


/*
app.listen(port, err =>{
  err ?
  console.log("Error in server setup") :
  console.log(`app listening at http://localhost:${port}`);
});
*/