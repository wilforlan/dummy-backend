var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schemaLoader = require('./config/schemaLoader.config');
var cors = require('cors');

// Used to Avoid Mongoose MissingSchemaError
schemaLoader.loadSchemas()

var api = require('./routes/api.index');

require('dotenv').config();
var app = express();

var db_uri;

if (process.env.ENVIRONMENT === 'production') {
    db_uri = process.env.MONGO_DEPLOY_URL;
} else {
    db_uri = process.env.MONGO_DEV_URL;
}
mongoose.connect(db_uri);

mongoose.connection.on('connected', function(err) {
    console.log("Connected to DB");
});

var app = express();

var corOption = {
    origin: process.env.FRONTEND_URL,
    methods: "OPTIONS, GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204
};

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

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
