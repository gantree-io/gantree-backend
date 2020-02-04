// register all aliases
require('module-alias/register')

require('dotenv').config();
const express = require('express');
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser')
const schema = require('./models/gql.schema')
const CrudeAuth = require('./util/crudeauth')

// gql query whitelist
const authWhitelist = [
	'networkList'
]

app.use(cors())
app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
	app.use('/graphql', CrudeAuth(authWhitelist), graphqlHTTP({ schema, graphiql: true }));
	app.listen(process.env.APP_PORT||4000, () => console.log(`GraphQL listening on port ${process.env.APP_PORT||4000}`)); 
})