'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
var app = express();
//global.app = module.exports = express();
//app.use(multipart());
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
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var crypto = require('crypto');
var path = require('path');

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

app.post('/upload', upload.single('file', 'fruits'), (req, res) => {
	//console.log(req.file.data);
	let fruits = req.fruits;
	console.log(fruits);
	res.json({ file: req.file });
});




app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), ()=>{
	console.log('server running at localhost 5000');
});
