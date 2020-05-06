require('module-alias/register')
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const schema = require('@interface/_schema')
const Hotwire = require('@util/hotwire')
const Auth = require('@util/auth')

// gql query whitelist
const authWhitelist = [
	'ping',
	'authByFirebaseToken',
	'authByApiKey',
	'addCliNetwork'
]

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.connection.once('open', () => {
	const server = new ApolloServer({
		schema,
		context: integrationContext => Auth.handleAuth(authWhitelist, integrationContext),
	});

	server.listen(process.env.GRAPHQL_PORT||4000).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
	Hotwire.init({ port: process.env.SOCKETIO_PORT })
})