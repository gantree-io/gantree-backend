require('module-alias/register')
require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const schema = require('@interface/schema')
const mongoose = require('mongoose');



mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
	const server = new ApolloServer({ schema });
	server.listen(process.env.APP_PORT||4000).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
})

