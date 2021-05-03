var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var todoRouter = require('./routes/todo');
var emailRouter = require('./routes/email');
var customerRouter = require('./routes/customer/customer');
var userRouter = require('./routes/user');
var shopRouter = require('./routes/shop');
var homePageRouter = require('./routes/others/homePage');

//? Services cms 
var servicesRouter = require('./routes/service');
//? Management Voucher
var groupVoucherRouter = require('./routes/vouchers/groupVouchers');
// groupCustomer 
var groupCustomerRouter = require('./routes/customer/groupCustomer');

var app = express();

var cors = require('cors')

app.use(cors())


// !setup connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://admin:admin@cluster0.ilkgc.mongodb.net/crm_demo?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// !setup body-parser 

var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
// configure app.use()
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

const db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/todo', todoRouter);
app.use('/mail', emailRouter);
app.use('/customer', customerRouter);
app.use('/user', userRouter);
app.use('/shop', shopRouter);
app.use('/services', servicesRouter);
app.use('/voucher/group', groupVoucherRouter);
app.use('/customer/group', groupCustomerRouter);
app.use('/home', homePageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
