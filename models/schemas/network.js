const mongoose = require('mongoose')
const socket = require('@util/socketio')
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
schema.post('find', function(docs) {

	const sendUpdate = room => {
		room.emit('NODESTATUS', {
			nodes: {
				online: Math.floor(Math.random() * Math.floor(5)),
				pending: Math.floor(Math.random() * Math.floor(5)),
				offline: Math.floor(Math.random() * Math.floor(5))
			}
		});
	}

	docs.map(doc => {
		let interval
		clearInterval(interval)
		const room = socket.rooms.use(doc._id)
		sendUpdate(room)
		interval = setInterval(() => sendUpdate(room), Math.floor(Math.random() * Math.floor(5000)) + 1000)
	})
});

module.exports = schema