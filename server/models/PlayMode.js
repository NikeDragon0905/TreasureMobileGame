const
	mongoose = require('mongoose'),
	playmodeSchema = new mongoose.Schema({
		need: { type: Number, required: true, default: 1 },
		benefit: { type: Number, required: true, default: 1 }
	})

const PlayMode = mongoose.model('PlayMode', playmodeSchema)
module.exports = PlayMode