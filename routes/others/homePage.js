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
    let rGratitude = [];
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
      data.forEach(async (element) => {
        const entry2 = await usersModel.find({ idUser: element._id }).select({ avatar: 1, name: 1, _id: 0 }).then(element2 => {
          rGratitude.push({ idUser: element._id, avatar: element2[0].avatar, name: element2[0].name, countGratitude: element.count })
        });
        console.log(rGratitude)
        // ranking = rGratitude;
        // next();

      });

    })
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


router.get('/', checkAuthentication, async function (req, res, next) {
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
      // rankingGratitude: rGratitude,
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
