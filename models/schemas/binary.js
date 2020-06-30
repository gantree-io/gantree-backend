const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		method: {
			type: String,
			// enum: ['repository', 'fetch', 'local', 'preset'],
			enum: ['repository', 'fetch', 'preset'],
			required: true,
			trim: true,
		},
		repository_method: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'repository_method',
			trim: true,
			autopopulate: true
		},
		fetch_method: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'fetch_method',
			trim: true,
			autopopulate: true
		},
		// local_method: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'local_method',
		// 	trim: true,
		// 	autopopulate: true
		// },
		preset_method: {
			type: String,
			// enum: preset_list,
			trim: true,
		},
		filename: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema