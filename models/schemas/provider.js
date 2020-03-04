const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required: true,
			autopopulate: true
		},
		provider: {
			type: String,
			enum: ['DO', 'AWS', 'GCP'],
			required : true,
			trim: true,
		},
		name: {
			type: String,
			trim: true,
		},
		credentials: {
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