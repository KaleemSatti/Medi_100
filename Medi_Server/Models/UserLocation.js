const mongoose = require('mongoose');
const Schema = mongoose.Schema({
	userId:String,
	location:{
		type:{type:String},
		coordinates:[]
	},
	socketID:String
})
module.exports = mongoose.model('UserLocation',Schema);
