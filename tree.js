var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgSchema = new Schema({
    img: {data: Buffer, contentType: String, title: String}
});

var treeSchema = Schema({
	owner: mongoose.Schema.Types.ObjectId,
	image: imgSchema
});

module.exports = mongoose.model('Tree', treeSchema);
