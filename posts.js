var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = Schema({
    Expected_Yield: String,
    fruits: [String],
});

var postSchema = Schema({
    postedBy: mongoose.Schema.Types.ObjectId,
    title: String,
    info: infoSchema,
    images: [mongoose.Schema.Types.ObjectId],
    pickers: [String]
});