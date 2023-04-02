const
	express = require('express'),
	adminRouter = new express.Router(),
	adminCtrl = require('../controllers/admin.js'),
    adminsRouter = require('./admins.js'),
	verifyToken = require('../adminAuth.js').verifyToken;

    adminRouter.use('/users', adminsRouter)
    
	adminRouter.use(verifyToken)

	adminRouter.route('/userlist')
	.get(adminCtrl.userlist)

    adminRouter.route('/userlist/:id')
        .patch(adminCtrl.update)
        .delete(adminCtrl.delete)


    adminRouter.get('/setting/', adminCtrl.getsettng),

    adminRouter.route('/setting/:id')
    .patch(adminCtrl.updatesetting)

    adminRouter.post('/message', adminCtrl.message)

    adminRouter.get('/withdrawal', adminCtrl.withdrawal)
    

    adminRouter.route('/playmodes')
	.get(adminCtrl.playmode_index)
	.post(adminCtrl.playmode_create)
    adminRouter.route('/playmodes/:id')
	.get(adminCtrl.playmode_show)
	.patch(adminCtrl.playmode_update)
	.delete(adminCtrl.playmode_destroy)

module.exports = adminRouter