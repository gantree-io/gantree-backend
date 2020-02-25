const mongoose = require('mongoose')
const NetworkSchema = require('@schemas/network');
const Node = require('./node')
const Hotwire = require('@util/hotwire')

// model
const Network = mongoose.model('network', NetworkSchema)

// add a new network
Network.add = async ({name, repo, config, validators, provider, count}, team_id) => {

	const network = await Network.create({
		name: name,
		repo: repo,
		config: config,
		team: team_id
	})

	Node.addMultiple(
		count, 
		{
			network_id: network._id, 
			validators: validators, 
			provider: provider
		}, 
		team_id
	)
	
	// TODO: pipe to worker/taskrunner? to start build process/job & send socket updates
	// or just palm off to async functon?

	Hotwire.publish('NETWORK', 'ADD')

	return network
}

Network.delete = async (_id, team_id) => {
	
	// get network with team_id
	const network = await Network.findOne({_id: _id, team: team_id})

	// none? error
	if(!network) throw new Error('Network not found')

	// delete all nodes on this network
	await Node.deleteMany({network: _id})
	
	// delete network
	await Network.findByIdAndDelete(_id)
	
	// boom --->*
	Hotwire.publish('NETWORK', 'DELETE')

	return true
}

Network.fetchById  = async (_id, team_id) => {
	const network = await Network.findOne({_id: _id, team: team_id})
	const nodes = await Node.fetchByNetwork(network._id)
	return {
		...network.toObject(),
		nodes: nodes
	}
}

Network.fetchAllByTeam = async team_id => {
	const networks = await Network.find({team: team_id})
	const _all = []
	for (var i = 0; i < networks.length; i++) {
		let network = await Network.fetchById(networks[i]._id, team_id)
		_all.push(network)
	}
	return _all
}

module.exports = Network