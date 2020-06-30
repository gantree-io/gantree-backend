const mongoose = require('mongoose')
const RepositorySchema = require('@schemas/repository_method');

// model
const Repository = mongoose.model('repository_method', RepositorySchema)

Repository.add = async ({ url, sha256, network }) => await Repository.create({
	url: url,
	sha256: sha256,
	network: network
})

Repository.fetchByUrl = async url => await Repository.find({ url: url })

module.exports = Repository
