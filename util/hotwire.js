const io = require('socket.io')();
const Log = require('@util/logger')

let _socket
let _team


const init = ({port}) => {
	return new Promise((resolve, reject) => {
		if(!_socket){
			io.on('connection', socket => {

				_socket = socket

				socket.on('disconnect', () => {
					Log(`user disconnected`)
				});

				socket.on('joinroom', room => {
					socket.join(room);
					Log(`room joined ${room}`)
				});

				socket.on('leaveroom', room => {
					socket.leave(room);
					Log(`room left ${room}`)
				});

				resolve(socket)
			})

			io.listen(port);
		}else{
			resolve(_socket)
		}
	});
}

const setTeam = team => _team = team

const publish = (room, event, data=null) => {
	let _e = `${_team}.${room}.${event}`
	io.to(_e).emit(_e, data)
}

module.exports = {
	init: init,
	setTeam: setTeam,
	publish: publish
}