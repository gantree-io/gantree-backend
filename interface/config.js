const GraphQLJSON = require('graphql-type-json')
const Config = require('@models/config')

module.exports = {
	typeDef: `
		scalar JSON

		type Config {
			_id: String
			name: String
			chainspec: JSON,
			team: Team
		}

		extend type Query {
			configs: [Config]!,
			config(_id: String!): Config!
		}
		
		extend type Mutation {
			addConfig(name: String! chainspec: JSON!): Config
			deleteConfig(_id: String!): Config
		}
	`,
	resolvers: {
	 	Query: {
	 		configs: async (_, {}, {team}) => await Config.all(team._id),
			config: async (_, {_id}, {team}) => await Config.byid(_id, team._id),
	 	},
	 	Mutation: {
	 		addConfig: async (_, args, {team}) => await Config.add(args, team._id),
	 		deleteConfig: async (_, {_id}, {team}) => await Config.delete(_id, team._id)
	 	}
	}
}