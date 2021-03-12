const mongoose = require("mongoose");

//user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default:Date.now
    },
    profilePic:
    {
    	type:String,
    	default:"default.jpeg"
    }
});

module.exports = mongoose.model('User', UserSchema);