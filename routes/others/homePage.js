const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require
const checkAuthentication = require('../../utils/checkAuthentication');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const servicesModel = require('../../model/schemaService');
const usersModel = require('../../model/groupUser/schemaUser');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');

const thisMoment = moment();
const endOfWeek = (moment().clone().endOf('week').format("X")) * 1000;
const startOfWeek = (moment().clone().startOf('week').format("X")) * 1000;
const endOfMonth = (moment().clone().endOf('month').format("X")) * 1000;
const startOfMonth = (moment().clone().startOf('month').format("X")) * 1000;
const endOfYear = (moment().clone().endOf('year').format("X")) * 1000;
const startOfYear = (moment().clone().startOf('year').format("X")) * 1000;

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
    const entry = await usersModel.findOne({ idUser: userObj.idUser }).select({ _id: 0, name: 1 });
    const entry2 = await usersModel.countDocuments({ idUser: userObj.idUser, softDelete: 0 });
    const entry3 = await servicesModel.aggregate([
      { $match: { softDelete: 0, idUser: userObj.idUser } },
      {
        $group: {
          _id: null,
          "price": {
            $sum: "$price"
          }
        }
      }
    ]);
    return res.status(200).json({
      success: true,
      data: { userInformation: { name: entry.name, gratitudeCustomer: entry2, earned: entry3[0].price } }
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
    let customersPerMonth = await customerModel.countDocuments({ "created.time": { $gte: startOfMonth, $lte: endOfMonth }, softDelete: 0 })


    return res.status(200).json({
      success: true,
      data: { customerData: { totalCustomers: totalCustomers, customersPerMonth: customersPerMonth } }
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
    let totalServices = await servicesModel.countDocuments({ softDelete: 0 });
    let servicesPerMonth = await servicesModel.countDocuments({ "details.time": { $gte: startOfMonth, $lte: endOfMonth }, softDelete: 0 });
    return res.status(200).json({
      success: true,
      data: { gratitudeCustomerData: { totalGratitude: totalServices, gratitudePerMonth: servicesPerMonth } }
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.get('/rankingRevenue', checkAuthentication, async function (req, res, next) {
  try {
    let by = req.query.by;
    let matchBy = {};
    if (by == 0) {  // month
      matchBy = { softDelete: 0, "details.time": { $gte: startOfMonth, $lte: endOfMonth } };
    } else if (by == 1) { // year
      matchBy = { softDelete: 0, "details.time": { $gte: startOfYear, $lte: endOfYear } };
    } else {
      matchBy = { softDelete: 0, "details.time": { $gte: startOfWeek, $lte: endOfWeek } };
    }

    let rGratitude = [];
    let rGratitude_old = [];
    const entry = await servicesModel.aggregate(
      [
        { $match: matchBy },
        {
          $group: {
            _id: "$idUser",
            earned: { $sum: "$price" }
          }
        },
        { $sort: { earned: -1 } },
        { $limit: 5 }
      ]
    ).then(data => {
      rGratitude_old = data;
    });
    for (let i = 0; i < rGratitude_old.length; i++) {
      let element2 = await usersModel.find({ idUser: rGratitude_old[i]._id }).select({ avatar: 1, name: 1, _id: 0 });
      rGratitude.push({ idUser: rGratitude_old[i]._id, avatar: element2[0].avatar, name: element2[0].name, earned: rGratitude_old[i].earned });
    }
    return res.status(200).json({
      success: true,
      data: { rankingRevenue: rGratitude }

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
    let by = req.query.by;
    let matchBy = {};
    if (by == 0) {  // month
      matchBy = { softDelete: 0, "details.time": { $gte: startOfMonth, $lte: endOfMonth } };
    } else if (by == 1) { // year
      matchBy = { softDelete: 0, "details.time": { $gte: startOfYear, $lte: endOfYear } };
    } else {
      matchBy = { softDelete: 0, "details.time": { $gte: startOfWeek, $lte: endOfWeek } };
    }

    let rGratitude = [];
    let rGratitude_old = [];
    const entry = await servicesModel.aggregate(
      [
        { $match: matchBy },
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
      data: { rankingGratitude: rGratitude }

    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.get('/statistics', checkAuthentication, async function (req, res, next) {
  try {

    const vouchersTrade = await groupVoucherItemsModel.countDocuments({ status: 3, classified: 0, softDelete: 0 });
    const vouchersGift = await groupVoucherItemsModel.countDocuments({ status: 3, classified: 1, softDelete: 0 });
    const totalVouchers = await groupVoucherItemsModel.countDocuments({ status: 3, softDelete: 0 });

    const revenue = await servicesModel.aggregate([
      {
        $group: {
          _id: '',
          price: { $sum: '$price' }
        }
      }
    ]);


    return res.status(200).json({
      success: true,
      data: {
        statistics: {
          vouchersTrade: vouchersTrade,
          vouchersGift: vouchersGift,
          totalVouchers: totalVouchers,
          revenue: revenue[0].price
        }
      }
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
      data: {
        tableServices: servicesData
      }
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
