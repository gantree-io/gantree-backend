const mongoose = require('mongoose')
const KeySchema = require('@schemas/key');

// model
const Key = mongoose.model('key', KeySchema)

// add a new network
Key.fetchAll = async team_id => {
	console.log(323232)
	return []
}

module.exports = Key