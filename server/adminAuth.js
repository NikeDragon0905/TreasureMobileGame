const
	jwt = require('jsonwebtoken'),
	Admin = require('./models/Admin.js'),
	expiresIn = 3600000,
	{ JWT_SECRET } = process.env || 'rcr'


// function for creating tokens
function signToken(user) {
	// toObject() returns a basic js object with only the info from the db
	const userData = user.toObject()
	let payload;
	delete userData.password,
	payload = {...userData, iat: Date.now()}
	return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

// function for verifying tokens
function verifyToken(req, res, next) {
	// grab token from either headers, req.body, or query string
	const token = req.get('token') || req.body.token || req.query.token
	// if no token present, deny access
	if(!token) return res.json({success: false, message: "No token provided"})
	// otherwise, try to verify token
	jwt.verify(token, JWT_SECRET, (err, decodedData) => {
		// if problem with token verification, deny access
		if(err) return res.json({success: false, message: "Invalid token.", code: 401})
		if((new Date()).getTime() > decodedData.iat + expiresIn) return res.json({success: false, message: "expired token.", code: 401})
		// otherwise, search for user by id that was embedded in token
		Admin.findById(decodedData._id, (err, user) => {
			// if no user, deny access
			if(!user) return res.json({success: false, message: "Invalid token.", code: 401})
			// otherwise, add user to req object
			req.user = user
			// go on to process the route:
			next()
		})
	})
}

module.exports = {
	signToken,
	verifyToken
}