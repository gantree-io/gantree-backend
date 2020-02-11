const types = require('./types') 
const { queries: queryTypes, resolvers: queryResolvers } = require('./queries')
const { mutations: mutationTypes, resolvers: mutationsResolvers } = require('./mutations') 

module.exports = {
	typeDef: `${types} ${queryTypes} ${mutationTypes}`,
	resolvers: {
	 	Query: {
	 		...queryResolvers
	 	},
	 	Mutation: {
	 		...mutationsResolvers
	 	}
	}
}