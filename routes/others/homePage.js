const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require


const changeStream = todoModel.watch(); // có thể là Mongo.watch() hoặc db.watch()
changeStream.on('change', changeEvent => {
  // process next document
  console.log(changeEvent)
});

console.l

router.get('/', async function (req, res, next) {
  try {

    //? Birthday notifications
    // const currentDayAndMonth = moment(new Date()).format("MM-DD");
    // const customers = await customerModel.find({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
    // const countCustomer = await customerModel.countDocuments({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
    // return res.status(200).json({
    //   success: true,
    //   customers: customers,
    //   countCustomerBirthDay: countCustomer
    // });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

module.exports = router;
