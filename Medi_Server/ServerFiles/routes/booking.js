const express = require('express');
const router = express.Router();
const Bookings = require('../Models/Booking');
const mongoose = require('mongoose');

router.post('/book',(req,res,next)=>{
	const booked = new Bookings({
		_id:mongoose.Types.ObjectId(),
		PickUp:req.body.PickUp,
		DropOff:req.body.DropOff,
		Fare:req.body.Fare,
		Status:req.body.Status,
		Type:req.body.Type,
		TimeStart:null,
		TimeEnd:null
	});
	booked.save().then(result=>{
		res.status(200).json({
			success:true,
			result:result
		});
	}).catch(err=>{
		res.status(500).json({
			success:false,
			result:result
		});
	});
});

module.exports = router;