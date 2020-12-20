const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bookings = require('../Models/Booking');
const Locations = require('../Models/Locations');

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

router.post('/nearByDrivers',(req,res,next)=>{
	Locations.aggregate([
		{
			$geoNear:{
				near:{type: 'Point', coordinates: [req.body.longitude, req.body.latitude]},
				key:"location",
				distanceField: 'dist.calculated',
				maxDistance:(10*1000),
				minDistance: 0,
				includesLocs:'dist.location',
			}
		},
		{$limit: 5}
	]).then(result=>{
		console.log(result);
		res.status(200).json({
			results:result,
			success:true
		})
	}).catch(err=>{
		res.status(500).json({
			err:err,
			success:false
		});
	});
});

module.exports = router;
