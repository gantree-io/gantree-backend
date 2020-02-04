const jwt = require('jsonwebtoken');

module.exports = whitelist => {
	return (req, res, next) => {

		const isIntrospectionQuery = undefined === req.body.operationName || 'IntrospectionQuery' === req.body.operationName

		// bypass if operation in whitelist
		if(whitelist.includes(req.body.operationName) || isIntrospectionQuery){
			next()
		}else{
			const authHeader = req.headers['authorization']

			if(!authHeader || !authHeader.startsWith("Bearer ")){
				// need to send an invalid response
				res.json({
					code: 401,
					message: 'Unauthorized',
					success: false
				})
				return
			}

			// should really fetch user from DB and check credentials every time
			req.auth_user = jwt.verify(authHeader.substring(7, authHeader.length), process.env.SECRET_KEY);
			next()
		}
	}
}