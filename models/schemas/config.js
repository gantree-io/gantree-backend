const mongoose = require('mongoose')
const util = require('./_util');

module.exports = new mongoose.Schema(
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