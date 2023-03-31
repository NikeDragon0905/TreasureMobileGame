const
	mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	userSchema = new mongoose.Schema({
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		birthday: { type: Date, required: true },
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		country: { type: String, required: true },								// US | UK | FR | GE | RU | CH ...
		currency: { type: String, required: true }, 							// paypal | crypto
	})

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password)
}

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = this.generateHash(this.password)
	}
	next()
})

const User = mongoose.model('User', userSchema)
module.exports = User