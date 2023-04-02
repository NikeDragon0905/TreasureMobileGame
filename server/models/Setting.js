const
	mongoose = require('mongoose'),
	settingSchema = new mongoose.Schema({
		today_winnings: { type: Number, required: true, default: 200 }
	})

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting