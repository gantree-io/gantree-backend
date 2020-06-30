const mongoose = require('mongoose')
const BinarySchema = require('@schemas/binary');

// model
const Binary = mongoose.model('binary', BinarySchema)

Binary.add = async ({ method, repository, fetch, local, preset, filename }) => await Binary.create({
	method: method,
	repository: repository,
	fetch: fetch,
	local: local,
	preset: preset,
	filename: filename
})

Binary.fetchByNetwork = async network_id => await Binary.find({ network: network_id })

module.exports = Binary
