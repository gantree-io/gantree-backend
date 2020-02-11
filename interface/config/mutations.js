const model = require('@storage/config')

const mutation = `
	extend type Mutation {
		addConfig(
			name: String!
			chainspec: String!
		): Config!
		deleteConfig(
			id: String!
		): Config!
	}
`

const resolvers = {
	addConfig: async (parent, args) => await model.create(args),
	deleteConfig: async (parent, args) => await model.deleteOne({_id: args.id})
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}