const
	mongoose = require('mongoose'),
	playmodeSchema = new mongoose.Schema({
		need: { type: Number, required: true, default: 1 },
		benefit: { type: Number, required: true, default: 1 },
		nth_player: { type: Number, required: true, default: 30 },
		min_click: { type: Number, required: true, default: 30 },
		cur_order: { type: Number, required: true, default: 0 }
	})

const PlayMode = mongoose.model('PlayMode', playmodeSchema)
module.exports = PlayMode