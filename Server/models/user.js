var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	university: String,
	dob: Date,
	firstName: String,
	lastName: String,
	admin: Boolean,
	bookmarks: [],
});

userSchema.methods.addBookmark = function(bookmark, callback) {
	this.update({ $addToSet: { bookmarks: bookmark } });
	return console.log('Added bookmark to ' + this.username + '\'s bookmarks.');
}

userSchema.methods.removeBookmark = function(bookmark, callback) {
	this.update({ $pull: {bookmarks: bookmark} });
	return console.log('Removed bookmark from ' + this.username + '\'s bookmarks.');
}

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
