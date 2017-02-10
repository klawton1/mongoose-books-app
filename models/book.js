var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
	title: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Author"
	},
	image: String,
	releaseDate: String
})

var Book = mongoose.model("Book", bookSchema);

module.exports = Book;