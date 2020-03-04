const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const Node = mongoose.model('node', NodeSchema)

Node.fetchByNetwork = async network_id => await Node.find({network: network_id})

Node.add = async fields => await Node.create({...fields, status: 'PENDING'})

Node.addMultiple = async (count, {network_id, validators, provider}) => {
	let nodes = []

	for (var i = 0; i < count; i++) {
		let node = await Node.add(
			{
				name: `node-${i}`,
				network: network_id,
				type: validators === true ? 'VALIDATOR' : 'FULL',
				provider: provider
			}
		)
		nodes.push(node)
	}

	return nodes
}

// update IP address of node by ID
Node.updateIpAddress = async (_id, ip) => await Node.findOneAndUpdate({_id: _id}, {ip: ip}, {new: true})

module.exports = Node