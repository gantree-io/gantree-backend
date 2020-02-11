const _ = require('lodash');
const model = require('@storage/network')

const queries = `
	extend type Query {
		networks: [Network],
		network(_id: String!): Network
	}
`

const resolvers = {
	networks: async () => await model.find({}),
	network: async (parent, {_id}) => model.findById(_id)
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}