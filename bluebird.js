var Promise = require("bluebird");
const express = require('express');

const app = express();
const port = 3000;
var join = Promise.join;

const axios = Promise.promisify(require('axios').default);

app.get('/',  async (req, res) => {

    var results;
    await Promise.join(
        axios.get("http://localhost:8081/delayedResponse?delay=2"), 
        axios.get("http://localhost:8081/delayedResponse?delay=4"), 
        axios.get("http://localhost:8081/delayedResponse?delay=6"), 
        axios.get("http://localhost:8081/delayedResponse?delay=8"), 
        function(response, response1, response2, response3) {
            console.log(response.data);
            console.log(response1.data);
            console.log(response2.data);
            console.log(response3.data);
            results = 'DONE';
         });
    res.end(results);
});


app.listen(port, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`app listening at http://localhost:${port}`);
});
