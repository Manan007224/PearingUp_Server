var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var schema = mongoose.Schema;

var requested_people = schema({
	username: String,
	add_msg: String 
});

var userSchema = schema({
	username: String,
	full_name: String,
	email: String,
	password: String,
	location: String,
	city: String,
	radius: String,
	followers: [String],
	following: [String],
	requested: [requested_people],
	picked: [String],
	posted: [String],
	saved_posts: [String],
});

//hashes the passoword before it reaches to the database
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//using bcrypt check if the password is same the local saved passowrd
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
