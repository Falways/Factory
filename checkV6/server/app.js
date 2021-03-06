var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index').route;
var usersRouter = require('./routes/users');
var badNessRouter = require('./routes/badness_url');
var eveRouter = require('./routes/evalution');
var app = express();
let generate = require('./db/generate').init();
// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade')*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/eve',eveRouter)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/badness_url',badNessRouter);

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
  res.json({error:err});
});

module.exports = app;
