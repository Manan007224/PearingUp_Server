var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgSchema = new Schema({
    img: {data: Buffer, contentType: String, title: String}
});

var treeSchema = Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	image: imgSchema
});

module.exports = mongoose.model('Tree', treeSchema);
