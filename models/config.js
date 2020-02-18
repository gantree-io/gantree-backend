const mongoose = require('mongoose')
const ConfigSchema = require('@schemas/config');

// model
const Config = mongoose.model('config', ConfigSchema)

// custom model methods
Config.testMethod = () => {
	console.log('testing');
	return true
}

module.exports = Config