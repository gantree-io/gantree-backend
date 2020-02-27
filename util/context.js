const mongoose = require('mongoose')
const { AuthenticationError } = require('apollo-server');

let user
let team

const Team = async id => {
	let _team = (await mongoose.models.team.findOne({'_id': id}, {}, {autopopulate: false})).toObject()

	let _methods = {
	}

	return { ..._team, ..._methods }
}

const User = async id => {
	let _user = (await mongoose.models.user.findOne({'_id': id}, {}, {autopopulate: false})).toObject()

	if(_user.status === 'INACTIVE') throw new AuthenticationError('Inactive account'); 

	let _methods = {
		isTeamOwner: () => team.owner.toString() === user._id.toString()
	}
	
	return { ..._user, ..._methods }
}

module.exports = async id => {
	user = await User(id)
	team = await Team(user.team)

	return {
		user: user,
		team: team,
	}
}