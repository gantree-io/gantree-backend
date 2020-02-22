const User = require('@models/user')

module.exports = {
	typeDef: `
		type Tokens {
			auth: String
			refresh: String
		}

		type User {
			_id: String
			name: String
			email: String
			uid: String
			team: Team
			tokens: Tokens
			status: String
		}

		extend type Query {
			authByFirebaseToken(token: String!): User
		}

		extend type Mutation {
			addUser(email: String!): User!
			deleteUser(_id: String!):  Boolean!
			resendInvitation(_id: String!): Boolean!
			activateUser(_id: String!): Boolean!
			deactivateUser(_id: String!): Boolean!
		}
	`,
	resolvers: {
	 	Query: {
	 		authByFirebaseToken: async (parent, {token}) => await User.authByFirebaseToken(token)
	 	},
	 	Mutation: {
	 		addUser: async (parent, {email}) => await User.add(email),
	 		deleteUser: async (parent, {_id}) => await User.delete(_id),
	 		resendInvitation: async (parent, {_id}) => await User.sendInvitation(_id),
	 		activateUser: async (parent, {_id}) => await User.setStatus(_id, 'ACTIVE'),
	 		deactivateUser: async (parent, {_id}) => await User.setStatus(_id, 'INACTIVE'),
	 	}
	}
}