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


Chainspec.all = async team_id =>  await Chainspec.find({team: team_id})

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