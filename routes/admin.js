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

/* GET home page. */
router.get('/', function(req, res, next) {
  Survey.findAll().then(function(results){
	    res.render("admin", {
	    	surveys: results
	    });
	});
});

router.post('/', function(req, res, next){
});

module.exports = router;
