const mongoose = require('mongoose')
const NetworkSchema = require('@schemas/network');
const Node = require('./node')
const Provider = require('./provider')
const Hotwire = require('@util/hotwire')
const Gantree = require('@util/gantree')
const md5 = require('md5')
const TeamStorage = require('@util/teamstorage')

// model
const Network = mongoose.model('network', NetworkSchema)

// add a new network
Network.add = async ({name, binary_url, binary_name, chainspec, validators, provider, count, project_id}, team_id) => {

	const ts = new TeamStorage(team_id)
	
	// get provider credentails
	const creds = await Provider.findOne({_id: provider, team: team_id})
 	
	// add network to DB
	const network = await Network.create({
		name: name,
		binary_url: binary_url,
		binary_name: binary_name,
		chainspec: chainspec,
		team: team_id
	})
	
	// add nodes to DB
	let nodes = Node.addMultiple(
		count, 
		{
			network_id: network._id, 
			validator: validators, 
			provider: creds.provider
		}
	)


	//////////////////////////////////////////
	// build config, store chainspec, 
	// create ssh keys && deploy network
	//////////////////////////////////////////

	try {
		// create a new config
		let config = new Gantree.config(network._id)
		config.binaryUrl = binary_url
		config.binaryName = binary_name
		
		// the chainspec can be one of the following
		// 'new' | Build New Spec | ???
		// 'default' | Use Default Spec | Some default spec provided
		// _id | use custom chainspec from DB
		if(chainspec === 'new'){
			config.useDefaultSpec = false
		}else if(chainspec === 'default'){
			config.useDefaultSpec = true
		}else{
			// get chainspec file
			let _chainspec = await mongoose.models.chainspec.findById(chainspec)
			// resolve path
			let chainspecPath = ts.chainspec.path(_chainspec.file)
			// set file
			config.chainspecPath = chainspecPath
		}

		// create SSH key pair
		let ts_network = ts.useNetwork(network._id)
		let { publicKey, privateKey } = ts_network.generateKeys()

		// configure nodes
		Array.apply(null, Array(count)).map((_, i) => {
			config.addNode({
				provider: creds.provider,
				sshKey: publicKey,
				projectID: project_id
			})
		})
		
		// save the config file
		let configPath = ts_network.addConfig(config.json)
		
		// trigger gantree 
		Gantree.createNetwork({
			configpath: configPath,
			providerCredentails: JSON.parse(creds.credentials), 
			sshPrivateKey: privateKey 
		})
		// return IP addresses on completion
		.then(async ips => {
			// add IP addresses to network nodes
			// should match count
			// may run into issues when user has ability to
			// provision validator and non-validator nodes
			// together, as need to know which is which 
			//let nodes = await Node.find({network: network._id})
			for (var i = 0; i < nodes.length; i++) {
				await Node.findOneAndUpdate({_id: nodes[i]._id}, {ip: ips[i], status: 'ONLINE'}, {new: true})
				Hotwire.publish(nodes[i]._id, 'UPDATE')
			}
			
			// publish an update
			Hotwire.publish(network._id, 'UPDATE')

			// TODO: listen for node online status and update
			// need to create a taskrunner, listener type system
			// to listen to nodes and wait until they're online
			
		}).catch(e => {
		 	console.log(e.message)
		})
	} catch(e) {
		// statements
		console.log(e.message);
	}

	Hotwire.publish('NETWORK', 'ADD')

	return network
}

Network.delete = async (_id, team_id) => {

	// delete network from fs
	let ts_network = new TeamStorage(team_id).useNetwork(_id)
	
	// get config path
	let configPath = ts_network.configPath()
		
	// set network & nodes to SHUTDOWN status
	await Network.findByIdAndUpdate(_id, {status: 'SHUTDOWN'})
	await Node.updateMany({network: _id}, {status: 'SHUTDOWN'})
	
	// async delete network via gantree
	Gantree.deleteNetwork({configpath: configPath}).then(async result => {
		await Node.deleteMany({network: _id})
		await Network.findByIdAndDelete(_id)
		ts_network.delete()
		Hotwire.publish('NETWORK', 'DELETE')
	}).catch(e => {
	 	console.log(e.message)
	})

	// boom ====> - - -  pew pew
	Hotwire.publish('NETWORK', 'UPDATE')

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