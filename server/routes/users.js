const
	express = require('express'),
	usersRouter = new express.Router(),
	usersCtrl = require('../controllers/users.js'),
	verifyToken = require('../serverAuth.js').verifyToken;


usersRouter.route('/')
	.get(usersCtrl.index)
	.post(usersCtrl.create)

usersRouter.post('/authenticate', usersCtrl.authenticate)


// usersRouter.use(verifyToken)
usersRouter.route('/:id')
	.get(verifyToken, usersCtrl.show)
	.patch(verifyToken, usersCtrl.update)
	.delete(verifyToken, usersCtrl.destroy)

module.exports = usersRouter