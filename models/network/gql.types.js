const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLEnumType } = require('graphql');
const { ServerResponseType } = require('@helpers/graphql')

const Node = new GraphQLObjectType({
	name: 'node',
	fields: () => ({
		_id: { type: GraphQLString },
		name: { type: GraphQLString },
		ip: { type: GraphQLString },
		provider: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

const Network = new GraphQLObjectType({
	name: 'network',
	fields: () => ({
		_id: { type: GraphQLString },
		name: { type: GraphQLString },
		nodes: { type: new GraphQLList(Node) },
	})
})

const NetworkList = new GraphQLObjectType({
	name: 'networkList',
	fields: () => ({
		networks: { type: new GraphQLList(Network) },
		response: { type: ServerResponseType }
	})
})

module.exports = {
	Network: Network,
	NetworkList: NetworkList,
}