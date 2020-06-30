const mongoose = require('mongoose')
const BinarySchema = require('@schemas/binary');

// model
const Binary = mongoose.model('binary', BinarySchema)

// Binary.fetchByNetwork = async network_id => await Binary.find({ network: network_id })

Binary.add = async ({ method, repository_method, fetch_method, local_method, preset_method, filename }) => await Binary.create({
	method: method,
	repository_method: repository_method,
	fetch_method: fetch_method,
	local_method: local_method,
	preset_method: preset_method,
	filename: filename
})

module.exports = Binary
