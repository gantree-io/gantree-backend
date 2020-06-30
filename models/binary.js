const mongoose = require('mongoose')
const BinarySchema = require('@schemas/binary');

// model
const Binary = mongoose.model('binary', BinarySchema)

Binary.fetchByNetwork = async network_id => await Binary.find({ network: network_id })

Binary.add = async ({ method, repository, fetch, local, preset, filename, network }) => await Binary.create({
	method: method,
	repository: repository,
	fetch: fetch,
	local: local,
	preset: preset,
	filename: filename,
	network: network
})

module.exports = Binary
