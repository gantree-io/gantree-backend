const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			trim: true
		},
		provider: {
			type: String,
			enum: ['DO', 'AWS', 'GCP'],
			required : true,
			trim: true,
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required: true,
			autopopulate: true
		},
	},
	{ timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema