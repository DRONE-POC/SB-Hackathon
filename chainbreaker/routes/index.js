// var express = require('express');
// var router = express.Router();
// var passport = require('passport');

// /* GET home page. */
// router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

// router.get('/login', function(req, res, next){
//     res.render('login', { error: 'Invalid email or password.' });
// });

// router.post('/login', function(req, res, next){
//     console.log(req.body);
//     passport.authenticate('local', { failureRedirect: '/login' }),
//     function(req, res) {
//         res.redirect('/');
//     }
// });




// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
    
//     res.redirect('/login');
// }

// module.exports = router;