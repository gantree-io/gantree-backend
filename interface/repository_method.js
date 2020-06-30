const RepositoryMethod = require('@models/repository_method')

module.exports = {
    typeDef: `
		type RepositoryMethod {
			_id: String!
			url: String!
			sha256: String!
        }
        
        extend type Query {
			repository_method: [RepositoryMethod],
		}
	`,
    resolvers: {
        Query: {
            repository_method: async (_, { _id }, { user }) => await RepositoryMethod.findOne(_id, user.team_id),
        }
    }
}