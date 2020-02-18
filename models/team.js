const mongoose = require('mongoose')
const TeamSchema = require('@schemas/team');

const Team = mongoose.model('team', TeamSchema)

Team.new = async (owner_id) => {
	return await Team.create({name: Names[Math.floor(Math.random() * Math.floor(Names.length))], owner: owner_id})
}

module.exports = Team