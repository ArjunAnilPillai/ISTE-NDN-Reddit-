var mongoose = require ('mongoose');
var schema = mongoose.Schema ;

var postschema = new schema ({
text: String ;
imgURL : String ;
likecount : Number ;
time : { type : Date, default: Date.now } ;
}
);

var post = mongoose.model('post',postschema);
module.exports = post ;
