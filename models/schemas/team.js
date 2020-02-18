const mongoose = require('mongoose')
const util = require('./_util');

module.exports = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required : true,
			autopopulate: true
		},
	},
	{ 
		timestamps: util.timestamps 
	}
)