const mongoose = require('mongoose')
const Hotwire = require('@util/hotwire')
const util = require('./_util');

const schema = new mongoose.Schema(
	{
		name: {
			type : String,
			required : true,
			trim: true
		},
		binary_url: {
			type : String,
			required : true,
			trim: true,
		},
		binary_name: {
			type : String,
			required : true,
			trim: true,
		},
		chainspec: {
			type : String,
			//type: mongoose.Schema.Types.ObjectId,
			//ref: 'chainspec',
			required : true,
			trim: true,
			//autopopulate: true
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'team',
			required : true,
			trim: true,
			autopopulate: true
		},
		status: {
			type : String,
			enum: ['DEPLOYING', 'ONLINE', 'SHUTDOWN'],
			required : true,
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

// testing random status updates
let found = false
schema.post('find', function(docs) {
 	const randomNodeValues = () => ({
		nodes: {
			online: Math.floor(Math.random() * Math.floor(5)),
			pending: Math.floor(Math.random() * Math.floor(5)),
			offline: Math.floor(Math.random() * Math.floor(5))
		}
 	})

 	if(!found){
 		found = true
	 	docs.map(doc => {
	 		let interval
	 		clearInterval(interval)
			
			Hotwire.publish(doc._id, 'NODESTATUS', randomNodeValues())

	 		interval = setInterval(() => {
	 			Hotwire.publish(doc._id, 'NODESTATUS', randomNodeValues())
	 		}, Math.floor(Math.random() * Math.floor(5000)) + 1000)
	 	})
	 }
});

module.exports = schema