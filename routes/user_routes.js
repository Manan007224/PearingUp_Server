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
var Tree = require('../tree.js');
var {errWrap, reqLog, end} = require('../config/basic.js');
var assert = require('assert');
var _ = require('lodash');
var fs = require('fs');

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
				res.status(400).json({errCode: 302, err: "Server side error while login or User not found"});
		else if(!usr)
				res.status(400).json({errCode: 400, err: "User is not found"})
		else if(!usr.validPassword(user_pw))
				{console.log("Password is: ",user_pw); res.status(409).json({errCode: 409, err: "Entered Password in incorrect"});}
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
	console.log("Req.query = ", req.query);
	let _id = req.params.id;
	console.log("The user to signin is: ", _id);
	res.status(200).json({result: _id});
});


Usr.get('/logout', (req, res) => {
	req.logout();
	req.redirect('/login');
});

// GET - sentRequest/:sender/:receiver - send a follow request to the User who posted the tree
// :sender - Name of the picker
// :receiver - Name of the User who posted the tree


Usr.get('/sentRequest/:sender/:receiver', async(req, res)=>{
	try {
		let {sender, receiver} = req.params;
		console.log("Sender is: ", sender, "Receiver is: ", receiver);
		let snd = await User.findOne({'email': sender});
		let rcv = await User.findOne({'email': receiver});
		console.log("Snd: ", snd, "Rcv: ", rcv);
		assert.notStrictEqual(snd, null, 'sender email is not valid');
		assert.notStrictEqual(rcv, null, 'receiver email is not valid');
		assert.notStrictEqual(snd, rcv, 'invalid request');
		let id_found = '...';
		let idx = _.find(rcv.requested, (ch) => {
			return ch == id_found;
		});
		console.log("Index: ", idx);
		assert.notDeepStrictEqual(idx, 'undefined', 'Already Requested to the User');
		console.log('RCV EMAIL:', rcv.email);
		await User.update({'email': req.params.receiver}, {$push: {'requested': req.params.sender}});
		res.status(200).json({message: 'Sent Request'});
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({message: 'error in the route'});
	}
});

// GET - AcceptRequest/:sender/:receiver - Accept a pending Request
// :sender - Name of the Person who has to accept the requests
// :receiver - Name of the Person who had initially sent the request to the sender.

Usr.get('/AcceptRequest/:sender/:receiver', async(req, res)=>{
	try{
		let {sender, receiver} = req.params;
		console.log("Sender is: ", sender, "Receiver is: ", receiver);
		let snd = await User.findOne({'email': sender});
		let rcv = await User.findOne({'email': receiver});
		assert.notStrictEqual(snd, rcv, 'invalid request');
		let id_found = '...';
		let idx = _.find(snd.followers, (ch) => {
			return ch == id_found;
		});
		assert.notDeepStrictEqual(idx, 'undefined', 'Already Accepted Requested');
		await User.update({'email': req.params.sender}, {$push: {'followers': req.params.receiver}});
		await User.update({'email': req.params.sender}, {$pull: {'following': req.params.receiver}});
		await User.update({'email': req.params.receiver}, {$push: {'following': req.params.sender}});
		res.status(409).json({message: 'Accepted Request'});		
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({message: 'error in the route'});
	}
});

Usr.post('/:sender/saveTree', (req, res) => {
	try {
		let _id = await User.findOne({'email': req.params.sender})._id;
		var new_tree = new Tree;
		assert.notStrictEqual(_id, null, 'ID not found');		
		new_tree.owner = _id;
		await new_tree.save({});
	}
	catch(err) {
		reqLog(err);
		console.warn(err);
		res.status(409).json({message: 'error in saving the tree'});
	}
})

Usr.post('/:sender/postImage', (req, res) => {
	try {
		let {snd} = req.params;
		let filePath = req.body.filePath;
		let _id = await User.findOne({'email': snd})._id;
		assert.notStrictEqual(_id, null, 'ID not found');	
		let treeBelongs = await Tree.findOne({'owner': _id});
		assert.notStrictEqual(treeBelongs, null, 'No Tree found related to this user');
		let img = {data: fs.readFileSync(filePath), contentType: 'image/PNG'};
		
		assert.notStrictEqual(new_tree.owner, null, 'There is no owner defined for this particular tree');
		await Tree.update({owner: new_tree.owner})
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({message: 'Error in posting the Image'});
	}
})

Usr.get('/allUsers', (req, res)=>{
	User.find({}, (err, usrs) => {
		if(err) console.log(err);
		else res.status(200).json({'Users': usrs});
	});
});

module.exports = Usr;
