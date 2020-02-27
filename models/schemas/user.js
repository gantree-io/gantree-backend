const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			//required : true,
			trim: true
		},
		email: {
			type : String,
			required : true,
			trim: true,
		},
		uid: {
			type : String,
			//required : true,
			trim: true,
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required : true,
			autopopulate: { maxDepth: 2 }
		},
		status: {
			type : String,
			required : true,
			trim: true,
			enum: ['ACTIVE', 'INACTIVE', 'INVITATION_SENT'],
			default: 'INVITATION_SENT'
		}
	},
	{ 
		timestamps: util.timestamps 
	}
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema