const
	mongoose = require('mongoose'),
	playLogSchema = new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		play_mode: { type: Number, required: true },
		winnings: { type: Number, required: true, default: 0 },
		created_at: { type: Number, required: true, default: Date.now },
	})

const PlayLog = mongoose.model('PlayLog', playLogSchema)
module.exports = PlayLog