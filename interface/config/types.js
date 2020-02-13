const GraphQLJSON = require('graphql-type-json')

module.exports = `
	type Config {
		_id: String
		name: String
		chainspec: JSON
	}
`;