const PlayMode = require('../models/PlayMode.js')
const PlayLog = require('../models/PlayLog.js')
const User = require('../models/User.js')
const Setting = require('../models/Setting.js')
const WithDrawal = require('../models/WithDrawal.js')
const Notification = require('../models/Notification.js')

const getNotification = async (req, res) => {
    let notifications = await Notification.find({user: req.user.id, is_shown: false});
    res.json({ success: true, message: 'success', data: {notifications}})
}

module.exports = {
    // list all playmode
    home: async (req, res) => {
        // PlayMode.find({}, (err, playmodes) => {
        //     if (err) {
        //         res.json({
        //             success: false,
        //             message: err
        //         })
        //         return
        //     }
        //     const startOfDay = new Date()
        //     startOfDay.setHours(0, 0, 0, 0)

        //     const endOfDay = new Date()
        //     endOfDay.setHours(23, 59, 59, 999)

        //     PlayLog.aggregate([{
        //             $match: {
        //                 updated_at: {
        //                     $gte: new Date(startOfDay),
        //                     $lte: new Date(endOfDay)
        //                 }
        //             }
        //         },
        //         {
        //             $group: {
        //                 _id: null,
        //                 total_prize: {
        //                     $sum: "$prize"
        //                 }
        //             }
        //         }
        //     ]).exec((err1, result) => {

        //         if (err1) {
        //             res.json({
        //                 success: false,
        //                 message: err1
        //             })
        //             return
        //         } else {
        //             let total_prize = 0;
        //             if (result.length != 0)
        //                 total_prize = result[0].total_prize;
        //             User
        //                 .findById(req.user.id)
        //                 .then(user => {
        //                     res.json({
        //                         success: true,
        //                         message: 'Sucess',
        //                         data: {
        //                             playmodes,
        //                             totalWinnings: total_prize,
        //                             username: req.user.username,
        //                             balance: user.balance,
        //                         }
        //                     })
        //                 })
        //         }
        //     })
        // })
        const playmodes = await PlayMode.find();
        const setting = await Setting.findOne();
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            message: 'Sucess',
            data: {
                playmodes,
                totalWinnings: setting.today_winnings,
                username: req.user.username,
                balance: user.balance,
            }
        });
    },

    precheck: (req, res) => {
        PlayMode.findById(req.body.playmode_id)
            .then(playmode => {
                User.findById(req.user.id)
                    .then(user => {
                        if (playmode.need <= user.balance) {
                            user.balance -= playmode.need;
                            user
                                .save()
                                .then(() => {
                                    let playlog = new PlayLog();
                                    playlog.user = req.user.id;
                                    playlog.playmode = playmode.need;
                                    playlog
                                        .save()
                                        .then(async () => {
                                            const setting = await Setting.findOne();
                                            res.json({
                                                success: true,
                                                message: 'You can play!',
                                                data: {
                                                    balance: user.balance,
                                                    playlog_id: playlog.id,
                                                    game_timer: setting.game_timer
                                                }
                                            })
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        } else res.json({
                            success: false,
                            message: 'You do not have enough money.'
                        })
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err))
    },

    endgame: async (req, res) => {
        const {
            playmode_id,
            playlog_id,
            clicks
        } = req.body;

        const playmode = await PlayMode.findById(playmode_id);
        const user = await User.findById(req.user.id);
        const playlog = await PlayLog.findById(playlog_id);
        let message = 'lose';
        if (playmode.cur_order + 1 === playmode.nth_player) {
            playmode.cur_order = 0;
            if (parseInt(clicks) >= parseInt(playmode.min_click)) {
                message = 'win';
                user.balance = parseInt(playmode.benefit) + parseInt(user.balance);
                playlog.prize = playmode.benefit;
                await user.save();
            }
        } else {
            playmode.cur_order++;
        }
        playlog.clicks = clicks;
        playlog.updated_at = Date.now();
        await playmode.save();
        await playlog.save();
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)
        let setting = await Setting.findOne();
        res.json({
            success: true,
            message,
            data: {
                balance: user.balance,
                benefit: playmode.benefit,
                totalWinnings: setting.today_winnings
            }
        })
    },

    wallet: async (req, res) => {
        let user = await User.findById(req.user.id);
        let notification_count = await Notification.count({ user: req.user.id, is_shown: false })
        res.json({
            success: true,
            message: 'success',
            data: {
                balance: user.balance,
                notification_count
            }
        });
    },

    leaderboard: (req, res) => {
        PlayLog.aggregate([
            // Join with User schema using user field in PlayLog schema
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            // Group by user ID and calculate maximum number of clicks and count of prizes greater than 0
            {
                $group: {
                    _id: '$user._id',
                    user: {
                        $first: '$user'
                    },
                    highscore: {
                        $max: '$clicks'
                    },
                    totalwon: {
                        $sum: {
                            $cond: [{
                                $gt: ['$prize', 0]
                            }, 1, 0]
                        }
                    }
                }
            }
        ], (err, result) => {
            if (err) {
                console.error(err)
            } else {
                res.json({
                    success: true,
                    message: 'sucess',
                    data: {
                        table: result
                    }
                });
            }
        })
    },

    profile: (req, res) => {
        User.findById(req.user.id, (err, user) => {
            res.json({
                success: true,
                message: 'sucees',
                data: user
            })
        })
    },

    landing: async (req, res) => {
        // const startOfDay = new Date()
        // startOfDay.setHours(0, 0, 0, 0)

        // const endOfDay = new Date()
        // endOfDay.setHours(23, 59, 59, 999)

        // PlayLog.aggregate([{
        //         $match: {
        //             updated_at: {
        //                 $gte: new Date(startOfDay),
        //                 $lte: new Date(endOfDay)
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             total_prize: {
        //                 $sum: "$prize"
        //             }
        //         }
        //     }
        // ]).exec((err1, result) => {

        //     if (err1) {
        //         res.json({
        //             success: false,
        //             message: err1
        //         })
        //         return
        //     } else {
        //         let total_prize = 0;
        //         if (result.length != 0)
        //             total_prize = result[0].total_prize;
        //             res.json({
        //                 success: true,
        //                 message: 'Sucess',
        //                 data: {
        //                     totalWinnings: total_prize,
        //                 }
        //             })
        //     }
        // })
        const setting = await Setting.findOne();
        res.json({
            success: true,
            message: 'Landing is loaded.',
            data: {
                totalWinnings: setting.today_winnings,
            }
        })
    },

    withdrawal: async (req, res) => {
        console.log(req.body);
        let user = await User.findById(req.user.id);
        if(user.balance >= req.body.withdrawal_amount )
            user.balance -= req.body.withdrawal_amount;
        else {
            res.json({success: false, message: 'You do not have enough balance', data: { balance: user.balance }});
            return;
        }

        WithDrawal.create(req.body, async (err, withdrawal) => {
            if(err) {
				console.log(err);
				return res.json({success: false, code: err.code})
			}
            await user.save();
			res.json({success: true, message: "withdrawal created.", data: { balance: user.balance }})
        })
    },

    resetpassword: async (req, res) => {
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            res.json({ success: false , message: 'Not registered user'});
            return;
        }

        const crypto = require('crypto');

        const generateRandomString = () => {
        return crypto.randomBytes(8).toString('hex');
        };

        const randomString = generateRandomString();

        user.password = randomString;
        await user.save();

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
        to: req.body.email,
        from: 'admin@potluckisland.com',
        subject: 'Reseted your password from TreasureMobile',
        text: `http://${process.env.DEPLOY_SERVER_URL}:3000/login.html`,
        html: `<p>New Password: <a href="http://${process.env.DEPLOY_SERVER_URL}:3000/login.html">Login password with this: "${randomString}"</a></p>` // html body
        };

        sgMail.send(msg)
        .then(() => res.json({ success: true, message: 'Please check your email box'}))
        .catch((error) => res.json({ success: false, message: error.message}));
    },

    getNotification: getNotification,

    updateNotification: async (req, res)=> {
        Notification.findById(req.params.id, (err, notification) => {
			Object.assign(notification, req.body)
			notification.save((err, updatedNotification) => {
                getNotification(req, res);
			})
		})
    },

    checkAllNotification: async (req, res) => {
        await Notification.updateMany({ user: req.user.id }, {is_shown: true});
        getNotification(req, res);
    }

}