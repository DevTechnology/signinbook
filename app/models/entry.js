var mongoose = require('mongoose');

module.exports = mongoose.model('Entry', {
	name : {type : String, default: ''},
	company : {type : String, default: ''},
	poc : {type : String, default: ''},
	date : {type : Date, default: ''},
	timeIn : {type : String, default: ''},
	timeOut : {type : String, default: ''},
	purpose : {type : String, default: ''}
});