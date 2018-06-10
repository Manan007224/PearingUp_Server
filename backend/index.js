'use strict'
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
//var flash = require('connect-flash');
var mongoose = require('mongoose');
//var db = require('./db.js');
var cookieParser = require('cookie-parser');
var User = require('./user');

app.use(session({
	secret: 'practice_login_session'
}));
const dbOptions = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

// Adding some basic routes here

app.get('/', function(req, res){
	res.status(200).json("Hello there");
});

app.get('/login', function(req, res){
	res.status(200).json('loginmessage');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
}));

app.get('/signup', function(req, res){
	res.status(200).json({result: 'GET/SIGNUP'});
});

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
}));

app.get('/profile', function(req, res){
	User.find({}, (err, names) =>{
		if(err) console.log(err);
		else console.log('Now Displaying the ID', names);
	})
	res.json("Hello there");
});

app.get('/profile', isLoggedIn, (req, res) =>{
	res.status(200).json({result: req.user})
});

app.get('/logout', (req, res) => {
	req.logout();
	req.redirect('/login');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

require('./config/passport')(passport);

const hostname = 'localhost';
const port = process.env.port || 8000;

const server = app.listen(port, hostname, () => {
	mongoose.connect("mongodb://127.0.0.1/login_schema", dbOptions, (err) => {
	    if (err) {
	      console.log(err);
	    }
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
