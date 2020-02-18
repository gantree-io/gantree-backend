const _ = require('lodash');
const Team = require('@models/team')
const User = require('@models/user')

const queries = `
	extend type Query {
		team: Team
	}
`

const resolvers = {
	team: async (parent, {user}) => {
		//fake user account
		user = {
			team: '5e4a53efaa93387adf02a031'
		}

		const team = await Team.findById(user.team)
		const users = await User.find({ team: user.team});

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