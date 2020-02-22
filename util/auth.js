const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

/**
 * Generate a jwt auth token for subsequent calls.
 * @param {String} payload - the payload to create sign the token.
 * @returns {jwt} - jwt token signed by payload
 */
const generateAuthToken = async payload => jwt.sign(payload, process.env.SECRET_KEY)

/**
 * TODO: Generate a refresh token for auto login & logout.
 * @param {String} payload - the payload to create sign the token.
 * @param {String} auth_token - the user auth token.
 * @returns {jwt} - jwt token...
 */
const generateRefreshToken = async (payload, auth_token) => 'xxx-todo-xxx'

/**
 * Generate a jwt auth token for subsequent calls.
 * @param {String} payload - the payload to create sign the token.
 * @returns {Object} - containing auth and refresh tokens
 */
const generateTokens = async payload => {
	const auth = generateAuthToken(payload)
	const refresh = generateRefreshToken(payload, auth)
	return {
		auth,
		refresh
	}
}

const handleAuth = (whitelist, {req, res}) => {
	const isIntrospectionQuery = null === req.body.operationName || 'IntrospectionQuery' === req.body.operationName

	try {
		if(whitelist.includes(req.body.operationName) || isIntrospectionQuery){
			return 
		}else{
			const token = req.headers.authorization;

			if(!token || !token.startsWith("Bearer ")) throw new Error('You must be logged in to perform this operation'); 

			const user = jwt.verify(token.substring(7, token.length), process.env.SECRET_KEY);

			if(!user) throw new Error('Incorrect authentication details'); 

			return { user };
		}
	} catch(e) {
		throw new AuthenticationError(e); 
	}
}

module.exports = {
	generateAuthToken: generateAuthToken,
	generateRefreshToken: generateRefreshToken,
	generateTokens: generateTokens,
	handleAuth: handleAuth
}