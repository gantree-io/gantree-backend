# 🏄‍♂️ Gantree Backend Server

Spin up an instance:

1. Clone repo
2. Fetch all module dependencies: `$> yarn` 
3. Copy .env.example to .env and update values (see below)
4. Start a mongo instance and create a DB

Use one of the following node app managers:

##### Local Dev Server | [nodemon](https://www.npmjs.com/package/nodemon)
`nodemon -L server.js` 

##### Production Server | [pm2](https://www.npmjs.com/package/pm2)
`pm2 start path/to/server.js --name "gantree-server"`

##### .env vars
`GRAPHQL_PORT=4000` graphql port  
`SOCKETIO_PORT=3000` socketio port  
`MONGODB_URL=mongodb://localhost:27017/gantree` mongodb path  
`SECRET_KEY=1234567890abcdefghijklmnopqustuvwxyz` a secret key used for signing JTW tokens (longer the better)    
`TEAMSTORAGE_ROOT=./` root path to use when storing team files (preferably in a non-public dir)  
`MOCK_CLI=true` uses a mock Gantree cli instead of the real one (may be out-of-date depending on cli version)  
`LOGGING_ON=true` log stuff to console  
`EMAILER_ENV=ethereal` ethereal|prod  
`EMAILER_HOST=smtp.ethereal.email` emailer host  
`EMAILER_PORT=587` emailer port  
`EMAILER_SECURE=false` emailer secure  
`EMAILER_ACC_USER=[email creds user]` emailer account username  
`EMAILER_ACC_PASS=[email creds password]`  emailer account password  
`FIREBASE_APIKEY=[firebase creds]` firebase credentails  
`FIREBASE_AUTHDOMAIN=[firebase creds]` firebase credentials  
`FIREBASE_DATABASEURL=[firebase creds]` firebase credentials  
`FIREBASE_PROJECTID=[firebase creds]` firebase credentials  
`FIREBASE_STORAGEBUCKET=[firebase creds]` firebase credentials  
`FIREBASE_MESSAGINGSENDERID=[firebase creds]` firebase credentials  
`FIREBASE_APPID=[firebase creds]` firebase credentials  
