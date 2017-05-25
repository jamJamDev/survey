# survey
This is a survey using express, node (v0.10.46), &amp; mysql (sequalize). I utilized the [Express Application Generator](https://expressjs.com/en/starter/generator.html)

## Installation
(this assumes you have node, mysql and express instaleld)
1. Clone directory `git clone https://github.com/jamielthompson29/survey.git`
2. Navigate to the directory that was just cloned & run `npm install` to install the node modeuls specified in the "package.json" file.
3. Make sure MySql is running. You may need to make a database - see the Database section below for details.
4. Run `npm start` & visit your localhost.

## Database Schema
Create a "surveySchema" in mysql with the following tables:
### admins 
+ adminid _INT_
+ username _TEXT_
+ password _TEXT_
### surveys
+ surveyID _INT_
+ surveyQuestion _TEXT_
+ option1 _TEXT_
+ option2 _TEXT_
+ author _TEXT_
+ option1Count _INT_
+ option2Count _INT_
+ numTimesTaken _INT_

## TODO:
+ Add naviation button, so admin can easily navigate back to take surveys
+ Various CSS improvements (display data for admin better - build a grid or maybe even look into d3, make it not bland, etc)
+ When a survey is created, add the admin to the 'author' attribute of the survey data (can be used to show only their survey data)
+ improve the cookie situation
