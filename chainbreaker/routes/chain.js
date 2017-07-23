var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var path = require('path');
var bodyParser = require('body-parser');
var invoke = require('../utils/invokeFunction');
var query = require('../utils/queryFunction');

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

    invoke.invokeFunction('createCustomerProfile', [name, email, password]).then(function(val){
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
    invoke.invokeFunction('submitForQuote', ['deviceType', 'img', 'premium', startDate, endDate, 'trucksarecool@indiana.com', 'beefjerkyftw']).then(function (val) {
            if (val) {
                console.log(val);
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

module.exports = router;

