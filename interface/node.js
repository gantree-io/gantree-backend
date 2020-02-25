const Node = require('@models/node')

module.exports = {
	typeDef: `
		type Node {
			_id: String
			name: String
			ip: String
			provider: String
			status: String
			type: String
		}

		extend type Query {
			node: [Node],
			nodes(network_id: String!): [Node]
		}

		extend type Mutation {
			addNodes(network_id: String! count: Int! validators: Boolean! provider: String!): [Node]!
			deleteNode(_id: String!): Node!
		}
	`,
	resolvers: {
		Query: {
			node: async (_, {_id}, {user}) => await Node.findOne(_id, user.team_id),
			nodes: async (_, {network_id}, {user}) => await Node.findAll(network_id, user.team_id),
		},
		Mutation: {
			addNodes: async (parent, {count, ...rest}, {user}) => await Node.addMultiple(count, rest, user.team_id),
			deleteNode: async (parent, {_id}, {user}) => await Node.delete(_id, user.team_id),
		}
	}
}