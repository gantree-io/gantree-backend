const { GraphQLString, GraphQLList } = require('graphql');
const { ServerResponseType, formatResponse } = require('@helpers/graphql')
const model = require('./db.model');
const { NetworkList } = require('./gql.types')

const networkList = {
	type: NetworkList,
	args: {},
	async resolve(parent, args) {
		const networks = model.networkList()
		return {
			networks: networks,
			response: formatResponse(200)
		}
	}
}

module.exports = {
	networkList: networkList,
}