const
	mongoose = require('mongoose'),
	settingSchema = new mongoose.Schema({
		today_winnings: { type: Number, required: true, default: 1000 },
		game_timer: { type: Number, required: true, default: 15 }
	})

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting