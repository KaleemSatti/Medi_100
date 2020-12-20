const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const {Client} = require('@googlemaps/google-maps-services-js');

router.post('/NearByHospital',async(req,res,next)=>{
        const object = {
            "formatted_address":'Near, National Hwy 5, Rawalpindi, Punjab, Pakistan',
            "geometry":{
                location: { lat: 33.3798973, lng: 73.2345486 },
                viewport: {
                  northeast: { lat: 33.38129487989272, lng: 73.23611352989272 },
                  southwest: { lat: 33.37859522010728, lng: 73.23341387010728 }
                }
            },
            "icon":'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png',
            "name":'LRBT Free Secondary Eye Hospital',
            "photos":[
                {
                  height: 3456,
                  html_attributions: [
                    '<a href="https://maps.google.com/maps/contrib/116342208375123088217">Kamran Ali Raja</a>'
                  ],
                  photo_reference: 'ATtYBwKiQia2lEp7erM-U4m7sbIZOXNXuTSd4lLMoNV2yzl4BvTKbwNX7jvOlC2rLnCGQSta2XsYFLjOIiz5BGOXtJHyOkebvz6_rLftqhGy75CXT9cgWhQ6IAX6w3jdUfLW6p39CiqkfVdk0xwfklbvduemN3fVlMH2K1ajB5SzwtDqZfda',
                  width: 4608
                }
            ],
            "place_id":'ChIJh9Bx17X33zgRVmFF6dPyLbo',
        }
        res.status(200).json({
            result:[object]
        })

        // const client = new Client();
        // await client.findPlaceFromText({
        //     params:{
        //         key:process.env.GOOGLE_PLACES_API,
        //         input:'hospital',
        //         inputtype:'textquery',
        //         fields:['name','icon','place_id','formatted_address','geometry','photo'],
        //         locationbias:'point:'+req.body.latitude+","+req.body.longitude
        //     }
        // }).then(result=>{
        //     const {candidates} = result.data;
        //     let places = [];
        //     for(let c of candidates){
        //         let place = {
        //             "formatted_address":c.formatted_address,
        //             "geometry":c.geometry,
        //             "icon":c.icon,
        //             "name":c.name,
        //             "photos":c.photos,
        //             "place_id":c.place_id,
        //         }
        //         places.push(place);
        //     }
        //     // console.log(places);
        //     // console.log(places[0].geometry);
        //     // console.log(places[0].photos);
        //     res.status(200).json({
        //         result:places
        //     });
        // }).catch(err=>{
        //     console.log(err);
        //     res.status(500).json({
        //         err:err
        //     });
        // });    
    // console.log(result.data.results[0]);
});

module.exports = router;