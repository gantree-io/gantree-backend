const mongoose = require('mongoose')
const util = require('./_util');

// schema
const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		repo: {
			type : String,
			required : true,
			trim: true,
		},
		config: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'config',
			required : true,
			trim: true,
		},
		nodes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'node',
			required : true,
			default: []
		}]
	},
	{ timestamps: util.timestamps }
)

schema.set('toJSON', { virtuals: true })

const autoPopulate = function(next) {
	this.populate('nodes').populate('config');
	next();
};

schema.pre('findOne', autoPopulate);
schema.pre('find', autoPopulate);


const model = mongoose.model('network', schema)


// custom model methods
model.myMethod = () => {
	console.log('testing');
	return true
}

module.exports = model