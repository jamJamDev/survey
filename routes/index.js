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
		author: Sequelize.TEXT
	}, {
		timestamps: false
	}
);

router.get('/', function(req, res, next) {
	Survey.findAll().then(function(result){
		console.log("RENDER");
		console.log(result[0].dataValues);
	    res.render("index", {
	    	title: 'Survey', 
  			test: 'TEST',
  			surveyID: result[0].dataValues.idsurveys
  			randomQuestion: result[0].dataValues.surveyQuestion,
  			option1: result[0].dataValues.option1,
  			option2: result[0].dataValues.option2
	    });
	});
});

router.post('/', function (req, res, next) {
    console.log(req.body.description);
});

module.exports = router;
