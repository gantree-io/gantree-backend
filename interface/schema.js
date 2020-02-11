const { gql, makeExecutableSchema } = require('apollo-server');
const _ = require('lodash');
const Config = require('./config')
const Network = require('./network')

const rootDef = gql`
	type Query {
		root: String
	}

	type Mutation {
		root: String
	}
`;

module.exports = makeExecutableSchema({
	typeDefs: [rootDef, Config.typeDef, Network.typeDef],
	resolvers: [Config.resolvers, Network.resolvers],
});
