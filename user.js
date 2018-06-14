var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var schema = mongoose.Schema;

var userSchema = schema({
	username: String,
	email: String,
	password: String,
	location: String,
	radius: String,
	followers: [String],
	following: [String],
	picked: [String],
	posted: [String]
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
