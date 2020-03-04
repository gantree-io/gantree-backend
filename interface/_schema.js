const { gql, makeExecutableSchema } = require('apollo-server');
const _ = require('lodash');
const Chainspec = require('./chainspec')
const Network = require('./network')
const Node = require('./node')
const User = require('./user')
const Team = require('./team')
const Provider = require('./provider')

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
		Chainspec.typeDef, 
		Network.typeDef,
		Node.typeDef,
		User.typeDef,
		Team.typeDef,
		Provider.typeDef,
	],
	resolvers: [
		Chainspec.resolvers,
		Network.resolvers,
		Node.resolvers,
		User.resolvers,
		Team.resolvers,
		Provider.resolvers,
	],
});
