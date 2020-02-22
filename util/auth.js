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

module.exports = {
	generateAuthToken: generateAuthToken,
	generateRefreshToken: generateRefreshToken,
	generateTokens: generateTokens
}