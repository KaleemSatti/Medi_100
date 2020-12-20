const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const Locations = require('../Models/Locations');
const UserLocation = require('../Models/UserLocation');
const mongoose = require('mongoose');

const justReturnTrue = false;
router.put('/updateLocationUser',(req,res,next)=>{
	if(justReturnTrue){
		res.status(200).json({
			success:true
		});
	}
	else{
		console.log('FOUND /updateLocationUser')
		const {user_key} = req.body;
		const {latitude, longitude} = req.body;
		const socketID = "";
	
		let body = {
			userId:user_key,
			location:{
				type:'Point',
				coordinates:[longitude, latitude]
			},
			socketID:socketID
		}
	
		try{
			UserLocation.updateOne(
				{'userId':body.userId},
				{
					$set:body
				},
				{upsert: true},
				function(err,doc){
					if(err){
						console.log(err);
						res.status(500).json({
							err:err,
							success:false
						});
					}
					console.log('User '+user_key+' updated with socket id '+socketID);
					res.status(200).json({
						result:doc,
						success:true
					});
				}
			);
		}
		catch(e){
			console.log(e);
		}	
	}
})
router.put('/updateLocation',(req,res,next)=>{
	if(justReturnTrue){
		res.status(200).json({
			success:true
		});
	}
	else{
		const {driver_key, socketID} = req.body;
		const {latitude, longitude} = req.body;
	
		let body = {
			driverId:driver_key,
			location:{
				type:'Point',
				coordinates:[longitude, latitude]
			},
			socketID:socketID
		}
	
		try{
			Locations.updateOne(
				{'driverId':body.driverId},
				{
					$set:body
				},
				{upsert: true},
				function(err,doc){
					if(err){
						console.log(err);
						res.status(500).json({
							err:err,
							success:false
						});
					}
					console.log('Driver '+driver_key+' updated with Socket Id: '+socketID);
					res.status(200).json({
						result:doc,
						success:true
					});
				}
			);
		}
		catch(e){
			console.log(e);
		}
	}
});

module.exports = router;
