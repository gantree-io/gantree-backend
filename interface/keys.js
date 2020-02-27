const Key = require('@models/key')

module.exports = {
	typeDef: `
		type Key {
			_id: String
			provider: String
			team: Team
		}

		extend type Query {
			keys: [Key!]
		}

		extend type Mutation {
			addKey(key: String!, provider: String!): Key!
			deleteKey(_id: String!):  Boolean!
		}
	`,
	resolvers: {
	 	Query: {
	 		keys: async (parent, {}, {team}) => await Key.fetchAll(team._id)
	 	},
	 	Mutation: {
	 		addKey: async (parent, args, {team}) => await Key.add(args, team._id),
	 		deleteKey: async (parent, args, {team}) => await Key.delete(args, team._id),
	 	}
	}
}