const mongoose = require('mongoose')
const ProviderSchema = require('@schemas/provider');
const Provider = mongoose.model('provider', ProviderSchema)
const Hotwire = require('@util/hotwire')

// return the network and node count for a given provider
const addNetworkCount = async (_p, team_id) => {
	let networks = await mongoose.models.network.fetchAllByTeam(team_id)
	
	let providerNetworks = []
	let providerNodes = []

	for (var j = 0; j < networks.length; j++) {
		for (var k = 0; k < networks[j].nodes.length; k++) {
			if(networks[j].nodes[k].provider === _p.provider){
				providerNetworks.push(networks[j]._id)
				providerNodes.push(networks[j].nodes[k]._id)
			}
		}
	}
	
	_p.networkCount = [...new Set(providerNetworks)].length
	_p.nodeCount = [...new Set(providerNodes)].length


	return _p
}

// add a new network
Provider.fetchAll = async (team_id, withCount) => {
	let providers = await Provider.find({team: team_id})

	// add count if requested
	if(withCount === true){
		for (var i = 0; i < providers.length; i++) {
			providers[i] = addNetworkCount(providers[i], team_id)
		}
	}
	
	//  add network/node counts if requested
	// providers = withCount === true
	// 	? await addNetworkCount(providers, team_id)
	// 	: providers

	return providers
}

// count the number of providers
Provider.count = async team_id => await Provider.countDocuments({team: team_id})

// add credentials
Provider.add = async (provider, name, credentials, team_id) => {
 	let _existing_creds = await Provider.find({
 		provider: provider,
 		team: team_id
 	})
 
 	if(_existing_creds.length) throw new Error(`Credentials already exists for ${provider}, please delete existing credentials first.`)
 	
 	let _creds = await Provider.create({
 		credentials: credentials,
 		provider: provider,
 		name: name,
 		team: team_id
 	})
 
 	Hotwire.publish('CREDENTIALS', 'ADD', _creds)
 
 	return _creds
}

// parse digital ocean credentials
Provider.addDO = async (digitalocean_token, team_id) => {
	let credentials = JSON.stringify({
		DIGITALOCEAN_TOKEN: digitalocean_token
	})
	return await Provider.add('DO', 'Digital Ocean', credentials, team_id)
}

// parse aws credentials 
Provider.addAWS = async (aws_access_key_id, aws_secret_access_key, team_id) => {
	let credentials = JSON.stringify({
		AWS_ACCESS_KEY_ID: aws_access_key_id,
		AWS_SECRET_ACCESS_KEY: aws_secret_access_key
	})
	return await Provider.add('AWS', 'Amazon Web Services', credentials, team_id)
}

// parse gcp credentials 
Provider.addGCP = async (google_application_credentials, team_id) => {
	let credentials = JSON.stringify({
		GOOGLE_APPLICATION_CREDENTIALS: google_application_credentials,
	})
	return await Provider.add('GCP', 'Google Cloud Credentials', credentials, team_id)
}

Provider.delete = async (_id, team_id) => {
	await Provider.deleteOne({_id: _id, team: team_id})
	Hotwire.publish('CREDENTIALS', 'DELETE')
	return true
}

module.exports = Provider