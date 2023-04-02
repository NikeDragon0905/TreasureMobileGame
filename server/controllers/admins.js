const Admin = require('../models/Admin.js')
const signToken = require('../adminAuth.js').signToken

module.exports = {
	// list all users
	index: (req, res) => {
		Admin.find({role: { $ne: '*' }}, (err, users) => {
			res.json({success: true, message: 'success', data:{ admins: users }});
		})
	},

	// get one user
	show: (req, res) => {
		Admin.findById(req.params.id, (err, user) => {
			res.json(user)
		})
	},

	// create a new user
	create: (req, res) => {
		// res.json({success: true});
		// return;
		Admin.create(req.body, (err, user) => {
			if(err) {
				console.log(err);
				return res.json({success: false, code: err.code})
			}
			// once user is created, generate a token to "log in":
			const token = signToken(user)
			res.json({success: true, message: "User created.", token})
		})
	},

	// update an existing user
	update: (req, res) => {
		Admin.findById(req.params.id, (err, user) => {
			Object.assign(user, req.body)
			user.save((err, updatedUser) => {
				res.json({success: true, message: "User updated.", user})
			})
		})
	},

	// delete an existing user
	destroy: (req, res) => {
		Admin.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user})
		})
	},

	// the login route
	authenticate: (req, res) => {
		// check if the user exists
		Admin.findOne({email: req.body.email}, (err, user) => {
			// if there's no user or the password is invalid
			if(!user || !user.validPassword(req.body.password)) {
				// deny access
				return res.json({success: false, message: "Invalid credentials."})
			}
			const token = signToken(user)
			res.json({success: true, message: "Login successful.", token});
		})
	}
}