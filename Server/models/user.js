var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	university: String,
	dob: Date,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
