const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const validateRequest = require('./middlewares/validateRequest');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const winston = require('winston');
var bodyParser = require('body-parser')

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(validateRequest);
app.use(function(req, res, next) {
  // Put some preprocessing here.
  // winston.log(`${req}`);
  // console.log(req.headers);
  req.body.date = new Date();
  // req.body.RequestID = 11111;
  console.log(req.body);
  // res.on('finish', function() {
  //   console.log(res);
  // });
  // next();
  // var oldWrite = res.write,
  //     oldEnd = res.end;

  // var chunks = [];

  // res.write = function (chunk) {
  //   chunks.push(chunk);

  //   return oldWrite.apply(res, arguments);
  // };

  // res.end = function (chunk) {
  //   if (chunk)
  //     chunks.push(chunk);

  //   var body = Buffer.concat(chunks).toString('utf8');
  //   console.log(req.path, body);

  //   oldEnd.apply(res, arguments);
  // };
  // console.log(chunks);
  

  next();
});

// v1 api routes
app.use('/v1', routes);
// send back a 404 error for any unknown api request
app.use((err, req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
