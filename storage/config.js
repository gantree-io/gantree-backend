const mongoose = require('mongoose')
const util = require('./_util');

// schema
const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		chainspec: {
			type : String,
			required : true,
			trim: true
		}
	},
	{ timestamps: util.timestamps }
)


// model
const model = mongoose.model('config', schema)


// custom model methods
model.myMethod = () => {
	console.log('testing');
	return true
}


module.exports = model