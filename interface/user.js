const User = require('@models/user')

module.exports = {
	typeDef: `
		type Tokens {
			auth: String
			refresh: String
		}

		type User {
			_id: String!
			name: String
			email: String
			uid: String
			team: Team
			tokens: Tokens
			status: String!
			subscribed: Boolean!
			verificationCode: String,
			apiKey: String,
		}

		extend type Query {
			authByFirebaseToken(token: String!): User
			authByApiKey(key: String!): User
			verifyAccount(verificationCode: Int): User!
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
	 		authByFirebaseToken: async (parent, {token}) => await User.authByFirebaseToken(token),
	 		authByApiKey: async (parent, {apiKey}) => await User.authByApiKey(apiKey),
			verifyAccount: async (parent, {verificationCode}, {user}) => User.verifyAccount(verificationCode, user)
	 	},
	 	Mutation: {
	 		inviteUser: async (parent, {email}, {team, user}) => await User.invite(email, team, user),
	 		setName: async (parent, {name}, {user}) => await User.setName(name, user),
	 		updateAccount: async (parent, {name, subscribed}, {user}) => await User.updateAccount(name, subscribed, user._id),
	 		deleteUser: async (parent, {_id}, {user}) => await User.delete(_id, user),
	 		resendInvitation: async (parent, {_id}, {user}) => await User.sendInvitation(_id, user),
	 		activateUser: async (parent, {_id}) => await User.setStatus(_id, 'ACTIVE'),
	 		deactivateUser: async (parent, {_id}) => await User.setStatus(_id, 'INACTIVE')
	 	}
	}
}