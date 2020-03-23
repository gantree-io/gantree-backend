const Provider = require('@models/provider')

module.exports = {
	typeDef: `
		type Provider {
			_id: String!
			provider: String!
			name: String!
			team: Team!
			networkCount: Int
			nodeCount: Int
		}

		extend type Query {
			providers(withCount: Boolean): [Provider]!
			providerCount: Int
		}

		extend type Mutation {
			addProviderAWS(aws_access_key_id: String!, aws_secret_access_key: String!): Provider!
			addProviderDO(do_api_token: String!): Provider!
			addProviderGCP(google_application_credentials: String!): Provider!
			deleteProvider(_id: String!): Boolean!
		}
	`,
	resolvers: {
	 	Query: {
	 		providers: async (parent, {withCount}, {team}) => await Provider.fetchAll(team._id, withCount),
	 		providerCount: async (parent, {}, {team}) => await Provider.count(team._id)
	 	},
	 	Mutation: {
	 		addProviderAWS: async (parent, {aws_access_key_id, aws_secret_access_key}, {team}) => await Provider.addAWS(aws_access_key_id, aws_secret_access_key, team._id),
	 		addProviderDO: async (parent, {do_api_token}, {team}) => await Provider.addDO(do_api_token, team._id),
	 		addProviderGCP: async (parent, {google_application_credentials}, {team}) => await Provider.addGCP(google_application_credentials, team._id),
	 		deleteProvider: async (parent, {_id}, {team}) => await Provider.delete(_id, team._id),
	 	}
	}
}