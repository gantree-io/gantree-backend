const Network = require('@models/network')
const _ = require('lodash');

const mutation = `
	extend type Mutation {
		addNetwork(
			name: String!
			count: Int!
			validators: Boolean!
			provider: String!
			repo: String!
			config: String!
		): Network!
		
		addNode(
			name: String!
		): Node!
	}
`

const resolvers = {
	addNetwork: async (parent, _network) => await Network.add(_network),
	addNode: (parent, args) => {
		console.log(args.name)
		return args.name
	}
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}