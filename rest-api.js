//Author Name: Sumeet Jain

var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/db");

app.listen(8081);

var bookid = 1;

var AuthSchema = new Schema({
	firstName: String,
	lastName: String,
	
});

var author = mongoose.model('author', AuthSchema, 'author');

var BookSchema = new Schema({
	title: String,
	authors: [{ type: Schema.Types.ObjectId, ref: 'author'}],
	publisher: String,
	year: Number,
	ISBN: String
});


var book = mongoose.model('book', BookSchema, 'book');

app.post('/library/create/author', function(req, res){
	var fname = req.body.a_firstname;
	var lname = req.body.a_lastname;
	
	var auth  = new author({
		firstName: fname,
		lastName: lname
	});
	
	auth.save(function(err) {
		if (err) throw err;
		
		console.log('Author saved successfully!');
	});
	
	
	res.setHeader('Author-Link', 'localhost:8081/library/find/author/' + auth._id);
	res.status(201).send();
	
});


app.post('/library/create/book', function(req, res){
	var bookname = req.body.title;
	var publ = req.body.publisher;
	var yr = req.body.year;
	var isbnno = req.body.isbn;
	var a_fname = req.body.a_firstname;
	var a_lname = req.body.a_lastname;
	//console.log(fname);
	//console.log(lname);
	
	
	if(a_fname.length == 0){
		res.send("Error: Atleast one Author is required");
		return;
	}
	
	
	
	
	if(a_fname.constructor === Array){
		
		var alldata = [];
		
		author.find({}, function(err, result){
			if (err)
			console.log(err);
			
			if(result=== null){
				console.log("No author");
			}
			else{
				alldata = result;
				
				
				var arr = [];
				for(i=0; i<a_fname.length; i++){
					var flag = false;
					for(j=0; j<alldata.length; j++){
						if(alldata[j].firstName == a_fname[i] && alldata[j].lastName == a_lname[i]){
							var pid = alldata[j]._id;
							arr.push(pid);
							flag = true;
							break;
						}
					}
					if(flag == false){
						var person = new author({
							firstName: a_fname[i],
							lastName: a_lname[i]
						});
						
						person.save(function(err){
							if (err) console.log(err);
							
						});
						
						arr.push(person._id);
						
					}
				}
				
				var bk  = new book({
					title: bookname,
					authors: arr,
					publisher: publ,
					year: yr,
					ISBN: isbnno
				});
				
				bk.save(function(err) {
					if (err) console.log(err);
					bookid = bk._id;
					console.log(bookid);
					res.setHeader('Book-Link', 'localhost:8081/library/find/book/' + bookid);
					res.status(201).send();
				});
				
				
				
			}
			/*
				
				
				console.log('Book saved successfully!');
				
				
			*/
			
		});
		
	}
	else{
		
		var alldata = [];
		
		author.find({}, function(err, result){
			if (err)
			console.log(err);
			
			if(result=== null){
				console.log("No author");
			}
			else{
				alldata = result;
				var flag = false;
				
				for(j=0; j<alldata.length; j++){
					if(alldata[j].firstName == a_fname && alldata[j].lastName == a_lname){
						var pid = alldata[j]._id;
						flag = true;
						break;
					}
				}
				if(flag == true){
					var bk  = new book({
						title: bookname,
						authors: pid,
						publisher: publ,
						year: yr,
						ISBN: isbnno
					});
					
					bk.save(function(err) {
						if (err) console.log(err);
						bookid = bk._id;
						console.log(bookid);
						res.setHeader('Book-Link', 'localhost:8081/library/find/book/' + bookid);
						res.status(201).send();
					});
					
					
				}
				else{
					var person = new author({
						firstName: a_fname,
						lastName: a_lname
					});
					
					person.save(function(err){
						if (err) console.log(err);
						
					});
					
					
					var bk  = new book({
						title: bookname,
						authors: person,
						publisher: publ,
						year: yr,
						ISBN: isbnno
					});
					
					bk.save(function(err) {
						if (err) console.log(err);
						bookid = bk._id;
						console.log(bookid);
						res.setHeader('Book-Link', 'localhost:8081/library/find/book/' + bookid);
						res.status(201).send();
					});
					
				}	
				
			}
			/*
				
				
				console.log('Book saved successfully!');
				
				
			*/
			
		});
	}
	
});

// 3.Update an Author’s first or last name 
app.patch('/library/update/author/name', function(req, res){
	var aid = req.body.id;
	var a_fname = req.body.a_firstname;
	var a_lname = req.body.a_lastname;
	
	
	if(a_fname !== undefined && a_lname !== undefined){
		author.findOneAndUpdate({_id: aid}, {$set: {firstName: a_fname, lastName: a_lname}}, function(err, resauth){
			if(err) console.log(err)
			console.log(resauth);
		});
	}
	else if(a_fname === undefined && a_lname === undefined){
	console.log("nothing works");
	}
	else if(a_fname === undefined){
		author.findOneAndUpdate({_id: aid}, {$set: {lastName: a_lname}}, function(err, resauth){
			if(err) console.log(err)
			console.log(resauth);
		});
	}
	else if(a_lname === undefined){
		author.findOneAndUpdate({_id: aid}, {$set: {firstName: a_fname}}, function(err, resauth){
			if(err) console.log(err)
			console.log(resauth);
		});
	}
	else{
	console.log("nothing works");
	}
	
	res.setHeader('Book-Link', 'localhost:8081/library/find/author' + aid);
	res.status(201).send();
});



//4. Update a Book's publisher, title or year
var book_id = "";
app.param('book_id', function(req, res, next, val){
	book_id = val;
	next();
});


app.param('book_publisher', function(req, res, next, val){
	book.update({_id: book_id}, {$set: {publisher: val}}, function(err, result){
		if (err) console.log(err);
		else res.status(200).send();
		
	});
	next();
});

app.param('book_title', function(req, res, next, val){
	book.update({_id: book_id}, {$set: {title: val}}, function(err, result){
		if (err) console.log(err);
		else res.status(200).send();
		
	});
	next();
});

app.param('book_year', function(req, res, next, val){
	book.update({_id: book_id}, {$set: {year: val}}, function(err, result){
		if (err) console.log(err);
		else res.status(200).send();
		
	});
	next();
});

app.patch('/library/update/book/publisher/:book_id/:book_publisher', function(req, res){
	
});

app.patch('/library/update/book/title/:book_id/:book_title', function(req, res){
	
});

app.patch('/library/update/book/year/:book_id/:book_year', function(req, res){
	
});


//5. Add an Author to a Book
app.put('/library/update/book/addauthor', function(req, res){
	var isbnno = req.body.isbn;
	var a_fname = req.body.a_firstname;
	var a_lname = req.body.a_lastname;
	
	var alldata = [];
	
	author.find({}, function(err, result){
		if (err)
		console.log(err);
		
		alldata = result;
		var flag = false;
		
		for(j=0; j<alldata.length; j++){
			if(alldata[j].firstName == a_fname && alldata[j].lastName == a_lname){
				var pid = alldata[j]._id;
			flag = true;
			break;	
			}
			
		}
		if(flag == true){
			book.findOneAndUpdate({ISBN: isbnno}, {$push:{authors: pid}}, function(err, resultbook){
				if(err) console.log(err);
				console.log(resultbook);
			});
			
		}
		else{
			var  person = new author({
				firstName: a_fname,
				lastName: a_lname
			});
			
			person.save(function(err){
				if (err) console.log(err);
				
			});
			
			
			book.findOneAndUpdate({ISBN: isbnno}, {$push:{authors: person}}, function(err, resultbook){
				if(err) console.log(err);
				console.log(resultbook);
			});
			
		}
		
		
	});
});


//6. Delete a Book
app.param('delete_isbn', function(req, res, next, val){
	book.find({ISBN: val}).remove(function(err, result){
		if(err) console.log(err);
	});
	console.log("Book removed: " + val);
	
	next();
});

app.delete('/library/delete/book/byisbn/:delete_isbn', function(req, res){
	res.status(404).send();
});

//7. Delete an Author (only if no Book with that Author)
app.param('delete_id', function(req, res, next, val){
	book.find({authors: val}, function(err, result){
		if (err) console.log(err);
		
		console.log(val);
		console.log(result);
		
		if(result[0] == null){
			author.find({_id: val}).remove(function(err, result){
				if(err) console.log(err);
				console.log("Author removed with ID: " + val);
				res.status(404).send();
			});
		}
		else{
			console.log("Delete Books related to Author first");
			res.send();
		}
	});
	
	next();
});

app.delete('/library/delete/author/byid/:delete_id', function(req, res){
	
});

//8. Retrive an Author by id
app.param('author_id', function(res, res, next, val){
	author.find({_id: val}, function(err, result){
		if (err) console.log(err);
		
		res.send(result);
	});
	
	next();
});

app.get('/library/find/author/byid/:author_id', function(res, res){
	
});

//Retrive all Authors
app.get('/library/find/author', function(res, res){
	author.find({}, function(err, result){
		if (err) console.log(err);
		
		res.send(result);
	});
});


//9. Retrive a Book by isbn
app.param('get_isbn', function(res, res, next, val){
	book.find({ISBN: val}, function(err, result){
		if (err) console.log(err);
		
		res.send(result);
	});
	
	next();
});

app.get('/library/find/book/byisbn/:get_isbn', function(res, res){
	
});

//Retrive all Books
app.get('/library/find/book', function(res, res){
	book.find({}, function(err, result){
		if (err) console.log(err);
		
		res.send(result);
	});
});

//10. Retrive a Book by Title substring
app.param('get_title', function(res, res, next, val){
	book.find({title: new RegExp(val, 'i')}, function(err, result){
		if (err) console.log(err);
		
		res.send(result);
	});
	
	next();
});

app.get('/library/find/book/bytitle/:get_title', function(res, res){
	
});

