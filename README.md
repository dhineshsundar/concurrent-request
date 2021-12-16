# concurrent-request (Option 1)

> Step 1: To install the dependency

 npm install 

> Step 2: Accepts the request from browser and invokes concurrent service running in main.js

 node concurrent.js

> Step 3: Invoke request from browser

 http://localhost:3000

# concurrent-request (Option 2)

> Step 1: To install the dependency

npm install 

> Step 2: Run main.js to receive requests and respond based on the delay

node main.js

> Step 3: Accepts the request from browser and invokes concurrent service running in main.js

node cluster.js

> Step 4: Invoke client request from browser

http://localhost:3000

# first exceution of Step 4 result
![image](https://user-images.githubusercontent.com/2387801/146252284-4daff840-5ed4-4c71-ae79-fa1c5b577ad3.png)

# second execution of Step 4 result
![image](https://user-images.githubusercontent.com/2387801/146253059-52658088-2f00-4250-b175-3e140f0885a9.png)

