require('module-alias/register')
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const express = require('express')
const schema = require('@interface/_schema')
const Hotwire = require('@util/hotwire')
const Auth = require('@util/auth')
const PromRouter = require('@telemetry/promrouter')

// gql query whitelist
const authWhitelist = [
	'ping',
	'authByFirebaseToken',
	'authByApiKey',
	'addCliNetwork',
	'deleteCliNetwork'
]

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.connection.once('open', () => {
	const server = new ApolloServer({
		schema,
		context: integrationContext => Auth.handleAuth(authWhitelist, integrationContext),
	});

	server.listen(process.env.GRAPHQL_PORT || 4000).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
	Hotwire.init({ port: process.env.SOCKETIO_PORT })

	/** REST api */
	const app = express()
	app.get('*', (req, res) => {
		// res.send("Hello, World!")
		console.log(req)
		PromRouter.handleReq(req, res).then((promRes) => {
			// console.log(promRes)
			res.send(promRes)
		}).catch((error) => {
			res.send(error)
		})

		// auth
		// get team
		// how do we get the network we want
		// --- do we add another identifier
		// --- we can probably set that up during provisioning with another custom header
		// transform query (single networks only)
		// send off to prometheus
		// give prometheus response to client
	})
	app.listen(process.env.REST_PORT || 4100) // TODO: set port based on constant or env var
})
