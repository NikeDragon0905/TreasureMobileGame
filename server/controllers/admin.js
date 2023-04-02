const PlayMode = require('../models/PlayMode.js')
const PlayLog = require('../models/PlayLog.js')
const User = require('../models/User.js')
const Setting = require('../models/Setting.js')
const Notification = require('../models/Notification.js')
const WithDrawal = require('../models/WithDrawal.js');
const Deposit = require('../models/Deposit.js');

module.exports = {
    // list all playmode
    userlist: async (req, res) => {
        let users = await User.find()
        res.json({success: true, message: 'success', data: {users}})
    },

    // update an existing user
	update: (req, res) => {
		User.findById(req.params.id, (err, user) => {
			Object.assign(user, req.body)
			user.save((err, updatedUser) => {
				res.json({success: true, message: "User updated.", user, data: { user }})
			})
		})
	},

     // delete an existing user
	delete: (req, res) => {
		User.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user, data: { user }})
		})
	},

    // updateSet
    updatesetting: (req, res) => {
        Setting.findById(req.params.id, (err, result) => {
            if (err) {
                console.error(err);
              } else {
                Object.assign(result, req.body)
                result.save((err, updatedUser) => {
                    res.json({success: true, message: "User updated.", data: { setting: result }})
                })
              }
        });
    },

    getsettng: (req, res) => {
        Setting.findOne({}, {}, (err, result) => {
            if (err) {
                console.error(err);
              } else {
                res.json({success: true, message: 'success', data: { setting: result }});
              }
        });
    },

    message: async (req, res) => {
        const {_id, dmsg} = req.body;
        let notification = new Notification();
        notification.user = _id;
        notification.message = dmsg;
        notification
            .save()
            .then(() => res.json({success: true, message: 'success'}))
            .catch(() => res.json({success: false, message: err}));
    },

    withdrawal: async (req, res) => {
        let withdrawals = await WithDrawal.find()
        res.json({success: true, message: 'success', data: {withdrawals}})
    },


    // list all playmodes
	playmode_index: (req, res) => {
		PlayMode.find({}, (err, playmodes) => {
			res.json({success: true, message: "playmode.", data: { playmodes }})
		})
	},

	// get one user
	playmode_show: (req, res) => {
		console.log("Current playmode:")
		PlayMode.findById(req.params.id, (err, playmode) => {
			res.json({success: true, message: "playmode.", data: { playmode }})
		})
	},

	// create a new user
	playmode_create: (req, res) => {
		// res.json({success: true});
		// return;
		PlayMode.create(req.body, (err, playmode) => {
			if(err) {
				console.log(err);
				return res.json({success: false, code: err.code})
			}
			res.json({success: true, message: "playmode created."})
		})
	},

	// update an existing user
	playmode_update: (req, res) => {
		PlayMode.findById(req.params.id, (err, playmode) => {
			Object.assign(playmode, req.body)
			playmode.save((err, updatedUser) => {
				res.json({success: true, message: "playmode updated.", data: { playmode }})
			})
		})
	},

	// delete an existing user
	playmode_destroy: (req, res) => {
		PlayMode.findByIdAndRemove(req.params.id, (err, playmode) => {
			res.json({success: true, message: "playmode deleted.", data: { playmode }})
		})
	},

	deposit: async (req, res) => {
		const deposits = await Deposit.find().populate('user');
		res.json({ success: true, message: 'success', data: { deposits } })
	}

}