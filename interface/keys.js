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
			addKey(key: String!): Key!
			deleteKey(_id: String!):  Boolean!
		}
	`,
	resolvers: {
	 	Query: {
	 		keys: async (parent, {user}) => await Key.fetchAll()
	 	},
	 	Mutation: {
	 		addKey: async (parent, {key, user}) => await Key.add(key),
	 		deleteKey: async (parent, {_id}) => await Key.delete(_id),
	 	}
	}
}