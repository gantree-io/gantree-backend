const mongoose = require('mongoose')
const firebase = require('firebase-admin');
const jwt = require('jsonwebtoken');
const Team = require('./team')
const UserSchema = require('@schemas/user');
const User = mongoose.model('user', UserSchema)

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

module.exports = User