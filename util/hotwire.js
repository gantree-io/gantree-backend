const socket = require('@util/socketio')

const publish = (room, event, data=null) => socket.rooms.use(room).emit(event, data)

module.exports = {
	publish: publish
}