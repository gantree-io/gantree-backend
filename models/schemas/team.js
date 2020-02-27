const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
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
			autopopulate: { maxDepth: 1 }
		},
	},
	{ 
		timestamps: util.timestamps 
	}
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema