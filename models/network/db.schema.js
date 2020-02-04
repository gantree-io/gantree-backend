const mongoose = require('mongoose')
const timestamps = require('@helpers/timestamps');
const schemaMethods = require('./db.schema.methods');

const Network = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		}
	},
	{ timestamps: timestamps }
)


/*
	extend the default schema methods with custom methods
*/

// Network.methods = {
// 	...Network.methods,
// 	...schemaMethods.Project
// }

module.exports = Network