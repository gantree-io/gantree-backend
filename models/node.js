const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const Node = mongoose.model('node', NodeSchema)

// custom model methods
Node.testMethod = () => {
	console.log('testing');
	return true
}

module.exports = Node