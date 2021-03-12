var mongoose = require ('mongoose');
var schema = mongoose.Schema ;

var postschema = new schema ({
text: String ,
imgName : String ,
like : [],
time : { type : Date, default: Date.now } ,
username: String,
}
);

var post = mongoose.model('post',postschema);
module.exports = post ;
