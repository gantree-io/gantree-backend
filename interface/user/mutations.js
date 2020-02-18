const Network = require('@models/network')
const _ = require('lodash');

const mutation = `
	extend type Mutation {
		addUser(
			name: String!
		): Network!
	}
`

const resolvers = {
	addUser: (parent, args) => {
		console.log(args.name)
		return args.name
	}
}

module.exports = {
	mutations: mutation,
	resolvers: resolvers
}