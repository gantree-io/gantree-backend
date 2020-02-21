const mongoose = require('mongoose')
const firebase = require('firebase-admin');
const jwt = require('jsonwebtoken');
const Team = require('./team')
const UserSchema = require('@schemas/user');
const User = mongoose.model('user', UserSchema)
const Hotwire = require('@util/hotwire')
const nodemailer = require("nodemailer");

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomain: process.env.FIREBASE_AUTHDOMAIN,
	databaseURL: process.env.FIREBASE_DATABASEURL,
	projectId: process.env.FIREBASE_PROJECTID,
	storageBucket: process.env.FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
	appId: process.env.FIREBASE_APPID,
}

firebase.initializeApp(firebaseConfig)

User.authUsingFirebaseToken = async token => {
	const firebaseUser = await firebase.auth().verifyIdToken(token)

	// check DB for existing account
	let _user = await User.findOne({'uid': firebaseUser.uid})

	// if not found: create local account
	if(!_user){
		
		// new user
		_user = await User.create({
			name: firebaseUser.name,
			email: firebaseUser.email,
			uid: firebaseUser.uid,
			//team: _team._id,
			status: 'ACTIVE'
		})

		// new team with owner
		let _team = await Team.new(_user._id)
		
		// add team into user
		await User.findByIdAndUpdate(_user._id, {team: _team._id})
	}
	
	return _user
}

User.genrateAuthToken = async payload => jwt.sign(payload, process.env.SECRET_KEY)

//todo
User.genrateRefreshToken = async (user, auth_token) => 'xxx-todo-xxx'

User.setStatus = async (_id, status) => {
	await User.updateOne({_id: _id}, {status: status})
	let _user = await User.findById(_id);
	Hotwire.publish(_id, `UPDATE`, _user)
	return _user;
}

User.add = async email => {
	let _user = await User.create({email: email, team: '5e4a53efaa93387adf02a031', status: 'INVITATION_SENT'})
	User.sendInvitation(_user._id)
	Hotwire.publish('USER', 'ADD', _user)
	return _user
}

User.sendInvitation = async _id => {
	let _user = await User.findById(_id)

	if(_user.status !== 'INVITATION_SENT'){
		throw new Error("Blah BLah")
	}

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

	return _user
}

User.delete = async _id => {
	console.log(_id)
	await User.findByIdAndDelete(_id)
	Hotwire.publish('USER', 'DELETE')
	return true
}


module.exports = User