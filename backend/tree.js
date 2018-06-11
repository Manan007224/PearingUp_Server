var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var treeSchema = Schema({
	username: String,
	Id: String,
	Location: String,
	Expected_Yield: String,
	fruit: String
	pickers: [String]
});
