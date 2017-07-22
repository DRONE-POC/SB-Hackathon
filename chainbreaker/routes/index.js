'use strict';
var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var path = require('path');

var options = {
    wallet_path: path.join(__dirname, '../utils'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'fabcar',
    network_url: 'grpc://localhost:7051',
};

var channel = {};
var client = null;

/* GET home page. */
router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// router.get('/login', function(req, res, next){
//     res.render('login', { error: 'Invalid email or password.' });
// });

// router.post('/login', function(req, res, next){
//     if(req.user){
//         res.redirect('/');
//     } else {
//         res.render('login', { error: 'Invalid email or password.' });
//     }
// });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    
    res.redirect('/login');
}

module.exports = router;