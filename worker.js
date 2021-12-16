const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const express = require('express');
const app = express();

const port = 1000;

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var multipleInvocation = ['https://reqres.in/api/users?delay=15',
  'https://reqres.in/api/users?delay=5',
  'http://localhost:8081/delayedResponse?delay=15'
]; // 1000+ urls here

app.get('/', (req, res) => {

  var response = [3];

  if (isMainThread) {

    function runSrvc(workerData, resp) {
      const worker = new Worker("./workerdata.js", { workerData });

      /**
       * On Error
       */
      worker.on("error", code =>
        new Error(`Worker error with exit code ${code}`)
      );

      /**
       * On graceful exit
       */
      worker.on("exit", code =>
        console.log(`Worker stopped with exit code ${code}`)
      );

      /**
       * receving msg from Worker
       */
      worker.on("message", incoming => {
        console.log({ incoming });
      });

      /**
       * sending mdg to worker
       */
      worker.postMessage('invoke');
    }

    async function run() {
      const result = runSrvc(multipleInvocation[0], response[0]);
      const result1 = runSrvc(multipleInvocation[1], response[1]);
      console.log({ isMainThread });
    }

    run().catch(err => console.error(err));
    res.end('done');
  }
});


app.listen(port, err => {
  err ?
    console.log("Error in server setup") :
    console.log(`app listening at http://localhost:${port}`);
});

/**
 * https://levelup.gitconnected.com/simple-bidirectional-messaging-in-node-js-worker-threads-7fe41de22e3c
 */