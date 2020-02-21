const User = require('@models/user')

const _ = require('lodash');

const mutation = `
	extend type Mutation {
		addUser(
			email: String!
		): User!
		deleteUser(
			_id: String!
		): User
		resendInvitation(
			_id: String!
		): User!
		activateUser(
			_id: String!
		): User!
		deactivateUser(
			_id: String!
		): User!
	}
`

const resolvers = {
	addUser: async (parent, {email}) => await User.add(email),
	deleteUser: async (parent, {_id}) => await User.delete(_id),
	resendInvitation: async (parent, {_id}) => await User.sendInvitation(_id),
	activateUser: async (parent, {_id}) => await User.setStatus(_id, 'ACTIVE'),
	deactivateUser: async (parent, {_id}) => await User.setStatus(_id, 'INACTIVE'),
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}