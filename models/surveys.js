var surveys;
var Sequelize = require('sequelize');
var connection = new Sequelize('surveySystem', 'root', 'house1');

surveys = function(){
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
	})
	connection.sync().then(function(req, res){	
		Survey.findAll().then(function(result){
			if(result.length === 0){
				console.log("ADD SURVVEY THROUGH ADMIN PAGE");
				return [];
			} else{
			var results = [];
				for(var i = 0; i < result.length; i++){
					result.push(result[i]);
				}
				return result;
			}
		});
	});
}

module.exports = surveys();