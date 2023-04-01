const
	express = require('express'),
	clientRouter = new express.Router(),
	clientCtrl = require('../controllers/client.js'),
	verifyToken = require('../serverAuth.js').verifyToken;


    clientRouter.route('/landing')
	.get(clientCtrl.landing);
	
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

module.exports = clientRouter