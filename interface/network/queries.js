const _ = require('lodash');
const model = require('@models/network')
const print = require('@util/model').print

const queries = `
	extend type Query {
		networks: [Network],
		network(_id: String!): Network
	}
`

const resolvers = {
	networks: async () => {
		await new Promise(r => setTimeout(r, 500));
		return await model.find({})
	},
	network: async (parent, {_id}) => {
		await new Promise(r => setTimeout(r, 1000));
		return await model.findById(_id);
	}
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}