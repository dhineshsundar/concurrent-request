# concurrent-request

 * Step 1: Run main.js to receive requests and respond based on the delay
node main.js

 * Step 2: Accepts the request from browser and invokes concurrent service running in main.js
node cluster.js

 * Step 3: Invoke client request from browser
http://localhost:3000
