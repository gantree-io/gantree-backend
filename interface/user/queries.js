const _ = require('lodash');
const model = require('@models/user')

const queries = `
	extend type Query {
		authByFirebaseToken(token: String!): User
	}
`

const resolvers = {
	authByFirebaseToken: async (parent, {token}) => {
		const user = await model.authUsingFirebaseToken(token);
		const auth_token = await model.genrateAuthToken(user.toObject())
		const refresh_token = await model.genrateRefreshToken(user.toObject(), auth_token)

		return {
			...user.toObject(),
			tokens: {
				auth: auth_token,
				refresh: refresh_token
			}
		}
	},
}

module.exports = {
	queries: queries,
	resolvers: resolvers
}