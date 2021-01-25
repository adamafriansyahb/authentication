require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: false
    }, 
    password: {
        type: String,
        required: false
    }
});

// using mongoose encryption
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

// using passport
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);