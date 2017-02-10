// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

var db = require("./models");



////////////////////
//  DATA
///////////////////



var newBookUUID = 18;







////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find().populate('author').exec(function(err, books){
    // populate fills in the author id with all the author data
      if (err) { return console.log("index error: " + err); }
      res.json(books);
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  var id = req.params.id;
  db.Book.findOne({_id: id}, function(err, book){
    if(err){console.log(err)};
    console.log("FOUND BOOk", book);
    res.json(book);
  })
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate
  });
  console.log("POST NEW BOOK", newBook);
  
  db.Author.find({name: req.body.author}, function(err, author){
    console.log("FIND RETURN:", author);
    if(author.length !== 0){
      newBook.author = author[0];
      console.log("NEW BOOK RETURN AUTHOR", newBook)
      newBook.save(function(err, book){
        if(err){return console.log("ERROR!", err);}
        console.log("NEW BOOK", book.title);
        res.json(book);
      })
    }
    else{
      var newAuthor = new db.Author({
        name: req.body.author,
        alive: true,
      });
      newAuthor.save(function(err, author){
      console.log("MADE A NEW GUY!", author);
        newBook.author = author;
        newBook.save(function(err, book){
          res.json(book);
        })

      })
    }
  })
});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  console.log('BOOK UPDATE', req.params);
  var id = req.params.id;
  db.Book.findOne({_id: id}, function(err, book){
    if(err){console.log(err)};
    book.title = req.body.title;
    book.image = req.body.image;
    book.releaseDate = req.body.releaseDate;
    db.Author.find({name: req.body.author}, function(err, author){
      console.log("FIND RETURN IN PUT:", author);
      if(author.length !== 0){
        book.author = author[0];
        console.log("NEW BOOK RETURN AUTHOR IN PUT", book)
        book.save(function(err, book){
          if(err){return console.log("ERROR!", err);}
          console.log("NEW BOOK IN PUT", book.title);
          res.json(book);
        })
      }
      else{
        var newAuthor = new db.Author({
          name: req.body.author,
          alive: true,
        });
        newAuthor.save(function(err, author){
        console.log("MADE A NEW GUY IN PUT!", author);
          book.author = author;
          book.save(function(err, book){
            res.json(book);
          })

        })
      }
    })
  })
});

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var id = req.params.id;
  db.Book.findOneAndRemove({_id: id}, function(err, book){
    if(err){console.log(err)};
    console.log("REMOVED")
    res.json(book);
  })
});



app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
