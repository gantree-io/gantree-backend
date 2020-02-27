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
			updateName(_id: String!): Team
			updateOwner(_id: String!): Team
		}
	`,
	resolvers: {
	 	Query: {
	 		team: async (parent, args, {team}) => await Team.fetch(team._id),
	 	},
	 	Mutation: {
	 		updateName: async (parent, {name}, {team}) => await Team.updateName(team._id, name),
	 		updateOwner: async (parent, {_id}, {user, team}) => await Team.updateOwner(team._id, user, _id),
	 	}
	}
}