const
	mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	withDrawalSchema = new mongoose.Schema({
		account_name: { type: String, required: true, unique: true }, //Acount Name
		bank: { type: String, required: true }, //Bank Email
		swift_bic_code: { type: String, required: true }, //swift bic code
		iban: { type: String, required: true }, //iban
		country: { type: String, required: true }, //country
		withdrawal_amount: { type: String, required: true }, //amount
		currency: { type: String, required: true }, //currency
		created_at: {type: Date, required: true, default: Date.now}
	})

const WithDrawal = mongoose.model('WithDrawal', withDrawalSchema)
module.exports = WithDrawal;