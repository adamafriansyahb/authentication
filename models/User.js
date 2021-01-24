const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
});

const secret = "vCh1H4Ro0y";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

module.exports = mongoose.model('User', userSchema);