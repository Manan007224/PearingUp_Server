import { Schema as _Schema } from "mongoose";
var Schema = _Schema();

var treeSchema = Schema({
	username: String,
	Id: String,
	Location: String,
	Expected_Yield: String,
	fruit: String,
	pickers: [String]
});
