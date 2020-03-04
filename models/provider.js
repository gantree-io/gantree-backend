const mongoose = require('mongoose')
const ProviderSchema = require('@schemas/provider');
const Provider = mongoose.model('provider', ProviderSchema)
const Hotwire = require('@util/hotwire')

// add a new network
Provider.fetchAll = async team_id => await Provider.find({team: team_id})

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