'use strict'
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var Usr = express.Router();
var User = require('../user');

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

var find_error = (err) => {
	if(err.errors) {
		for(var er in err.errors) {
			if(err.errors[er].message) return err.errors[er].message;
		}
		return 'Unknown server error';
	}
}

Usr.get('/', function(req, res){
	res.status(200).json("Hello there");
});

Usr.get('/login', function(req, res){
	res.status(200).json('loginmessage');
});

Usr.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
}));

Usr.get('/signup', function(req, res){
	res.status(200).json({result: 'GET/SIGNUP'});
});

Usr.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
}));

Usr.get('/profile', function(req, res){
	User.find({}, (err, names) =>{
		if(err) console.log(err);
		else console.log('Now Displaying the ID', names);
	})
	res.json("Hello there");
});

Usr.get('/profile', isLoggedIn, (req, res) =>{
	res.status(200).json({result: req.user})
});

Usr.get('/logout', (req, res) => {
	req.logout();
	req.redirect('/login');
});

module.exports = Usr;
