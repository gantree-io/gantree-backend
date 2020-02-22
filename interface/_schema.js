const { gql, makeExecutableSchema } = require('apollo-server');
const _ = require('lodash');
const Config = require('./config')
const Network = require('./network')
const User = require('./user')
const Team = require('./team')
const Keys = require('./keys')

const rootDef = gql`
	type Query {
		root: String
	}

	type Mutation {
		root: String
	}
`;

module.exports = makeExecutableSchema({
	typeDefs: [
		rootDef, 
		Config.typeDef, 
		Network.typeDef, 
		User.typeDef,
		Team.typeDef,
		Keys.typeDef,
	],
	resolvers: [
		Config.resolvers,
		Network.resolvers, 
		User.resolvers,
		Team.resolvers,
		Keys.resolvers,
	],
});
