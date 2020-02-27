const mongoose = require('mongoose')
const ConfigSchema = require('@schemas/config');
const Config = mongoose.model('config', ConfigSchema)
const Hotwire = require('@util/hotwire')


Config.all = async team_id => await Config.find({team: team_id})

Config.byid = async (_id, team_id) => await Config.findOne({_id: _id, team: team_id})

Config.add = async (args, team_id) => {
	let config = await Config.create({ ...args, team: team_id})
	Hotwire.publish('CONFIG', 'ADD')
	return config
}

Config.delete = async (_id, team_id) => {
	let config = await Config.deleteOne({_id: _id, team: team_id})
	Hotwire.publish('CONFIG', 'DELETE')
	return true
}

module.exports = Config