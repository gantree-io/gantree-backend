const mongoose = require('mongoose')
const LocalSchema = require('@schemas/local_method');

// model
const Local = mongoose.model('local_method', LocalSchema)

Local.add = async ({ url, sha256, network }) => await Local.create({
	url: url,
	sha256: sha256,
	network: network
})

Local.fetchByUrl = async url => await Local.find({ url: url })

module.exports = Local
