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
		await new Promise(r => setTimeout(r, 500));
		return await model.find({})
	},
	config: async (parent, {_id}) => {
		await new Promise(r => setTimeout(r, 1500));
		return await model.findById(_id)
	},
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}