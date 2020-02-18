const Network = require('@models/team')
const _ = require('lodash');

const mutation = `
	extend type Mutation {
		addMember(
			name: String!
		): Network!
	}
`

const resolvers = {
	addMember: (parent, args) => {
		console.log(args.name)
		return args.name
	}
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}