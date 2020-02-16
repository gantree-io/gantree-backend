const GraphQLJSON = require('graphql-type-json')
const model = require('@models/config')

const mutation = `
	scalar JSON
	extend type Mutation {
		addConfig(
			name: String!
			chainspec: JSON!
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