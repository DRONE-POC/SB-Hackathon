var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
var chain = require('./routes/chain');
var db = require('./utils/db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/users', users);
app.use('/chain', chain);

// var users = [
//     {id:'1', username:'test@test.com', emailaddr:'test@test.com', password: 'password'},
//     {id:'2', username:'test1@test.com', emailaddr:'test1@test.com', password: 'password1'},
//     {id:'3', username:'test2@test.com', emailaddr:'test2@test.com', password: 'password2'}
// ];

// function userKnown(emailAddr){
//     users.forEach(function(user){
//         if(user.emailaddr == emailAddr){
//             return user;
//         }
//     });
//     return null;
// }

// function findByID(id){
//   users.forEach(function(user){
//     if(user.id == id){
//       return user;
//     }
//   });
//   return null;
// }



app.use(require('express-session')({ secret: 'amanaplanacanalpanama', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = app;
