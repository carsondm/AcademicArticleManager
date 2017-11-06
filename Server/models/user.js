var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
	email: String,
	university: String,
	dob: Date,
});

module.exports = mongoose.model('User', userSchema);