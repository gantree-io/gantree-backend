const Network = require('@models/network')

module.exports = {
	typeDef: `
		type Network {
			_id: String!
			name: String!
			status: String!
			binary_url: String!
			binary_name: String!
			binary_opts: [String],
			chainspec: String!
			nodes: [Node]
			team: Team!
		}

		extend type Query {
			networks: [Network],
			network(_id: String!): Network
		}

		extend type Mutation {
			addNetwork(name: String! count: Int! validators: Boolean! provider: String! binary_url: String! binary_name: String! binary_opts: [String], chainspec: String! project_id: String): Network!
			deleteNetwork(_id: String!): Boolean
		}
	`,
	resolvers: {
		Query: {
			networks: async (_, {}, {team}) => await Network.fetchAllByTeam(team._id),
			network: async (_, {_id}, {team}) => await Network.fetchById(_id, team._id)
		},
		Mutation: {
			addNetwork: async (_, network, {team}) => await Network.add(network, team._id),
			deleteNetwork: async (_, {_id}, {team}) => await Network.delete(_id, team._id)
		}
	}
}