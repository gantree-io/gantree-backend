const mongoose = require('mongoose')
const ChainspecSchema = require('@schemas/chainspec');
const Chainspec = mongoose.model('chainspec', ChainspecSchema)
const Hotwire = require('@util/hotwire')
const TeamStorage = require('@util/teamstorage')

const getChainspecWithJson = async (_id, team_id) => {
	let chainspec = await Chainspec.findOne({_id: _id, team: team_id})
	let json = new TeamStorage(team_id).chainspec.get(chainspec.file, {asJson: true})
	return {
		...chainspec.toObject(),
		file: json
	}
}

const getNetworkCount = async (_c, team_id) => await mongoose.models.network.countDocuments({chainspec: _c._id, team: team_id})



// const addNetworkCount = async (_p, team_id) => {
// 	let networks = await mongoose.models.network.fetchAllByTeam(team_id)
// 	
// 	let providerNetworks = []
// 	let providerNodes = []
// 
// 	for (var j = 0; j < networks.length; j++) {
// 		for (var k = 0; k < networks[j].nodes.length; k++) {
// 			if(networks[j].nodes[k].provider === _p.provider){
// 				providerNetworks.push(networks[j]._id)
// 				providerNodes.push(networks[j].nodes[k]._id)
// 			}
// 		}
// 	}
// 	
// 	_p.networkCount = [...new Set(providerNetworks)].length
// 	_p.nodeCount = [...new Set(providerNodes)].length
// 
// 
// 	return _p
// }


Chainspec.all = async (team_id, withCount) => {
	let chainspecs = await Chainspec.find({team: team_id})
	
	//add count if requested
	if(withCount === true){
		for (var i = 0; i < chainspecs.length; i++) {
			chainspecs[i].networkCount = await getNetworkCount(chainspecs[i], team_id)	
		}
	}

	return chainspecs
}

Chainspec.byId = async (_id, full, team_id) => {
	let chainspec = await getChainspecWithJson(_id, team_id)

	if(full !== true){
		chainspec.file.genesis.raw.top = "[hidden - download to see full json]"
	}
	
	return {
		...chainspec,
		file: JSON.stringify(chainspec.file, null, 4)
	}
}

Chainspec.add = async (name, chainspec, team_id) => {

	// add chainspec to DB
	let _chainspec = await Chainspec.create({name: name, team: team_id})

	// add chainspec file
	let ts = new TeamStorage(team_id)
	let chainspec_filename = ts.chainspec.set({
		name: _chainspec._id,
		content: chainspec
	})
	
	// update _chainspec with filename
	_chainspec = await Chainspec.findByIdAndUpdate(_chainspec._id, {file: chainspec_filename})

	Hotwire.publish('CHAINSPEC', 'ADD')
	
	return _chainspec
}

Chainspec.delete = async (_id, team_id) => {
	// get current chainspec
	let _c = await Chainspec.findById(_id)
	// remove chainspec file
	new TeamStorage(team_id).chainspec.delete(_c.file)
	// delete chainspec
	await Chainspec.deleteOne({_id: _id, team: team_id})
	Hotwire.publish('CHAINSPEC', 'DELETE')
	return true
}

module.exports = Chainspec