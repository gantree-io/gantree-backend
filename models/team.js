const mongoose = require('mongoose')
const TeamSchema = require('@schemas/team');
const Team = mongoose.model('team', TeamSchema)
const User = require('./user')
const Hotwire = require('@util/hotwire')
const Names = require('@util/names')

Team.new = async (owner_id) => await Team.create({name: Names.random(), owner: owner_id})

Team.fetch = async _id => {
	const team = await Team.findById(_id)
	const users = await mongoose.models.user.find({ team: _id});

	return {
		...team.toObject(),
		users: users
	}
}

Team.updateName = async (name, {team_id}) => {
	const team = await Team.findByIdAndUpdate(team_id, {name: name}, {new: true})
	Hotwire.publish(team_id, 'UPDATE')
	return team
}

module.exports = Team