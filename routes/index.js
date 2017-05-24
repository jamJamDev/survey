var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
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
	}, {
		timestamps: false
	}
);

router.get('/', function(req, res, next) {
	Survey.findAll().then(function(result){
		var min = Math.ceil(0),
			max = Math.floor(result.length),
			rand = Math.floor(Math.random() * (max - min)) + min;
	    res.render("index", {
	    	title: 'Survey', 
  			test: 'TEST',
  			surveyID: result[rand].dataValues.idsurveys,
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
