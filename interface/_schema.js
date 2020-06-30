const { gql, makeExecutableSchema } = require('apollo-server');
const _ = require('lodash');
const Chainspec = require('./chainspec')
const Network = require('./network')
const Node = require('./node')
const User = require('./user')
const Team = require('./team')
const Provider = require('./provider')
const FetchMethod = require('./fetch_method')
const RepositoryMethod = require('./repository_method')

const rootTypeDef = gql`
	type Query {
		root: String
	}

	type Mutation {
		root: String
	}

	extend type Query {
		ping: Boolean,
	}
`;

const rootResolvers = {
	Query: {
		ping: async () => true,
	}
}

module.exports = makeExecutableSchema({
	typeDefs: [
		rootTypeDef,
		Chainspec.typeDef,
		Network.typeDef,
		Node.typeDef,
		User.typeDef,
		Team.typeDef,
		Provider.typeDef,
		FetchMethod.typeDef,
		RepositoryMethod.typeDef
	],
	resolvers: [
		rootResolvers,
		Chainspec.resolvers,
		Network.resolvers,
		Node.resolvers,
		User.resolvers,
		Team.resolvers,
		Provider.resolvers,
		FetchMethod.resolvers,
		RepositoryMethod.resolvers
	],
});
