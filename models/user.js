const mongoose = require('mongoose')
const _ = require('lodash');
const Emailer = require('@util/emailer')
const Invitation = require('@email/invitation')
const Verification = require('@email/verification')
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
	const {uid, name, email, ...rest} = await Firebase.verifyToken(token)

	console.log({uid, name, email, rest})
	console.log({fb: rest.firebase.identities})

	// check DB for existing account
	let _user = await User.findOne({'email': email})

	console.log({_user})

	// if not found: create local account & team
	if(!_user){

		let status = 'ACTIVE'
		let verificationCode = null

		// if user signed up with password....
		if(_.get(rest, 'firebase.sign_in_provider') === 'password'){
			status = 'UNVERIFIED'
			verificationCode = Math.ceil(Math.random() * (999999 - 100000) + 100000)
		}

		console.log({verificationCode})

		// add user
		_user = await User.create({
			name: name,
			email: email,
			uid: uid,
			status: status,
			verificationCode: verificationCode
		})

		// new team with owner
		let _team = await mongoose.models.team.new(_user._id)

		// add team into user
		_user = await User.findByIdAndUpdate(_user._id, {team: _team._id}, { new: true })


		if(status === 'UNVERIFIED'){
			console.log('Sending verification email')
			// send verification email
			Emailer.send(Verification, {
				sender: {
					name: 'Gantree Admin',
					email: process.env.EMAILER_ACC_SENDER,
				},
				to:  _user.email,
				vars: {
					code: verificationCode,
				},
				onFailure: msg =>  console.log(msg)
			})
		}
	}
	// if found but without UID then it's an 'invited user'
	// so add uid
	else if(!_user.uid){
		_user = await User.findByIdAndUpdate(
			_user._id,
			{
				uid: uid,
				//name: name
			},
			{
				new: true
			}
		)
	}

	if(_user.status === 'INACTIVE') throw new AuthenticationError('Inactive account');

	Hotwire.setTeam(_user.team._id)

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
User.invite = async (email, team, authUser) => {
	let _user = await User.create({
		email: email,
		team: team._id,
		status: 'INVITATION_SENT'
	})
	await User.sendInvitation(_user._id, authUser)
	Hotwire.publish('USER', 'ADD', _user)
	return _user
}

User.verifyAccount = async (verificationCode, user) => {
	let _user = await User.findOneAndUpdate(
		{
			_id: user._id,
			verificationCode: verificationCode
		},
		{
			verificationCode: null,
			status: 'ACTIVE'
		}, {
			new: true
		}
	)

	if(!_user) throw new Error("Incorrect verification code")

	return _user
}

/**
 * Set a users' name.
 * @param {String} name - the user name.
 * @returns {User} - the updates user
 */
User.setName = async (name, {_id}) => {
	let user = await User.findByIdAndUpdate(_id, {name: name, status: 'ACTIVE'}, {new: true})
	Hotwire.publish(_id, `UPDATE`, user)
	return user
}

/**
 * Update users' account (name and subscribed)
 * @param {String} name - the user name.
 * @returns {User} - the updates user
 */
User.updateAccount = async (name, subscribed, {_id}) => {
	let user = await User.findByIdAndUpdate(_id, {name: name, subscribed: subscribed}, {new: true})
	Hotwire.publish(_id, `UPDATE`, user)
	return true
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
User.sendInvitation = async (_id, authUser) => {
	let _user = await User.findOne({_id: _id, team: authUser.team._id})

	if(
		!authUser.isTeamOwner() ||
		!_user ||
		_user.status !== 'INVITATION_SENT'
	){
		throw new Error("You cannot perform this operation")
	}

	// async
	Emailer.send(Invitation, {
		sender: {
			name: 'Gantree Admin',
			email: process.env.EMAILER_ACC_SENDER,
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
User.delete = async (_id, user) => {
	// find user to delete
	let userToDelete = await User.findOne({_id: _id, team: user.team._id})

	// permission to delete?
	if(!userToDelete || !user.isTeamOwner()) throw new Error('You do not have permission to delete this user')

	//delete!
	await User.findByIdAndDelete(_id)

	//publish
	Hotwire.publish('USER', 'DELETE')

	return true
}

module.exports = User