const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const Node = mongoose.model('node', NodeSchema)

Node.fetchByNetwork = async network_id => await Node.find({network: network_id})

Node.add = async (fields, team_id) => await Node.create({...fields, status: 'PENDING'})

Node.addMultiple = async (count, {network_id, validators, provider}, team_id) => {
	let nodes = []

	for (var i = 0; i < count; i++) {
		let node = await Node.add(
			{
				name: `node-${i}`,
				network: network_id,
				type: validators === true ? 'VALIDATOR' : 'FULL',
				provider: provider
			},
			team_id
		)
		nodes.push(node)
	}

	return nodes
}


module.exports = Node