const mongoose = require('mongoose')
const nodemailer = require("nodemailer");

// schemas
const UserSchema = require('@schemas/user');

// models
const Team = require('./team')
const User = mongoose.model('user', UserSchema)

// util
const Hotwire = require('@util/hotwire')
const Firebase = require('@util/firebase')
const Auth = require('@util/auth')

/**
 * Authenticate user by firebase token.
 * @param {String} token - the firebase token sent from the client.
 * @returns {User} - user + auth tokens
 */
User.authByFirebaseToken = async token => {
	const {uid, name, email} = await Firebase.verifyToken(token)

	// check DB for existing account
	let _user = await User.findOne({'uid': uid})

	// if not found: create local account
	if(!_user){
		
		// new user
		_user = await User.create({
			name: name,
			email: email,
			uid: uid,
			status: 'ACTIVE'
		})

		// new team with owner
		let _team = await Team.new(_user._id)
		
		// add team into user
		await User.findByIdAndUpdate(_user._id, {team: _team._id})
	}
	
	return {
		..._user.toObject(),
		tokens: Auth.generateTokens(_user.toObject())
	}
}

/**
 * Add a new user to a team & send invitation.
 * @param {String} email - the user email address.
 * @returns {User} - the newly created user
 */
User.add = async email => {
	let _user = await User.create({
		email: email, 
		team: '5e4a53efaa93387adf02a031', 
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
User.setName = async (fields, {_id}) => {
	let user = await User.findByIdAndUpdate(_id, {name: fields.name}, {new: true})
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

	try {

 		let testAccount = await nodemailer.createTestAccount();
 
 		let transporter = nodemailer.createTransport({
 			host: "smtp.ethereal.email",
 			port: 587,
 			secure: false,
 			auth: {
 				user: testAccount.user,
 				pass: testAccount.pass 
 			}
 		});
 
 		let info = await transporter.sendMail({
 			from: `"${_user.team.owner.name}" <${_user.team.owner.email}>`,
 			to: _user.email,
 			subject: "Gantree Invitation", 
 			text: "Gantree Invitation: http://localhost:5000",
 			html: `
 				<b>You've been invited to Gantree</b>
 				<p>${_user.team.owner.name} from team '${_user.team.name}' has invited you to use gantree.</p>
 				<p>Click this link to create your account: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
 			`
 		});
 		console.log(nodemailer.getTestMessageUrl(info))
	} catch(e) {
		console.log(e);
	}

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