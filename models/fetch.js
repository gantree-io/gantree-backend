const mongoose = require('mongoose')
const FetchSchema = require('@schemas/fetch');

// model
const Fetch = mongoose.model('fetch', FetchSchema)

Fetch.add = async ({ url, sha256, network }) => await Fetch.create({
	url: url,
	sha256: sha256,
	network: network
})

Fetch.fetchByUrl = async url => await Fetch.find({ url: url })

module.exports = Fetch
