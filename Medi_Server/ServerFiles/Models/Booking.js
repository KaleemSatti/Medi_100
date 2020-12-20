const mongoose = require('mongoose');
const Schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	PickUp: Object,
	DropOff:Object,
	Fare:Number,
	Status:String,
	Type:String,
	TimeStart:Date,
	TimeEnd:Date
});

module.exports = mongoose.model('Booking',Schema);