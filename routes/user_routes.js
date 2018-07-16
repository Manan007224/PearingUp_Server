'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var app = express();
var multer = require('multer');
global.app = module.exports = express();
app.use(multipart());
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var Usr = express.Router();
var User = require('../models/user.js');
var Tree = require('../models/tree.js');
var Posts = require('../models/posts.js');
var {errWrap, reqLog, end, assert_catch} = require('../config/basic.js');
var assert = require('assert');
var _ = require('lodash');
var fs = require('fs');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var crypto = require('crypto');
var path = require('path');




Usr.get('/', function(req, res){
	res.status(200).json({code: 200, result: "Succesfully Completed"});
});

Usr.get('/login', function(req, res){
	res.status(200).json({code: 200, result: "Succesfully Completed"});
});

Usr.post('/login', (req, res)=>{
	let user_email = req.body.email;
	let user_pw = req.body.password;
	User.findOne({'email': user_email}, (err, usr) =>{
		if(err)
				res.status(400).json({code: 302, result: "Server side error while login or User not found"});
		else if(!usr)
				res.status(400).json({code: 400, result: "User is not found"})
		else if(!usr.validPassword(user_pw))
				{console.log("Password is: ",user_pw); res.status(409).json({code: 409, result: "Entered Password in incorrect"});}
		else {
			let redirect_url = '/profile/' + user_email
			res.status(200).json({code: 200, result: usr.username});
		}
	});
});

Usr.get('/signup', function(req, res){
	res.status(200).json({code: 200, result: 'Succesfully Completed'});
});

Usr.post('/signup', async(req, res) => {
	try {
		let {username, email, password} = req.body;
		let usnm = await User.findOne({'username': username});
		console.log('Username = ', usnm);
		let eml = await User.findOne({'email': email});
		console.log("email = ", eml);
		if(usnm != null) res.status(409).json({code: 409, result: 'Username already exists'});
		else if(eml != null) res.status(409).json({code: 409, result: 'Email already exists'});
		else {
			console.log('CHECKED ALL THE CONDITIONS');
			let nUser = new User();
			nUser.username = username; nUser.email = email;
			nUser.password = nUser.generateHash(password);
			await nUser.save({});
			console.log('SAVED SUCCESFULLY THE NEW USER');
			res.redirect('/');
		} 
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).status({code: 409, result: 'server-side error'});
	}
});

Usr.post('/:sender/signup_info', async(req, res) =>{
	try {
		let {full_name, location, city} = req.body;
		let usnm = await User.findOne({username: req.params.sender});
		usnm.full_name = full_name;
		usnm.location = location;
		usnm.city = city;
		console.log('Username found out is: ', usnm);
		if(usnm == null)
			res.status(409).json({code: 409, result: 'Username not found'});
		else {
			User.findOneAndUpdate({username: req.params.sender}, usnm, {new: true}, (err, usr) => {
				if(err)
					res.status(409).json({code: 409, result: 'server-side error'});
				res.status(409).json({ code: 200, result: 'Succesfully Completed'});
			});
		}
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).status({code: 409, result: 'server-side error'});
	}
});

Usr.get('/getProfile/:username', async(req, res) =>{
	try {
		let usr = await User.findOne({'username': req.params.username});
		res.status(200).json({code :200, result: usr});
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).status({ code: 409, result: 'server-side error' });
	}
});

Usr.get('/profile/:id', (req, res) =>{
	console.log("Req.query = ", req.query);
	let _id = req.params.id;
	console.log("The user to signin is: ", _id);
	res.status(200).json({code: 200, result: _id});
});


Usr.get('/logout', (req, res) => {
	req.logout();
	req.redirect('/login');
});

// GET - sentRequest/:sender/:receiver - send a follow request to the User who posted the tree
// :sender - Name of the picker
// :receiver - Name of the User who posted the tree
// 

Usr.post('/sentRequest/:sender/:receiver', async(req, res)=>{
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
		let request_user = {username: req.params.sender, add_msg: req.body.add_msg}
		assert_catch('notDeepStrictEqual', idx, undefined, 'Already Requested to the User', res, 409);
		await User.update({'username': req.params.receiver}, {$push: {'requested': request_user}});
		end(res, 'Succesfully Completed');
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});


var findRequestByKey = (array, key, value) => {
	for(let i=0;i<array.length;i++){
		if(array[i][key]===value)
			return array[i];	
	}
	return null;
}

Usr.get('/declineRequest/:sender/:receiver', async(req, res) =>{
	try {
		let {sender, receiver} = req.params;
		let snd = await User.findOne({ 'username': sender });
		let rcv = await User.findOne({ 'username': receiver });
		console.log(snd);
		var rqs_person = findRequestByKey(snd.requested, 'username', req.params.receiver);
		console.log(rqs_person);
		await User.update({'username': req.params.sender}, {$pull: {'requested': rqs_person}});
		res.status(200).json({code: 200, result: 'Succesfully Completed'});
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});

// GET - AcceptRequest/:sender/:receiver - Accept a pending Request
// :sender - Name of the Person who has to accept the requests
// :receiver - Name of the Person who had initially sent the request to the sender.

Usr.get('/:sender/getRequests', async(req, res) =>{
	try {
		let snd = await User.findOne({username: req.params.sender});
		res.status(200).json({ code: 200, result: snd.requested})
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});

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
		await User.update({'username': req.params.sender}, {$pull: {'requested': req.params.receiver}});
		await User.update({'username': req.params.receiver}, {$push: {'following': req.params.sender}});
		end(res, 'Succesfully Completed');		
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});

// POST-REQUEST ROUTE TO THE WORK
// I AM JUST TRYING SOME 

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
		new_tree.title = req.body.title;
		new_tree.additional_msg = req.body.additional_msg;
		let t_image = {img: await fs.readFileSync('tree2.png'), contentType: 'image/png'}
		new_tree.image = t_image;
		await new_tree.save({});
		end(res, 'Succesfully Completed');
	}
	catch(err){
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});

//	POST - /:sender/:post_title/addtosavedposts let's a user add a posts to their saved list
//  post_title is assumed unique

Usr.post('/:sender/:post_title/bookmarkpost', async(req, res) =>{
	try {
		let user = await User.findOne({username: req.params.sender});
		let ptitle = await Posts.findOne({title: req.params.post_title});
		console.log('Title is = ', ptitle.title);
		if(ptitle !== null) {
			console.log("The saved_posts array = ", user);
			await User.update({username: req.params.sender}, {$push: {saved_posts: ptitle.title}});

			res.status(200).json({code: 200, result: 'Succesfully Completed'});
		}
		else {
			res.status(409).json({ code: 409, result: 'server-side error' });
		}
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({ code: 409, result: 'server-side error' });
	}
});

// GET - /:sender/savedposts returns all the saved posts by a particular user
// returns an array of saved_posts

Usr.get('/:sender/savedposts', async (req, res) =>{
	try {
		let user = await User.findOne({username: req.params.sender});
		let posts_to_send = [];
		for(let idx=0; idx<user.saved_posts.length; idx++) {
			console.log("Post is = ", user.saved_posts[idx]);
			let ptitle = await Posts.findOne({ title: user.saved_posts[idx]});
			posts_to_send.push(ptitle);
		}
    // Just for debuggin purposessdfsdfsd
		let post_titles = []
		for(let id=0;id<posts_to_send.length; id++) {
			// console.log("Post title = ", post)
			post_titles.push(posts_to_send[id].title);
		}

		if (posts_to_send.length !== 0)
			res.status(200).json({result: post_titles});
		console.log("Posts Length", posts_to_send.length);
	}
	catch(err) {
		reqLog(err);
		console.log(err);
		res.status(409).json({code: 409, result: 'server-side error'});
	}
});

Usr.get('/getPostsData/:post_id', async(req, res) =>{
	try {
		let ptitle = await Posts.findOne({title: req.params.post_id});
		console.log(ptitle);
		console.log("Ptitle = ", ptitle);
		let to_send = {title: ptitle.title, fruits: ptitle.info.fruits, description: ptitle.additional_msg}
		res.status(200).json({code: 200, result: to_send});
	}
	catch(err) {
		console.log(err);
		res.status(409).json({ code: 409, result: 'server-side error' });
	}
});

Usr.get('/allUsers', (req, res)=>{
	User.find({}, (err, usrs) => {
		console.log(usrs);
		if(err) console.log(err);
		else res.status(200).json({code: 200, result: 'Succesfully Completed', Users: usrs});
	});
});

Usr.get('/allPosts', (req, res) => {
	Posts.find({}, (err, pst) => {
		if(err) console.log(err);
		else res.status(200).json({code: 200, result: 'Succesfully Completed', Posts: pst});
	});
});

Usr.get('/:sender/myPosts', (req, res)=>{
	Posts.find({owner: req.params.sender}, (err, mpst) => {
		if(err) res.status(409).json({code: 409, result: 'server-side error'});
		else {
			//console.log(mpst);
			end(res, 'Succesfully Completed');
		}
	});
});


Usr.delete('/allPosts', (req, res) =>{
	Posts.remove({}, (err, pst) =>{
		if(err) console.log(err);
		else res.status(200).json({code: 200, result: 'Succesfully Completed'});
	});
});

Usr.delete('/allUsers', (req, res) =>{
	User.remove({}, (err, pst) =>{
		//console.log(pst);
		if(err) console.log(err);
		else res.status(200).json({code: 200, result: 'Succesfully Completed'});
	});
});

module.exports = Usr;