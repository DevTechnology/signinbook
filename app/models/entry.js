// This is a model representation of a signin user.
// The mongoose is used to model the data from mongoDB.
// Also, the encryption is done with mongoose-encryption.
// To create encryption key and signing key, execute
//      openssl rand -base64 32; openssl rand -base64 64;
// export keys to the environment variable for the easy access from the node app.

var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

var entrySchema = new mongoose.Schema({
    fname: String,
    lname: String,
    company: String,
    poc: String,
    date: Date,
    timeIn: Date,
    timeOut: Date,
    purpose: String
});

var encKey = process.env.EncryptionKey;
var sigKey = process.env.SigningKey;

entrySchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, excludeFromEncryption: ['date', 'timeIn', 'timeOut'] });

module.exports = mongoose.model('Entry', entrySchema);