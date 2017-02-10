var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: String,
  alive: {
  	type: Boolean,
  	default: true

  },
  image: {
  	type: String,
  	default: "None"
  }
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
