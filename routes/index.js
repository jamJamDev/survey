var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
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
		timestamps: false
	}
);

router.get('/', function(req, res, next) {
	Survey.findAll().then(function(result){
		var min = Math.ceil(0),
			max = Math.floor(result.length),
			rand = Math.floor(Math.random() * (max - min)) + min;
		console.log("RESULT RANDOM QUeSTION: ");
		console.log(result[rand].dataValues.surveyQuestion);
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

router.post('/', function (req, res, next) {
    console.log(req.body.description);
});

module.exports = router;
