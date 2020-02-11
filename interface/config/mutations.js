const mutation = `
	extend type Mutation {
		addConfig(
			name: String!
		): Config!
	}
`

const resolvers = {
	addConfig: (parent, args) => {
		console.log(args.name)
		return args.name
	}
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}