const
	express = require('express'),
	AdminsRouter = new express.Router(),
	adminsCtrl = require('../controllers/admins.js'),
	verifyToken = require('../adminAuth.js').verifyToken;


AdminsRouter.route('/')
	.get(adminsCtrl.index)
	.post(adminsCtrl.create)

AdminsRouter.post('/authenticate', adminsCtrl.authenticate)


// AdminsRouter.use(verifyToken)
AdminsRouter.route('/:id')
	.get(verifyToken, adminsCtrl.show)
	.patch(verifyToken, adminsCtrl.update)
	.delete(verifyToken, adminsCtrl.destroy)

module.exports = AdminsRouter