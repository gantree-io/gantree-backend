const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const { queries: NetworkQueries } = require('@models/network')

const Querys = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...NetworkQueries,
    }
});

// const Mutations = new GraphQLObjectType({
// 	name: 'Mutation',
// 	fields: {}
// });

 
module.exports = new GraphQLSchema({
    query: Querys,
   // mutation: Mutations
});