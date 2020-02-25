const { gql, makeExecutableSchema } = require('apollo-server');
const _ = require('lodash');
const Config = require('./config')
const Network = require('./network')
const Node = require('./node')
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
		Node.typeDef,
		User.typeDef,
		Team.typeDef,
		Keys.typeDef,
	],
	resolvers: [
		Config.resolvers,
		Network.resolvers,
		Node.resolvers,
		User.resolvers,
		Team.resolvers,
		Keys.resolvers,
	],
});
