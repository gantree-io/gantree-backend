const mongoose = require('mongoose')
const NodeSchema = require('@schemas/node');

// model
const Node = mongoose.model('node', NodeSchema)

Node.fetchByNetwork = async network_id => await Node.find({ network: network_id })

Node.add = async (
	{
		name,
		instance,
		status = 'PENDING',
		type = 'FULL',
		pallet_options,
		binary_options,
		chain,
		is_bin_chainspec,
		network
	}
) => {
	const provider = instance.provider // TEMPORARY
	const ip = instance.ip // TEMPORARY
	const validator = type === 'FULL' ? false : true // TEMPORARY

	await Node.create({
		name: name,
		instance: instance,
		status: status,
		type: type,
		pallet_options: pallet_options,
		binary_options: binary_options,
		chain: chain,
		is_bin_chainspec: is_bin_chainspec,
		network: network
	})
}

// TODO(Denver): needs adapting
Node.addMultiple = async ({ node_args_list, network_id }) => {
	// name,
	// instance,
	// status = 'PENDING',
	// type = 'FULL',
	// pallet_options,
	// binary_options,
	// chain,
	// is_bin_chainspec,
	// network

	node_args_list = node_args_list.map((node_args) => {
		return {
			...node_args,
			network: network_id
		}
	})

	return await Node.insertMany(node_args_list)
}

// Node.addMultiple = async (count, { network_id, validator, provider, status = 'DEPLOYING' }) => {
// 	let items = Array.apply(null, Array(count)).map((_, i) => ({
// 		name: `node-${i}`,
// 		network: network_id,
// 		validator: validator,
// 		provider: provider,
// 		status: status
// 	}))

// 	return await Node.insertMany(items)
// }

// update IP address of node by ID
Node.updateIpAddress = async (_id, ip) => await Node.findOneAndUpdate({ _id: _id }, { ip: ip }, { new: true })

module.exports = Node