const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		instance: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'instance',
			required: true,
			trim: true,
			autopopulate: true
		},
		status: {
			type: String,
			enum: ['DEPLOYING', 'CONFIGURING', 'ONLINE', 'SHUTDOWN', 'ERROR'],
			required: true,
			trim: true,
			default: 'DEPLOYING'
		},
		type: {
			type: String,
			enum: ['VALIDATOR', 'FULL'],
			required: true,
			trim: true
		},
		pallet_options: {
			type: String,
			required: true,
			trim: true
		},
		binary_options: {
			type: String,
			required: true,
			trim: true
		},
		chain: {
			type: String,
			required: true,
			trim: true
		},
		is_bin_chainspec: {
			type: String,
			required: true,
			trim: true
		},
		network: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'network',
			required: true,
			trim: true,
			autopopulate: true
		}
	},
	{
		timestamps: util.timestamps
	}
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema