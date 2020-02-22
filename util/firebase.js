const firebase = require('firebase-admin');

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

module.exports = {
    verifyToken: async token => await firebase.auth().verifyIdToken(token)
}