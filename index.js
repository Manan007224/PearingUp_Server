'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var app = express();
global.app = module.exports = express();
app.use(multipart());
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var User = require('./user');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

const dbOptions = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

app.use('/', require('./routes/user_routes'));
require('./config/passport')(passport);

const hostname = 'localhost';
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://manan:007224Jags@ds153890.mlab.com:53890/manantest', (err) =>{
	if(err)
		console.log("Causing error", err);
	else
		console.log("Connected Successfully");
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), ()=>{
	console.log('server running at localhost 5000');
});
