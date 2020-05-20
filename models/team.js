const mongoose = require('mongoose')
const TeamSchema = require('@schemas/team');
const Team = mongoose.model('team', TeamSchema)
const User = require('./user')
const Hotwire = require('@util/hotwire')
const Names = require('@util/names')
const Emailer = require('@util/emailer')
const NewTeamOwner = require('@email/new_team_owner')

Team.new = async (owner_id) => await Team.create({name: Names.random(), owner: owner_id})

Team.fetch = async _id => {
	const team = await Team.findById(_id, {}, {autopopulate: false});
	const users = await mongoose.models.user.find({team: _id}, {}, {autopopulate: false});
	return {
		...team.toObject(),
		users: users
	}
}

Team.updateName = async (_id, new_name) => {
	const team = await Team.findByIdAndUpdate(_id, {name: new_name}, {new: true})
	Hotwire.publish('TEAM', 'UPDATE')
	return true
}

Team.updateOwner = async (_id, owner, new_owner_id) => {
	const team = await Team.findOneAndUpdate({_id: _id, owner: owner._id}, {owner: new_owner_id}, {new: true})
	//const team = await Team.findOne({_id: _id, owner: owner._id})
	Hotwire.publish('TEAM', 'UPDATE')

	let newOwner = await User.findById(new_owner_id)

	// send email to new owner
	Emailer.send(NewTeamOwner, {
		sender: {
			name: 'Gantree Admin',
			email: process.env.EMAILER_ACC_SENDER,
		},
		to:  newOwner.email,
		vars: {
			name: owner.name,
			team: team.name
		}
	})
	return team
}

module.exports = Team