const { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLString } = require('graphql');

module.exports = {
    ServerResponseType: new GraphQLObjectType({
        name: 'ServerResponse',
        fields: () => ({
            code: { type: GraphQLInt },
            success: { type: GraphQLBoolean },
            message: { type: GraphQLString }
        })
    }),
    responseType: {
        code: { type: GraphQLInt },
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString }
    },
    formatResponse: (code=200, message) => ({
        code: code,
        message: message ? message : (code === 200 ? 'Success' : 'Error 🔥'),
        success: code === 200
    })
}