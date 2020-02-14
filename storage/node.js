const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		provider: {
			type : String,
			required : true,
			trim: true,
			enum: ['DO', 'AWS', 'GCP'],
		},
		ip: {
			type : String,
			trim: true
		},
		status: {
			type : String,
			enum: ['ONLINE', 'OFFLINE', 'PENDING'],
			required : true,
			trim: true,
			default: 'PENDING'
		},
		type: {
			type : String,
			enum: ['VALIDATOR', 'FULL'],
			required : true,
			trim: true
		}
	},
	{ timestamps: util.timestamps }
)

const model = mongoose.model('node', schema)

module.exports = model