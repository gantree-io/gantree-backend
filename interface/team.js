const Team = require('@models/team')

module.exports = {
	typeDef: `
		type Team {
			_id: String!
			name: String!
			owner: User!
			users: [User]!
		}

		extend type Query {
			team: Team
		}
		
		extend type Mutation {
			updateName: Team
		}
	`,
	resolvers: {
	 	Query: {
	 		team: async (parent, args, {user}) => Team.fetch(user.team_id),
	 	},
	 	Mutation: {
	 		updateName: (parent, {name}, {user}) => Team.updateName(name, user.team_id),
	 	}
	}
}