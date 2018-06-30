var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = Schema({
    Expected_Yield: String,
    fruits: String,
});

var imgSchema = Schema({
    img: Buffer,
    contentType: String,
});

var postSchema = Schema({
    owner: String,
    title: String,
    info: infoSchema,
    image : imgSchema,
    pickers: [String],
    additional_msg: String,
    location_p: String
});

module.exports = mongoose.model('Post', postSchema);
