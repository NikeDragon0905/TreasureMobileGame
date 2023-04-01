const
	mongoose = require('mongoose'),
	notificationSchema = new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true},
        is_shown: { type: Boolean, required: true, default: false },
		created_at: { type: Date, required: true, default: Date.now }
	})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification