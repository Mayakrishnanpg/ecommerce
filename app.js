var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs =require('hbs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var con= require('./config/config')
const session = require('express-session')

const razorpay = require('./payments/razorpay');
const fileUpload = require('express-fileupload');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");
app.all('/*',(req,res,next)=>{
  req.app.locals.layout="layout/userlayout"
  next();
});
app.use(session({secret:'keyboardcat',cookie:{maxAge: 6000000}}))

app.all('/users*',(req,res,next)=>{
  req.app.locals.layout="layout/adminlayout"
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
