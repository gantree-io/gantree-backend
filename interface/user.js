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
			subscribed: Boolean
		}

		extend type Query {
			authByFirebaseToken(token: String!): User
		}

		extend type Mutation {
			inviteUser(email: String!): User!
			setName(name: String!): User!
			updateAccount(name: String! subscribed: Boolean!): Boolean!
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
	 		inviteUser: async (parent, {email}, {team}) => await User.invite(email, team),
	 		setName: async (parent, {name}, {user}) => await User.setName(name, user),
	 		updateAccount: async (parent, {name, subscribed}, {user}) => await User.updateAccount(name, subscribed, user._id),
	 		deleteUser: async (parent, {_id}) => await User.delete(_id),
	 		resendInvitation: async (parent, {_id}) => await User.sendInvitation(_id),
	 		activateUser: async (parent, {_id}) => await User.setStatus(_id, 'ACTIVE'),
	 		deactivateUser: async (parent, {_id}) => await User.setStatus(_id, 'INACTIVE'),
	 	}
	}
}