const mongoose = require('mongoose');
const Schema = mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	driverId:String,
	coordinate:Object,
	socketID:String
})

module.exports = mongoose.model('Locations',Schema);