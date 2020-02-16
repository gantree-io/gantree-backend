const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const model = mongoose.model('node', NodeSchema)

// custom model methods
model.testMethod = () => {
	console.log('testing');
	return true
}

module.exports = model