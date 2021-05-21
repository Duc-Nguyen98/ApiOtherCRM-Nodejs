const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require
const checkAuthentication = require('../../utils/checkAuthentication');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const servicesModel = require('../../model/schemaService');
const usersModel = require('../../model/groupUser/schemaUser');



const rankingGratitude = async (req, res, next) => {
  try {
    var rGratitude = [];
    var rGratitude_old = [];
    const entry = await servicesModel.aggregate(
      [
        { $match: { softDelete: 0 } },
        {
          $group: {
            _id: "$idUser",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]
    ).then(data => {
      rGratitude_old = data;
    });
    for (let i = 0; i < rGratitude_old.length; i++) {
      let element2 = await usersModel.find({ idUser: rGratitude_old[i]._id }).select({ avatar: 1, name: 1, _id: 0 });
      rGratitude.push({ idUser: rGratitude_old[i]._id, avatar: element2[0].avatar, name: element2[0].name, countGratitude: rGratitude_old[i].count });
    }
    rGratitude_new = rGratitude
    next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}



// router.get('/', async function (req, res, next) {
//   try {
//     //? Birthday notifications
//     const currentDayAndMonth = moment(new Date()).format("MM-DD");
//     const customers = await customerModel.find({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
//     const countCustomer = await customerModel.countDocuments({ birthDay: { $regex: currentDayAndMonth, $options: "$i" }, softDelete: 0 });
//     return res.status(200).json({
//       success: true,
//       customers: customers,
//       countCustomerBirthDay: countCustomer
//     });
//   } catch (err) {
//     console.log(err)
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   };
// });


router.get('/', checkAuthentication, rankingGratitude, async function (req, res, next) {
  try {
    let thisMoment = moment();
    let endOfMonth = (moment().clone().startOf('month').format("X")) * 1000;
    let startOfMonth = (moment().clone().endOf('month').format("X")) * 1000;


    // console.log(userObj)
    const totalCustomers = await customerModel.countDocuments({ softDelete: 0 });
    const customersPerMonth = await customerModel.countDocuments({ "created.time": { $gte: startOfMonth, $lte: endOfMonth } })

    const totalServices = await servicesModel.countDocuments({ softDelete: 0 });
    const servicesPerMonth = await servicesModel.countDocuments({ "details.time": { $gte: startOfMonth, $lte: endOfMonth } })

    return res.status(200).json({
      success: true,
      customerData: { totalCustomers: totalCustomers, customersPerMonth: customersPerMonth },
      gratitudeCustomerData: { totalGratitude: totalServices, gratitudePerMonth: servicesPerMonth },
      rankingGratitude: rGratitude_new,
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
