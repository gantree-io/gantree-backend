const FetchMethod = require('@models/fetch_method')

module.exports = {
    typeDef: `
		type FetchMethod {
			_id: String!
			url: String!
			sha256: String!
        }
        
        extend type Query {
			fetch_method: [FetchMethod],
		}
	`,
    resolvers: {
        Query: {
            fetch_method: async (_, { _id }, { user }) => await FetchMethod.findOne(_id, user.team_id),
        }
    }
}