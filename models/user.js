const mongoose = require('mongoose')
const email = require('@util/emailer')
const Invitation = require('@email/invitation')
const UserSchema = require('@schemas/user');
const User = mongoose.model('user', UserSchema)
const Hotwire = require('@util/hotwire')
const Firebase = require('@util/firebase')
const Auth = require('@util/auth')
const { AuthenticationError } = require('apollo-server');

/**
 * Authenticate user by firebase token.
 * @param {String} token - the firebase token sent from the client.
 * @returns {User} - user + auth tokens
 */
User.authByFirebaseToken = async token => {
	const {uid, name, email} = await Firebase.verifyToken(token)

	// check DB for existing account
	let _user = await User.findOne({'email': email})

	if(_user.status === 'INACTIVE') throw new AuthenticationError('Inactive account'); 

	// if not found: create local account
	if(!_user){
		
		// add user
		_user = await User.create({
			name: name,
			email: email,
			uid: uid,
			status: 'ACTIVE'
		})

		// new team with owner
		let _team = await mongoose.models.team.new(_user._id)
		
		// add team into user
		_user = await User.findByIdAndUpdate(_user._id, {team: _team._id})
	}
	// if found but without UID then it's an 'invited user'
	// so add uid
	else if(!_user.uid){
		_user = await User.findByIdAndUpdate(_user._id, {uid: uid}, {new: true})
	}

	return {
		..._user.toObject(),
		tokens: Auth.generateTokens({
			_id: _user._id,
			team_id: _user.team._id
		})
	}
}

/**
 * Add a new user to a team & send invitation.
 * @param {String} email - the user email address.
 * @returns {User} - the newly created user
 */
User.invite = async (email, team) => {
	let _user = await User.create({
		email: email, 
		team: team._id, 
		status: 'INVITATION_SENT'
	})
	await User.sendInvitation(_user._id)
	Hotwire.publish('USER', 'ADD', _user)
	return _user
}

/**
 * Set a users' name.
 * @param {String} name - the user name.
 * @returns {User} - the updates user
 */
User.setName = async (name, {_id}) => {
	let user = await User.findByIdAndUpdate(_id, {name: fields.name, status: 'ACTIVE'}, {new: true})
	Hotwire.publish(_id, `UPDATE`, user)
	return user
}

/**
 * Set a user status.
 * @param {String} _id - the mongoose user _id.
 * @param {String} status - the new status to set.
 * @returns {Boolean}
 */
User.setStatus = async (_id, status) => {
	let user = await User.findByIdAndUpdate(_id, {status: status}, {new: true})
	Hotwire.publish(_id, `UPDATE`, user)
	return true
}

/**
 * Send an invitation to an email address.
 * @param {String} _id - the user mongoose ID.
 * @returns {Boolean}
 */
User.sendInvitation = async _id => {
	let _user = await User.findById(_id)

	if(_user.status !== 'INVITATION_SENT') throw new Error("Can only send invitations to users who are waiting on them")

	// async
	await email.send(Invitation, {
		sender: {
			name: _user.team.owner.name,
			email: _user.team.owner.email, 
		},
		to:  _user.email,
		vars: {
			name: _user.team.owner.name,
			team: _user.team.name
		}
	})

	return true
}

/**
 * Delete a user by _id.
 * @param {String} _id - the user mongoose ID.
 * @returns {Boolean}
 */
User.delete = async _id => {
	// TODO test auth levels
	await User.findByIdAndDelete(_id)
	Hotwire.publish('USER', 'DELETE')
	return true
}

module.exports = User