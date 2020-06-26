const mongoose = require('mongoose')
const Hotwire = require('@util/hotwire')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		project_id: {
			type: String,
			required: true,
			trim: true
		},
		binary_url: {
			type: String,
			required: true,
			trim: true,
		},
		binary_name: {
			type: String,
			required: true,
			trim: true,
		},
		chainspec: {
			type: String,
			//type: mongoose.Schema.Types.ObjectId,
			//ref: 'chainspec',
			required: true,
			trim: true,
			//autopopulate: true
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required: true,
			trim: true,
			autopopulate: true
		},
		status: {
			type: String,
			enum: ['DEPLOYING', 'CONFIGURING', 'ONLINE', 'SHUTDOWN', "ERROR"],
			required: true,
			trim: true,
			default: 'DEPLOYING'
		}
	},
	{
		timestamps: util.timestamps
	}
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema