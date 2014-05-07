// set up ========================
	var express  = require('express');
	var app      = express(); 								// create our app w/ express
	var mongoose = require('mongoose'); 					// mongoose for mongodb

	// configuration =================

	var toDo = "mongodb://mongoguy:d0m1c1l3@novus.modulusmongo.net:27017/aw8udEwo";
	var toStudy = "mongodb://mongoguy:d0m1c1l3@novus.modulusmongo.net:27017/Eqabo3qa";
	var studyQuestions = "mongodb://mongoguy:d0m1c1l3@novus.modulusmongo.net:27017/Qo2sunov";
	mongoose.connect(studyQuestions); 	// connect to mongoDB database on modulus.io

	app.configure(function() {
		app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
	});
	
	
	app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
	
		// listen (start app with node server.js) ======================================
	var port = process.env.PORT 
	app.listen(port);
	console.log("App listening on port: " + port);
	
	
	// define model =================
	var Model = mongoose.model('Model', {
		question : String,
		answers : []
	});

    console.log('schema defined');
	
	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/questions', function(req, res) {
	    
	    //console.log(req);

		// use mongoose to get all todos in the database
		Model.find(function(err, questions) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(questions); // return all todos in JSON format
		});
	});
	
	app.get('/api/questions/:question_id', function(req, res) {


        Model.find({
			_id : req.params.question_id
		}, function(err, question) {
		    if (err)
				res.send(err);
		    
		    res.json(question);
		});

		// use mongoose to get all todos in the database
		//StudyLink.find(function(err, studylinks) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		//	if (err)
		//		res.send(err)

		//	res.json(studylinks); // return all todos in JSON format
		//});
	});

	// create todo and send back all todos after creation
	app.post('/api/questions', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Model.create({
			question : req.body.question,
			answers: req.body.answers,
			done : false
		}, function(err, question) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Model.find(function(err, questions) {
				if (err)
					res.send(err)
				res.json(questions);
			});
		});

	});
	
		// delete a todo
	app.delete('/api/questions/all', function(req, res) {
		Model.remove(function(err, question) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Model.find(function(err, questions) {
				if (err)
					res.send(err)
				res.json(questions);
			});
		});
	});
	

	// delete a todo
	app.delete('/api/questions/:question_id', function(req, res) {
		Model.remove({
			_id : req.params.question_id
		}, function(err, question) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Model.find(function(err, questions) {
				if (err)
					res.send(err)
				res.json(questions);
			});
		});
	});
	

	
	
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
	


