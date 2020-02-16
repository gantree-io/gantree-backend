const mongoose = require('mongoose')
const NetworkSchema = require('@schemas/network');
const Node = require('./node')

// model
const model = mongoose.model('network', NetworkSchema)

// add a new network
model.add = async network => {
	// nodes to empty array
	network.nodes = []
	
	// add all nodes to db
	for (var i = 0; i < network.count; i++) {
		let node = await Node.create({
			name: `node-${i}`,
			provider: network.provider,
			status: 'PENDING',
			type: network.validator === true ? 'VALIDATOR' : 'FULL'
		})
		
		// push _id to nodes field in network
		network.nodes.push(node._id)
	}
	
	// TODO: pipe to worker/taskrunner? to start build process/job & send socket updates
	// or just palm off to async functon?

	return await model.create(network)
}

module.exports = model