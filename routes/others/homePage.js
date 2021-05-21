const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require
const checkAuthentication = require('../../utils/checkAuthentication');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const servicesModel = require('../../model/schemaService');
const usersModel = require('../../model/groupUser/schemaUser');

const thisMoment = moment();
const endOfMonth = (moment().clone().startOf('month').format("X")) * 1000;
const startOfMonth = (moment().clone().endOf('month').format("X")) * 1000;

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


router.get('/userWelcome', checkAuthentication, async function (req, res, next) {
  try {
    const userInformation = await usersModel.findOne({ idUser: userObj.idUser });
    return res.status(200).json({
      success: true,
      userInformation: userInformation,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.get('/customerData', checkAuthentication, async function (req, res, next) {
  try {
    let totalCustomers = await customerModel.countDocuments({ softDelete: 0 });
    let customersPerMonth = await customerModel.countDocuments({ "created.time": { $gte: startOfMonth, $lte: endOfMonth } })

    if (totalCustomers > 0 && totalCustomers < 10) {
      totalCustomers = `0${totalCustomers}`;
    } else {
      totalCustomers = totalCustomers;
    }

    if (customersPerMonth > 0 && customersPerMonth < 10) {
      customersPerMonth = `0${customersPerMonth}`;
    } else {
      customersPerMonth = customersPerMonth;
    }

    return res.status(200).json({
      success: true,
      customerData: { totalCustomers: totalCustomers, customersPerMonth: customersPerMonth },
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.get('/gratitudeCustomerData', checkAuthentication, async function (req, res, next) {
  try {
    const totalServices = await servicesModel.countDocuments({ softDelete: 0 });
    const servicesPerMonth = await servicesModel.countDocuments({ "details.time": { $gte: startOfMonth, $lte: endOfMonth } });
    if (totalServices > 0 && totalServices < 10) {
      totalServices = `0${totalServices}`;
    } else {
      totalServices = totalServices;
    }

    if (servicesPerMonth > 0 && servicesPerMonth < 10) {
      servicesPerMonth = `0${servicesPerMonth}`;
    } else {
      servicesPerMonth = servicesPerMonth;
    }
    return res.status(200).json({
      success: true,
      gratitudeCustomerData: { totalGratitude: totalServices, gratitudePerMonth: servicesPerMonth },
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.get('/rankingGratitude', checkAuthentication, async function (req, res, next) {
  try {
    let rGratitude = [];
    let rGratitude_old = [];
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

    return res.status(200).json({
      success: true,

      rankingGratitude: rGratitude,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.get('/tableServices', checkAuthentication, async function (req, res, next) {
  try {
    const servicesData = await servicesModel.find({ softDelete: 0 }).sort({ idUser: -1 })
    return res.status(200).json({
      success: true,
      tableServices: servicesData
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
