var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var path = require('path');
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
router.get('/', function(req, res, next) {
    invoke.invokeFunction('createCar', ['CAR13', 'FERARIF50', 'F50', 'RED']),then(function(val){
        if(val) {
            res.send(val);
        } else {
            res.send('cry');
        }
    });
});

router.post('/createaccount', function(req,res, next){
    if(!req.body && !req.body.account){
        res.status(400);
        res.send('failed to receive quote package');
    }
    res.send('account created');
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

module.exports = router;

