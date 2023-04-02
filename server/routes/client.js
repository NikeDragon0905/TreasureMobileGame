const
	express = require('express'),
	clientRouter = new express.Router(),
	clientCtrl = require('../controllers/client.js'),
	verifyToken = require('../serverAuth.js').verifyToken;

    clientRouter.route('/landing')
	.get(clientCtrl.landing);

	clientRouter.route('/forgotpassword')
	.post(clientCtrl.resetpassword)
	
	clientRouter.use(verifyToken)

	clientRouter.route('/home')
	.get(clientCtrl.home)

	clientRouter.route('/pre-check')
	.post(clientCtrl.precheck)

	clientRouter.route('/end-game')
	.post(clientCtrl.endgame)

	clientRouter.route('/wallet')
	.get(clientCtrl.wallet)

	clientRouter.route('/leaderboard')
	.get(clientCtrl.leaderboard)

	clientRouter.route('/profile')
	.get(clientCtrl.profile);

	clientRouter.route('/withdrawal')
	.post(clientCtrl.withdrawal)


	clientRouter.route('/notifications')
	.get(clientCtrl.getNotification)
	clientRouter.route('/notifications/:id')
	.patch(clientCtrl.updateNotification)
	clientRouter.route('/notifications/check-all')
	.post(clientCtrl.checkAllNotification)

module.exports = clientRouter