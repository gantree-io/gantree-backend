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
			autopopulate: true
		},
		nodes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'node',
			required : true,
			default: [],
			autopopulate: true
		}]
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
		room.emit('STATUS', {
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