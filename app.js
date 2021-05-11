const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const mongoose = require('mongoose');
const cron = require('node-cron');


const indexRouter = require('./routes/index');
const todoRouter = require('./routes/todo');
const emailRouter = require('./routes/email');
const customerRouter = require('./routes/customer/customer');
const userRouter = require('./routes/user');
const shopRouter = require('./routes/shop');
const homePageRouter = require('./routes/others/homePage');

//? Services cms 
const servicesRouter = require('./routes/service');
//? Management Voucher
const groupVoucherRouter = require('./routes/vouchers/groupVouchers');
// groupCustomer 
const groupCustomerRouter = require('./routes/customer/groupCustomer');



const app = express();

const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:8080', //Chan tat ca cac domain khac ngoai domain nay
  credentials: true //Để bật cookie HTTP qua CORS
}))



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

//-u global jwt

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


// cron.schedule('*/1 * * * *', () => {
//   let currentDate = Math.floor(Date.now() / 1000);
//   const services = servicesModel.find({ dateAutomaticallySent: currentDate, softDelete: 0 }).then(data => {
//     console.log(data)
//     if (data) {

//     }

//   })
//   console.log(currentDate)
// });

module.exports = app;
