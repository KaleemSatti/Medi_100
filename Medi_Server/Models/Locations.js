const mongoose = require('mongoose');
const Schema = mongoose.Schema({
	driverId:String,
	location:{
		type:{type:String},
		coordinates:[]
	},
	socketID:String
})
module.exports = mongoose.model('Locations',Schema);
