var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var connection = new Sequelize('surveySystem', 'root', 'house1');
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin');
});

router.post('/', function(req, res, next){
});

module.exports = router;
