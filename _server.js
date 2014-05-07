// set up ========================
	var express  = require('express');
	var app      = express(); 								// create our app w/ express
	var mongoose = require('mongoose'); 					// mongoose for mongodb

	// configuration =================

	var toDo = "mongodb://mongoguy:d0m1c1l3@novus.modulusmongo.net:27017/aw8udEwo";
	var toStudy = "mongodb://mongoguy:d0m1c1l3@novus.modulusmongo.net:27017/Eqabo3qa";
	mongoose.connect(toStudy); 	// connect to mongoDB database on modulus.io

	app.configure(function() {
		app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
	});
	
		// listen (start app with node server.js) ======================================
	var port = process.env.PORT 
	app.listen(port);
	console.log("App listening on port: " + port);
	
	// define model =================
	var StudyLink = mongoose.model('StudyLink', {
		description : String,
		url : String
	});

	
	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/studylinks', function(req, res) {

		// use mongoose to get all todos in the database
		StudyLink.find(function(err, studylinks) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(studylinks); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/studylinks', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		StudyLink.create({
			description : req.body.text,
			url: req.body.url,
			done : false
		}, function(err, studylink) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			StudyLink.find(function(err, studylinks) {
				if (err)
					res.send(err)
				res.json(studylinks);
			});
		});

	});

	// delete a todo
	app.delete('/api/studylinks/:studylink_id', function(req, res) {
		StudyLink.remove({
			_id : req.params.studylink_id
		}, function(err, studylink) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			StudyLink.find(function(err, studylinks) {
				if (err)
					res.send(err)
				res.json(studylinks);
			});
		});
	});
	
	
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
	


