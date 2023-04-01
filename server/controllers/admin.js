const PlayMode = require('../models/PlayMode.js')
const PlayLog = require('../models/PlayLog.js')
const User = require('../models/User.js')
const Setting = require('../models/Setting.js')
const Notification = require('../models/Notification.js')

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

}