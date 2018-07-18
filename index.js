'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var mongodb = require("mongodb");
const { ObjectId } = require('mongodb');
var ObjectID = mongodb.ObjectID;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var crypto = require('crypto');
var path = require('path');
var Post = require('./models/posts.js');
var User = require('./models/user.js');

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

const conn = mongoose.createConnection('mongodb://manan:007224Jags@ds153890.mlab.com:53890/manantest');

let gfs;

conn.once('open', () =>{
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('tree_photos');
});

mongoose.connect('mongodb://manan:007224Jags@ds153890.mlab.com:53890/manantest', (err) =>{
	if(err)
		console.log("Causing error", err);
	else
		console.log("Connected Successfully");
});

const storage = new GridFsStorage({
	url: 'mongodb://manan:007224Jags@ds153890.mlab.com:53890/manantest',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					console.log("Err here", err);
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'tree_photos'
				};
				resolve(fileInfo);
			});
		});
	}
});



const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
	let _id = req.file.id;
	res.json({ id: req.file.id });
});


app.post('/uploadPostDetails/:id', async (req, res) =>{
	try {
		let pst = new Post();
		pst.info = {fruits: req.body.info.fruits}; 
		pst.additional_msg = req.body.additional_msg; pst.title = req.body.title;
		pst.owner = req.body.owner;
		pst.img_id = req.params.id;
		await pst.save({}, (err, pts) =>{
			if(err) console.log(err);
			else console.log(pts);
		});
		res.status(200).json({result: 'Done'});
	}
	catch(err) {
		console.log(err);
		res.status(200).json({ result: err });
	}
});

app.get('/getpost/:postid', async (req, res) =>{
	try {
		let ptitle = await Post.findOne({ 'title': req.params.postid });
		console.log('pt', ptitle);
		let file_id = ptitle.img_id;
		console.log(file_id);
		await gfs.files.findOne({_id: ObjectId(file_id)}, (err, fl) =>{
			if(!fl) {
				console.log(err);
				res.status(409).json({err: err});
			}
			else {
				console.log(fl);
				const readstream = gfs.createReadStream(fl.filename);
				readstream.pipe(res);
				res.contentType('image/png');
			}
		});
	}
	catch(err) {
		console.log(err);
		res.status(409).json({result: 'server-side error'});
	}
});

app.delete('/post/:postid', async(req, res)=>{
	try{
		await Post.findOneAndRemove({'title': req.params.postid});
		res.status(200).json({result: 'Done'});
	}
	catch(error){
		console.log(error);
		res.status(409).json({ result: err });
	}
});


app.delete('/image/:id', async(req, res)=>{
	try{
		await gfs.remove({_id: req.params.id, root: 'tree_photos'}, (err, gridstore) =>{
			if(err)
				res.status(409).json({result: err});
			else 
				res.status(200).json({ result: 'Done' });
		})
	}
	catch(error){
		console.log(error);
		res.status(409).json({ result: err });
	}
});



app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), ()=>{
	console.log('server running at localhost 5000');
});
