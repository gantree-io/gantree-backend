const Network = require('@storage/network')
const Node = require('@storage/node')
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
	addNetwork: async (parent, args) => {

		args.nodes = []
		
		// add all nodes to db
		for (var i = 0; i < args.count; i++) {
			let node = await Node.create({
				name: `node-${i}`,
				provider: args.provider,
				status: 'PROCESSING',
				type: args.validator === true ? 'VALIDATOR' : 'FULL'
			})
			
			// push _id to nodes field in args
			args.nodes.push(node._id)
		}
		
		// create network
		const network = await Network.create(args)
		
		return network
	},
	addNode: (parent, args) => {
		console.log(args.name)
		return args.name
	}
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}