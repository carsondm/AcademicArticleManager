var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var listusers = require('./routes/listusers');
var search = require('./routes/search');
var upload = require('./routes/upload');
var remove = require('./routes/remove');
var account = require('./routes/account');
var article = require('./routes/article');

var app = express();

mongoose.connect('mongodb://localhost/test');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'AAM',
    resave: false,
    saveUninitialized: true,
    maxAge: 60 * 60 * 24 * 1, // Sets max session life to 1 day
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
    }),
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Passport config
var User = require('./models/user');
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', index);
app.use('/index', index);
app.use('/search', search);
app.use('/users', users);
app.use('/listusers', listusers);
app.use('/upload', upload);
app.use('/remove', remove);
app.use('/account', account);
app.use('/article', article);

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

module.exports = app;
