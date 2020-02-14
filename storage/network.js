const mongoose = require('mongoose')
const util = require('./_util');

// node schema
mongoose.model('node', new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		ip: {
			type : String,
			required : true,
			trim: true
		},
		provider: {
			type : String,
			enum: ['AWS', 'DO', 'GCP'],
			required : true,
			trim: true
		},
		status: {
			type : String,
			enum: ['ONLINE', 'OFFLINE', 'PROCESSING'],
			required : true,
			trim: true
		},
		type: {
			type : String,
			enum: ['VALIDATOR', 'FULL', 'TELEMETRY'],
			required : true,
			trim: true
		}
	},
	{ timestamps: util.timestamps }
))


// schema
const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		config: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'config'
		},
		nodes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'node'
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