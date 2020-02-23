const Key = require('@models/key')

module.exports = {
	typeDef: `
		type Key {
			_id: String
			key: String
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
	 		keys: async (parent, {}, {user}) => await Key.fetchAll(user.team._id)
	 	},
	 	Mutation: {
	 		addKey: async (parent, args, {user}) => await Key.add(args, user.team._id),
	 		deleteKey: async (parent, args, {user}) => await Key.delete(args, user.team._id),
	 	}
	}
}