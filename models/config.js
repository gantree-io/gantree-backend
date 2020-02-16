const mongoose = require('mongoose')
const ConfigSchema = require('@schemas/config');

// model
const model = mongoose.model('config', ConfigSchema)

// custom model methods
model.testMethod = () => {
	console.log('testing');
	return true
}

module.exports = model