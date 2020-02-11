const mutation = `
	extend type Mutation {
		addNetwork(
			name: String!
		): Network!
		
		addNode(
			name: String!
		): Node!
	}
`

const resolvers = {
	addNetwork: (parent, args) => {
		console.log(args.name)
		return args.name
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