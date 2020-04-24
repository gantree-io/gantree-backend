const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const getContext = require('@util/context')

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

const handleAuth = async (whitelist, {req, res}) => {
	try {
		const isIntrospectionQuery = null === req.body.operationName || 'IntrospectionQuery' === req.body.operationName
		const token = req.headers.authorization.split(' ')[1]

		if(token){
			const tokenUser = jwt.verify(token, process.env.SECRET_KEY);
			if(!tokenUser) throw new Error('Authentication error');
			//req.user = user

			let context = await getContext(tokenUser._id)
			req.user = context.user
			req.team = context.team

			return req
		}else if(whitelist.includes(req.body.operationName) || isIntrospectionQuery){
			return req
		}else{
			throw new Error('Authentication error');
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