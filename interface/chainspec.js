//const GraphQLJSON = require('graphql-type-json')
const Chainspec = require('@models/chainspec')

module.exports = {
	typeDef: `
		type Chainspec {
			_id: String
			name: String
			file: String,
			team: Team
		}

		extend type Query {
			chainspecs: [Chainspec]!,
			chainspec(_id: String! full: Boolean): Chainspec!
		}
		
		extend type Mutation {
			addChainspec(name: String! chainspec: String!): Chainspec
			deleteChainspec(_id: String!): Chainspec
		}
	`,
	resolvers: {
	 	Query: {
	 		chainspecs: async (_, {}, {team}) => await Chainspec.all(team._id),
			chainspec: async (_, {_id, full}, {team}) => await Chainspec.byId(_id, full, team._id),
	 	},
	 	Mutation: {
	 		addChainspec: async (_, {name, chainspec}, {team}) => await Chainspec.add(name, chainspec, team._id),
	 		deleteChainspec: async (_, {_id}, {team}) => await Chainspec.delete(_id, team._id)
	 	}
	}
}