var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var path = require('path');
var bodyParser = require('body-parser');
var invoke = require('../utils/invokeFunction');
var query = require('../utils/queryFunction');
const fileUpload = require('express-fileupload');

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
    invoke.invokeFunction('submitForQuote', ['iPhone', 'IMAGH HERE', '0.3', startDate, endDate, 'trucksarecool@indiana.com', 'beefjerkyftw']).then(function (val) {
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

router.post('/upload', function(req, res) {
  //console.log(req);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  
  console.log(req.files.pictureFile); // the uploaded file object 
  return res.status(200).send('Good');
});

module.exports = router;

