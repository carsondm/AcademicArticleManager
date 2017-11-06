var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var articleSchema = new Schema({
	title: String,
	university: String,
	author: String,
	tag: [String],
	publishDate: Date,
	snippet: String,
});

module.exports = mongoose.model('Article', articleSchema);