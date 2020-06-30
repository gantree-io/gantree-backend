const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		method: {
			type: String,
			enum: ['repository', 'fetch', 'local', 'preset'],
			required: true,
			trim: true,
		},
		repository: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'repository',
			trim: true,
			autopopulate: true
		},
		fetch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'fetch',
			trim: true,
			autopopulate: true
		},
		local: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'local',
			trim: true,
			autopopulate: true
		},
		preset: {
			type: String,
			// enum: preset_list,
			required: true,
			trim: true,
		},
		filename: {
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
	{ timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema