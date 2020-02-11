# 🏄‍♂️ Gantree | GraphQL API Server

Spin up an instance:

1. Clone repo
2. fetch all module dependencies: `$> yarn` 
3. Copy .env.example to .env and update values (see below)
4. Start a mongo instance and create a DB

Use one of the following node app managers

##### Local Dev Server | [nodemon](https://www.npmjs.com/package/nodemon)
`nodemon -L server.js` 

##### Production Server | [pm2](https://www.npmjs.com/package/pm2)
`pm2 start server.js --name "some-name-to-remember-it-by"`

##### .env
`APP_PORT=4000` Listening port  
`MONGODB_URL=mongodb://localhost:27017/adb`  Database url  
`SECRET_KEY=xxx` a secret key used to signing JTW tokens (longer the better)  