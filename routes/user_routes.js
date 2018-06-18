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
	res.status(200).json({result: "Hello there at basic route"});
});

Usr.get('/login', function(req, res){
	res.status(200).json({result: "GET/LOGIN"});
});

Usr.post('/login', (req, res)=>{
	let user_email = req.body.email;
	let user_pw = req.body.password;
	User.findOne({'email': user_email}, (err, usr) =>{
		if(err)
				res.status(400).json({errCode: 302, err: "Server side error while login"});
		if(!usr)
				res.status(409).json({errCode: 400, err: "User not found"});
		if(!usr.validPassword(user_pw))
				res.status(409).json({errCode: 409, err: "Entered Password in incorrect"});
		else {
			let redirect_url = '/profile/' + user_email
			res.redirect(redirect_url);
		}
	});
});

Usr.get('/signup', function(req, res){
	res.status(200).json({result: 'GET/SIGNUP'});
});

Usr.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/signup',
}));

Usr.get('/profile/:id', (req, res) =>{
	let _id = req.params.id;
	console.log("The user to signin is: ", _id);
	res.status(200).json({result: _id});
});

Usr.get('/logout', (req, res) => {
	req.logout();
	req.redirect('/login');
});

module.exports = Usr;
