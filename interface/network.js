const Network = require('@models/network')

module.exports = {
  typeDef: `
		type Network {
			_id: String!
      project_id: String!
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
			network(_id: String!): Network,
      networkByProjectId(project_id: String!): Network
		}

		extend type Mutation {
			addNetwork(project_id: String! count: Int! validators: Boolean! provider: String! binary_url: String! binary_name: String! binary_opts: [String], chainspec: String! project_id: String): Network!
			deleteNetwork(_id: String!): Boolean
      addCliNetwork(cli_nodes: String! config: String!): Boolean
      deleteCliNetwork(_id: String!): Boolean
      syncNetwork(project_id: String! platform: String! network_args: String!): Boolean
		}
	`,
  resolvers: {
    Query: {
      networks: async (_, { }, { team }) =>
        await Network.fetchAllByTeam(team._id),
      network: async (_, { _id }, { team }) =>
        await Network.fetchById(_id, team._id),
      networkByProjectId: async (_, { project_id }, { team }) =>
        await Network.fetchByProjectId(project_id, team._id)
    },
    Mutation: {
      addNetwork: async (_, network, { team }) =>
        await Network.add(network, team._id),
      deleteNetwork: async (_, { _id }, { team }) =>
        await Network.delete(_id, team._id),
      addCliNetwork: async (_, { cli_nodes, config }, { team }) =>
        await Network.addViaCli(cli_nodes, config, team._id),
      deleteCliNetwork: async (_, { _id }, { team }) =>
        await Network.deleteViaCli(_id, team._id),
      // NOTE(Denver): will need to parse sudoconfig too
      syncNetwork: async (_, { project_id, platform, network_args }, { team }) =>
        await Network.sync(project_id, platform, network_args, team._id)
    }
  }
}
