const mongoose = require('mongoose')
const util = require('./_util');

const RepositoryMethod = require('./repository_method')
const FetchMethod = require('./fetch_method')

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
			type: RepositoryMethod,
			trim: true,
			autopopulate: true
		},
		fetch_method: {
			type: FetchMethod,
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
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required: true,
			trim: true,
			autopopulate: true
		},
	},
	{ timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema