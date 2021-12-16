const express = require('express');
const async = require('async'); // https://www.npmjs.com/package/async
const request = require('request') // https://www.npmjs.com/package/request

const app = express();
const port = 3000;

/**
 * Lists of endpoint that are required invoke concurrently
 * 
 */
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

/**
 * Endpoint to invoke concurrent requests and 
 * collate the response as single object
 * 
 * URL: http://localhost:3000/
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
        res.end(new Date(new Date().getTime()) + " Time taken to process all 33 requests are :: " + timeTaken + " Seconds." + " :: "+response.toString());
    });
});

/**
 * App binding with port 
 */
app.listen(port, err =>{
    err ?
        console.log("Error in server setup") : 
        console.log(`app listening at http://localhost:${port}`);
});
