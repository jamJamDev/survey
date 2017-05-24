var express = require('express');
var Sequelize = require('sequelize');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();
//TODO look at this connection shit
var connection = new Sequelize('surveySystem', 'root', 'house1');
var Survey = connection.define('surveys',{
		idsurveys: {
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);

connection.sync().then(function(req, res){	
	Survey.findAll().then(function(result){
		if(result.length === 0){
			console.log("ADD SURVVEY THROUGH ADMIN PAGE");
		} else{

			//This doesn't seem to work, maybe add a "start survey" button?
			console.log(result[0].dataValues);

		}
	})
}).catch(function(err){
	console.log(err);
});

app.get('/admin', function(req, res){
	res.render('admin');
});

app.post('/submitAnswer', function(req, res){
	console.log(req.body);
	Survey.findOne({
		where:{idsurveys: req.body.target}
	}).then(function(result){
		console.log(result);
		/*if(req.body.option1){
			Survey.update({
				{where: {idsurveys: req.body.target}}
				{option1: req.body}
			})
		} else if(req.body.option2){
			Survey.update({
				{where: {idsurveys: req.body.target}}
			})
		}*/
	})
});

app.post('/submitQA', function(req, res){
	var min = Math.ceil(2),
		max = Math.floor(1000),
		randID = Math.floor(Math.random() * (max - min)) + min;
	connection.sync().then(function(){
		var survey = Survey.build({
			idsurveys: randID,
			surveyQuestion: req.body.question,
			option1: req.body.option1,
			option2: req.body.option2,
			author: "temp author"
		});
		survey.save();
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
