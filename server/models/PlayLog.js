const
	mongoose = require('mongoose'),
	playLogSchema = new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		playmode: { type: Number, required: true },							// need cost
		clicks: { type: Number, required: true, default: 0 },				// clicked count
		prize: { type: Number, required: true, default: 0 },					// winning prize	
		created_at: { type: Date, required: true, default: Date.now },
		updated_at: { type: Date, required: true, default: Date.now }
	})

const PlayLog = mongoose.model('PlayLog', playLogSchema)
module.exports = PlayLog