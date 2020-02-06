const { GraphQLString, GraphQLList } = require('graphql');
const { ServerResponseType, formatResponse } = require('@helpers/graphql')
const model = require('./db.model');
const { NetworkList, NodeList } = require('./gql.types')

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

const nodeList = {
	type: NodeList,
	args: {
		networkId: { type: GraphQLString }
	},
	async resolve(parent, args) {
		const nodes = model.nodeList(args.networkId)
		return {
			nodes: nodes,
			response: formatResponse(200)
		}
	}
}

module.exports = {
	networkList: networkList,
	nodeList: nodeList
}