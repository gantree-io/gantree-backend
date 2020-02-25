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
	 		configs: async (_, {}, {user}) => await Config.fetchAll(user),
			config: async (_, {_id}, {user}) => await Config.fetchOne(_id, user)
	 	},
	 	Mutation: {
	 		addConfig: async (_, args, {user}) => await Config.add(args, user),
	 		deleteConfig: async (_, {_id}, {user}) => await Config.delete(_id, user)
	 	}
	}
}