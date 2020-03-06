const socket = require('@util/socketio')

let team

const publish = (room, event, data=null) => socket.rooms.use(team+room).emit(event, data)

module.exports = {
	setTeam: team => _team = team,
	publish: publish
}