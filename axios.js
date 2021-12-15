const axios = require('axios').default;
const express = require('express');
const request = require('request') // https://www.npmjs.com/package/request
const app = express();
const port = 3001;


app.listen(port, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`app listening at http://localhost:${port}`);
});

/*
app.get('/', (req, res) => {
    Promise.all([
        axios.get("http://localhost:8081/delayedResponse?delay=5"),
        axios.get("http://localhost:8081/delayedResponse?delay=10"),
        axios.get("http://localhost:8081/delayedResponse?delay=5"),
        axios.get("http://localhost:8081/delayedResponse?delay=10"),
        axios.get("http://localhost:8081/delayedResponse?delay=5"),
        axios.get("http://localhost:8081/delayedResponse?delay=10"),
        axios.get("http://localhost:8081/delayedResponse?delay=5"),
        axios.get("http://localhost:8081/delayedResponse?delay=10")
    ]) .then( response => {
        console.log(response.data);
    });
    res.end();
});
*/

app.get('/', (req, res) => {
    var collatedResults;
    const fetchNames = async () => {
        try {
          const res = await Promise.all([
              axios.get("http://localhost:8081/delayedResponse?delay=5"),
              axios.get("http://localhost:8081/delayedResponse?delay=10")
          ]);
          const data = await Promise.all(res.map(r => r));
          collatedResults = data;
          console.log(collatedResults[0].data.Delay);
          console.log(collatedResults[1].data.Delay);
        } catch (e){
          console.log(e);
          throw Error("Promise failed");
        }finally{
            return ""+collatedResults[0].data.Delay + "  ###  " + collatedResults[1].data.Delay;
        }
        res.end(collatedResults[0].data.Delay + "  ###  " + collatedResults[1].data.Delay);
      };
      fetchNames();
});
