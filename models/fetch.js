const mongoose = require('mongoose')
const FetchMethodSchema = require('@schemas/fetch_method');

// model
const FetchMethod = mongoose.model('fetch_method', FetchMethodSchema)

FetchMethod.add = async ({ url, sha256, network }) => await FetchMethod.create({
	url: url,
	sha256: sha256,
	network: network
})

FetchMethod.fetchByUrl = async url => await FetchMethod.find({ url: url })

module.exports = FetchMethod
