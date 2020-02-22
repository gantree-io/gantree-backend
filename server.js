require('module-alias/register')
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const schema = require('@interface/_schema')
const socket = require('@util/socketio')
const Auth = require('@util/auth')

// gql query whitelist
const authWhitelist = [
	'authByFirebaseToken',
	'keys',
]

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
	const server = new ApolloServer({ 
		schema,
		//context: integrationContext => Auth.handleAuth(authWhitelist, integrationContext)
	});
	
	server.listen(process.env.GRAPHQL_PORT||4000).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
	socket.init({ port: process.env.SOCKETIO_PORT })
})