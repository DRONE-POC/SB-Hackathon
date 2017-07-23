var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var path = require('path');
var bodyParser = require('body-parser');
var invoke = require('../utils/invokeFunction');
var query = require('../utils/queryFunction');
const fileUpload = require('express-fileupload');
var request = require('superagent');
//var form = require('connect-form');

router.use(fileUpload());
var options = {
    wallet_path: path.join(__dirname, '../utils'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
};

var channel = {};
var client = null;

/* GET users listing. */

router.get('/createcustomer', function(req,res, next){

    invoke.invokeFunction('createCustomerProfile', ["Jack", "trucksarecool@indiana.com", "beefjerkyftw"]).then(function(val){
        if(val) {
            res.send(val);
        } else {
            res.send('No like hillbillies')
        }
    });
});

router.post('/createpolicy', function(req,res, next){
    var deviceType = req.body.deviceType
    var img = req.body.image
    var premium = req.body.premium
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    invoke.invokeFunction('createPolicy', [deviceType, img, premium, startDate, endDate, 'trucksarecool@indiana.com', 'beefjerkyftw']).then(function(val){
        if(val) {
            res.send(val);
        } else {
            res.send('No like hillbillies')
        }
    });
});

router.post('/submitquote', function (req, res, next) {
    // var deviceType = req.body.deviceType
    // var img = req.body.image
    // var premium = req.body.premium
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    invoke.invokeFunction('submitForQuote', ['iPhone', 'IMAGE HERE', '0.3', startDate, endDate, 'trucksarecool@indiana.com', 'beefjerkyftw']).then(function (val) {
            if (val) {
		console.log(typeof(val))	
		val  = JSON.parse(val) 
                console.log(val.StartDate);
		res.render('confirmQuote', {json : val});

            } else {
                res.send('could not create quote');
            }
        });
});

router.get('/getcustomer', function(req,res,next){
    query.queryFunction('getCustomerProfile', ['trucksarecool@indiana.com', 'beefjerkyftw']).then(function(val){
        if(val) {
            res.send(val);
        } else {
            res.send('no account with that key');
        }
    });
});

router.get('/checkstatus?=custID', function(req,res,next){
    if(!params.custID){
        res.status(400);
        res.send('failed to receive quote package');
    }
});

router.post('/getaquote', function(req,res,next){
    if(!req.body && !req.body.quote){
        res.status(400);
        res.send('failed to receive quote package');
    }
});

router.post('/getpolicy', function(req, res, next){

});

router.post('/claim', function(req, res, next){
    if(!req.body && !req.body.claim){
        res.status(400);
        res.send('failed to receive quote package');
    } else {
        res.status(200);
        res.send();
    }
});

router.post('/upload', function(req, res3) {
    if (!req.files)
        return res3.status(400).send('No files were uploaded.');
    
    // {
    //     name: 'IMG_2009.JPG',
    //     data: '',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg',
    //     mv: ''
    // }
    console.dir(req.files.pictureFile);

    // request.post({url:'http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phonetype', form: {name:req.files.pictureFile.name, filename:'file', files: [req.files.pictureFile.data]}}, 
    //     function(err,httpResponse,body){ /* ... */ 
    //         console.log(body);
    //         console.log(err);

    //         request.post({url:'http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phone_broken', form: {name:req.files.pictureFile.name, filename:'file', files: [req.files.pictureFile.data]}}, 
    //             function(err,httpRespBroke,body2){  
    //                 console.log(body2);
    //                 console.log(err);
    //                 res2.status(200);
    //                 res2.send('Good');
    //             });              

    //     });

    request.post('http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phone_broken')
        .field('type','file')
        .field('name','file')
        .attach('file', req.files.pictureFile.data, req.files.pictureFile.name)
        .end((err, res) => {
            console.log(err);
            console.log(res.body + " this is res 2");
            console.dir(res.body);

            request.post('http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phonetype')
                .field('type','file')
                .field('name','file')
                .attach('file', req.files.pictureFile.data, req.files.pictureFile.name)
                .end((err, res2) => {
                    console.log(err);
                    console.log(res2.body + " this is res 2");
                    console.dir(res2.body); 

                    
                    var aiData = {
                        broken: res.body.predictions.broken,
                        unbroken: res.body.predictions.unbroken,
                        android: res2.body.predictions.android,
                        iphone: res2.body.predictions.iphone
                     } 

                    res3.render('confirm',{ aiData: aiData, file: req.files.pictureFile});
                });        
        });



  
//   console.log(req.files.pictureFile); // the uploaded file object 
//   request.post("http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phonetype")
//         .send(req.files[0])
//         .end((err, res) => {
//             console.log(err);
//             console.log(res.body + "this is res 1");

//             request.post("http://ec2-13-59-4-168.us-east-2.compute.amazonaws.com:9091/predict/phone_broken")
//                 .send(req.files[0])
//                 .end((err, res) => {
//                     console.log(err);
//                     console.log(res.body + " this is res 2");
//                     res2.status(200);
//                     res2.send('Good');
//                 });
//         });


});

module.exports = router;

