const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const Node = mongoose.model('node', NodeSchema)

Node.fetchByNetwork = async network_id => await Node.find({network: network_id})

// Node.add = async ({name, provider, ip, status='PENDING', validator=false, network}) => await Node.create({
// 	status: 'PENDING', 
// 	name: name,
// 	provider: provider,
// 	ip: ip,
// 	status: status,
// 	validator: validator,
// 	network: network,
// })

Node.addMultiple = async (count, {network_id, validator, provider, status='DEPLOYING'}) => {
	let items = Array.apply(null, Array(count)).map((_, i) => ({
		name: `node-${i}`,
		network: network_id,
		validator: validator,
		provider: provider,
		status: status
	}))

	return await Node.insertMany(items)
}

// update IP address of node by ID
Node.updateIpAddress = async (_id, ip) => await Node.findOneAndUpdate({_id: _id}, {ip: ip}, {new: true})

module.exports = Node