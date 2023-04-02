const
	mongoose = require('mongoose'),
	depositSchema = new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		amount: { type: Number, required: true },							// amount
		created_at: { type: Date, required: true, default: Date.now }				// date
	})

const Deposit = mongoose.model('deposit', depositSchema)
module.exports = Deposit