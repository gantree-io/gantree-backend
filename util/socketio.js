const io = require('socket.io')();

let _socket
let _rooms = []

const _init = ({port}) => {
	return new Promise((resolve, reject) => {
		if(!_socket){
			io.on('connection', socket => {

				_socket = socket

				socket.on('disconnect', () => {
					console.log(`user disconnected`)
				});

				socket.on('joinroom', room => {
					socket.join(room);
					_rooms.push(room)
					console.log(`room joined ${room}`)
				});

				socket.on('leaveroom', room => {
					socket.leave(room);
					delete _rooms[room]
					console.log(`room left ${room}`)
				});

				resolve(socket)
			})

			io.listen(port);
		}else{
			resolve(_socket)
		}
	});
}

const _room_use = _room => {
	return {
		emit: (event, message) => {
			io.to(`${_room}.${event}`).emit(`${_room}.${event}`, message)
		}
	}
}

module.exports = {
	init: _init,
	rooms: {
		list: () => _rooms,
		use: _room_use
	},
}