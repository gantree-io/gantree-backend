const _ = require('lodash');
const model = require('@storage/config')

const queries = `
	extend type Query {
		configs: [Config],
		config(_id: String!): Config
	}
`

const resolvers = {
	configs: async () => {
		const configs = await model.find({})
		return configs
	},
	config: async (parent, {_id}) => {
		return await model.findById(_id)
	},
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}