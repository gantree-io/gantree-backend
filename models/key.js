const mongoose = require('mongoose')
const KeySchema = require('@schemas/key');
const Key = mongoose.model('key', KeySchema)
const Hotwire = require('@util/hotwire')

// add a new network
Key.fetchAll = async team_id => await Key.find({team: team_id})


Key.add = async ({key, provider}, team) => {
	let _key = await Key.find({
		provider: provider,
		team: team
	})

	if(_key.length) throw new Error('Key already exists for this provider, please delete existing key first.')
	
	_key = await Key.create({
		key: key,
		provider: provider,
		team: team
	})

	Hotwire.publish('KEY', 'ADD', _key)

	return _key
}

Key.delete = async ({_id}, team) => {
	let _key = await Key.find({
		_id: _id,
		team: team
	})

	if(!_key.length) throw new Error('Error: Key not found')

	await Key.findByIdAndDelete(_id)

	Hotwire.publish('KEY', 'DELETE')

	return true
}

module.exports = Key