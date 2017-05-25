var express = require('express');
var Sequelize = require('sequelize');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var setCookie = require('set-cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var index = require('./routes/index');
var admin = require('./routes/admin');
var admin_survey = require('./routes/admin_survey');
var survey_data = require('./routes/survey_data');
var cookieObj = {
	surveyIndexes: []
};

var app = express();

var connection = new Sequelize('surveySystem', 'root', 'house1');
var Survey = connection.define('surveys',{
		surveyID: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		surveyQuestion: Sequelize.TEXT,
		option1: Sequelize.TEXT,
		option2: Sequelize.TEXT,
		author: Sequelize.TEXT,
		option1Count: Sequelize.INTEGER,
		option2Count: Sequelize.INTEGER,
		numTimesTaken: Sequelize.INTEGER
	}, {
		timestamps: false,
		hooks:{
			beforeValidate: function(){
				console.log("BEFORE VALIDATE");
			},
			afterValidate: function(){
				console.log("AFTER VALIDATE");
			},
			beforeCreate: function(){
				console.log("BEFORE CREATE");
			},
			afterCreate: function(){
				console.log("AFTER CREATE");
			}
		}
	}
);

var Admin = connection.define('admins',{
		adminid: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		username: Sequelize.TEXT,
		password: Sequelize.TEXT
	}, {
		timestamps: false
	}
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);
app.use('/survey_data', survey_data);

connection.sync().then(function(req, res){	
	Survey.findAll().then(function(result){
		if(!result){
			console.log("ADD SURVVEY THROUGH ADMIN PAGE");
			res.send(500, 'Invalid Login');
		} else{
			console.log(result[0].dataValues);

		}
	})
}).catch(function(err){
	console.log(err);
});

app.get('/admin', function(req, res){
	res.render('admin');
});

app.get('/survey_data', function(req, res){
	res.render('survey_data');
});

app.post('/submitAnswer', function(req, res){
	Survey.findOne({
		where:{surveyID: req.body.target}
	}).then(function(result){
		var params = {
				numTimesTaken: result.numTimesTaken + 1
			};
		if(req.body.option1){
			params.option1Count = result.dataValues.option1Count + 1;
		} else if(req.body.option2){
			params.option2Count = result.dataValues.option2Count + 1;
		}

		Survey.update(params,{
			where: {surveyID: req.body.target}
		}).then(function(){
			Survey.findAll().then(function(result){
				var min = Math.ceil(0),
					max = Math.floor(result.length),
					rand = Math.floor(Math.random() * (max - min)) + min,
					count = 0;
				req.cookies = cookieObj;
				//this can definately be imporoved, not a very good strat
				while(req.cookies.surveyIndexes.indexOf(rand) > -1){
					rand = Math.floor(Math.random() * (max - min)) + min;
					count++;
					//added an extra param to break out after loops 50 times, just in case
					//I would like to test more & make a better solution, quick fix
					if(result.length === req.cookies.surveyIndexes.length || count === 50){
						res.send(500, 'You answered all the surveys! :)');
						break;
					}
				}
				cookieObj.surveyIndexes.push(rand);
				req.cookies = cookieObj;
				console.log(req.cookies.surveyIndexes);

			    res.render("index", {
			    	title: 'Survey', 
		  			test: 'TEST',
		  			surveyID: result[rand].dataValues.surveyID,
		  			randomQuestion: result[rand].dataValues.surveyQuestion,
		  			option1: result[rand].dataValues.option1,
		  			option2: result[rand].dataValues.option2
			    });
			});
		});

	})
});

app.post('/login', function(req, res){
	var sha256Hash = crypto.createHash('sha256');
	sha256Hash.update(req.body.password);
	var hexHash = sha256Hash.digest('hex');
	Admin.findOne({
		where:{
			username: req.body.username,
			password: hexHash
		}
	}).then(function(result){
		console.log(result);
		if(result === null){
			console.log("INVLIAD LOGIN");
			res.send(500, 'Invalid Login');
		} else{
			res.render('admin_survey');
		}
	});
});

app.post('/submitQA', function(req, res){
	var min = Math.ceil(2),
		max = Math.floor(1000),
		randID = Math.floor(Math.random() * (max - min)) + min;
	connection.sync().then(function(){
		var survey = Survey.build({
			surveyID: randID,
			surveyQuestion: req.body.question,
			option1: req.body.option1,
			option2: req.body.option2,
			author: "temp author",
			option1Count: 0,
			option2Count: 0,
			numTimesTaken: 0
		});
		survey.save().then(function(){
			res.render('admin_survey');
		});
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
