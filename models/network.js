const mongoose = require('mongoose')
const NetworkSchema = require('@schemas/network');
const Node = require('./node')

// model
const Network = mongoose.model('network', NetworkSchema)

// add a new network
Network.add = async _network => {
	// nodes to empty array
	_network.nodes = []
	
	// add all nodes to db
	for (var i = 0; i < _network.count; i++) {
		let node = await Node.create({
			name: `node-${i}`,
			provider: _network.provider,
			status: 'PENDING',
			type: _network.validator === true ? 'VALIDATOR' : 'FULL'
		})
		
		// push _id to nodes field in network
		_network.nodes.push(node._id)
	}
	
	// TODO: pipe to worker/taskrunner? to start build process/job & send socket updates
	// or just palm off to async functon?

	return await Network.create(_network)
}

module.exports = Network