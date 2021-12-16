const { workerData, parentPort, isMainThread } = require('worker_threads');
const axios = require('axios').default;

parentPort.on("message", message => {
    try {
        if (message === "exit") {
            parentPort.postMessage("sold!");
            parentPort.close();
        } else {
            console.log("Received at worker: " + message)
            axios.get(workerData)
            .then(function (response) {
                parentPort.postMessage({ going: response.data });     
                parentPort.close();
            });;        
        }
    } catch (e) {
        console.log(e)
    }
});

//parentPort.postMessage({ start: workerData, isMainThread });