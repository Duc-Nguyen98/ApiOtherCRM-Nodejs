const express = require('express');
const router = express.Router();
const customerModel = require('../../model/customer/customer/schemaCustomer');
var moment = require('moment'); // require





router.get('/', async function (req, res, next) {
  try {

    const currentDayAndMonth = moment(new Date()).format("MM-DD");
    const customers = await customerModel.find({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
    const countCustomer = await customerModel.countDocuments({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
    return res.status(200).json({
      success: true,
      customers: customers,
      countCustomerBirthDay: countCustomer
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

module.exports = router;
