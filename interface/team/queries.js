const _ = require('lodash');
const Team = require('@models/team')
const User = require('@models/user')

const queries = `
	extend type Query {
		team: Team
	}
`

const resolvers = {
	team: async (parent, {aa}, {user}) => {
		const team = await Team.findById(user.team._id)
		const users = await User.find({ team: team._id});

		return {
			...team.toObject(),
			users: users
		}
	},
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}