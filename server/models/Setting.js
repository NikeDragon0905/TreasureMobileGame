const
	mongoose = require('mongoose'),
	settingSchema = new mongoose.Schema({
		nth_player: { type: Number, required: true, default: 30 },
		min_click: { type: Number, required: true, default: 30 },
		cur_order: { type: Number, required: true, default: 0 },
		today_winnings: { type: Number, required: true, default: 1000 },
		game_timer: { type: Number, required: true, default: 15 }
	})

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting