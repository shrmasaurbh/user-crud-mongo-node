global.BASEPATH   = __dirname;
global.CONFIG     = require('./src/config/config');

const express     = require('express');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const winston 		= require('winston');

const router      = require('./src/routes');
const apiResp     = require(BASEPATH+'/src/helpers/apiResponse');
var mongoose      = require("mongoose");
 
/**
 * Express instance
 * @public
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(CONFIG.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  // console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  // process.exit();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("requested api : -", req.originalUrl, ",type : -", req.method);
    next();
})

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use('/api', router);

// catch 404 and forward to error handler
// throw 404 if URL not found
app.all("*", function(req, res,next) {
  console.log(req.originalUrl)
  const error = new Error("URL not found : "+req.originalUrl);
  error.status = 404;
  next(error);
	// return apiResponse.notFoundResponse(res, "Page not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("err from the app.js",err)
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  apiResp.apiErr( req, res, 400, err);

});

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('--------------------------------');
    console.error('Uncaught Error    => ', error);
});

module.exports = app;

