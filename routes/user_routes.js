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
var Posts = require('../posts.js');
var {errWrap, reqLog, end, assert_catch} = require('../config/basic.js');
var assert = require('assert');
var _ = require('lodash');
var fs = require('fs');

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

Usr.post('/signup', async(req, res) => {
	try {
		let {username, email, password} = req.body;
		let usnm = await User.findOne({'username': username});
		let eml = await User.findOne({'email': email});
		assert_catch('notDeepStrictEqual', usnm, null, 'Username Already Exists', res, 409);
		assert_catch('notDeepStrictEqual', eml, null, 'Username Already Exists', res, 409);
		let nUser = new User();
		nUser.username = username; nUser.email = email;
		nUser.password = nUser.generateHash(password);
		await nUser.save({});
		res.redirect('/');
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).status({message: 'Signup Failed'});
	}
});

	// successRedirect: '/',
	// failureRedirect: '/signup',


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
		let snd = await User.findOne({'username': sender});
		let rcv = await User.findOne({'username': receiver});
		assert_catch('notStrictEqual', snd, null, 'sender username is not valid', res, 409);
		assert_catch('notStrictEqual', rcv, null, 'receiver username is not valid', res, 409);
		assert_catch('notStrictEqual', snd, rcv, 'Invalid Request', res, 409);
		let id_found = '...';
		let idx = _.find(rcv.requested, (ch) => {
			return ch == id_found;
		});
		assert_catch('notDeepStrictEqual', idx, undefined, 'Already Requested to the User', res, 409);
		await User.update({'username': req.params.receiver}, {$push: {'requested': req.params.sender}});
		end(res, 'Succesfully Completed');
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
		let snd = await User.findOne({'username': sender});
		let rcv = await User.findOne({'username': receiver});
		assert_catch('notStrictEqual', snd, rcv, 'Invalid Request', res, 409);
		let id_found = '...';
		let idx = _.find(snd.followers, (ch) => {
			return ch == id_found;
		});
		assert_catch('notDeepStrictEqual', idx, undefined, 'Already Requested to the User', res, 409);
		await User.update({'username': req.params.sender}, {$push: {'followers': req.params.receiver}});
		await User.update({'username': req.params.sender}, {$pull: {'following': req.params.receiver}});
		await User.update({'username': req.params.receiver}, {$push: {'following': req.params.sender}});
		end(res, 'Succesfully Completed');		
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({message: 'error in the route'});
	}
});

// POST - /:sender/createPost - Post a new Post with Multiple Images
// :sender is the Username
// Sample JSON Data Would be :
//  	{ 
//			pickers: [],
//   		_id: 5b33a662c52e3469504b3973,
//   		images:
//    			[ 
//					{	
//						_id: 5b33a662c52e3469504b3976,
//        				img: [Object],
//        				contentType: 'image/PNG'
//					},
//      			{ 					
//						_id: 5b33a662c52e3469504b3975,
//        				img: [Object],
//        				contentType: 'image/PNG' 
//					} 
//				],
//   		owner: 'manan_test',
//   		info:
//    		{ 
//				_id: 5b33a662c52e3469504b3974,
//      		Expected_Yield: '200',
//      		fruits: 'Apples' 
//			},
//   		additional_msg: 'None' 
//		}


Usr.post('/:sender/createPost', async(req, res) => {
	try {
		let owner = await User.findOne({'username': req.params.sender});
		var new_tree = new Posts();
		assert_catch('notStrictEqual', owner, null, 'Owner Not Found', res, 409);
		new_tree.owner = owner.username;
		new_tree.info = req.body.info;
		new_tree.additional_msg = req.body.additional_msg;
		var tImages = [];
		if(req.body.filePath.length > 0) {
			for(let i=0; i<req.body.filePath.length; i++) {
				let tImage = {img: await fs.readFileSync(req.body.filePath[i]), contentType: 'image/PNG'}
				tImages.push(tImage);
			}
		}
		new_tree.images = tImages;
		console.log(new_tree);
		await new_tree.save({});
		end(res, 'Succesfully Saved the Image');
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({message: 'Error in posting the Image'});
	}
});



Usr.get('/allUsers', (req, res)=>{
	User.find({}, (err, usrs) => {
		if(err) console.log(err);
		else res.status(200).json({'Users': usrs});
	});
});

Usr.get('/allPosts', (req, res) => {
	Posts.find({}, (err, pst) => {
		if(err) console.log(err);
		else res.status(200).json({'Posts': pst});
	});
});

Usr.delete('/allPosts', (req, res) =>{
	Posts.remove({}, (err, pst) =>{
		if(err) console.log(err);
		else res.status(200).json({'result': 'Succesfully Completed'});
	});
});

Usr.delete('/allUsers', (req, res) =>{
	User.remove({}, (err, pst) =>{
		if(err) console.log(err);
		else res.status(200).json({'result': 'Succesfully Completed'});
	});
});

module.exports = Usr;
