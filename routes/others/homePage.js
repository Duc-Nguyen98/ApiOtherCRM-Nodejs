const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require
const checkAuthentication = require('../../utils/checkAuthentication');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const servicesModel = require('../../model/schemaService');
const usersModel = require('../../model/groupUser/schemaUser');
const permissionModel = require('../../model/groupUser/schemaPermission');
const customersModel = require('../../model/customer/customer/schemaCustomer');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');

const thisMoment = moment();
const endOfWeek = (moment().clone().endOf('week').format("X")) * 1000;
const startOfWeek = (moment().clone().startOf('week').format("X")) * 1000;
const endOfMonth = (moment().clone().endOf('month').format("X")) * 1000;
const startOfMonth = (moment().clone().startOf('month').format("X")) * 1000;
const endOfYear = (moment().clone().endOf('year').format("X")) * 1000;
const startOfYear = (moment().clone().startOf('year').format("X")) * 1000;


const filterCheckServices = (param, param2) => {
  if (param == '' || param == null || param == undefined) {
    return { softDelete: 0, idUser: userObj.idUser, nameCustomer: param2 }
  }
  else {
    return { softDelete: 0, idUser: userObj.idUser, nameCustomer: param2, statusSend: param }
  }
}



const checkPasswordCurrent = async (req, res, next) => {
  try {
    let passwordOld = req.body?.passwordOld;
    let passwordNew = req.body?.passwordNew;
    await usersModel.findOne({ idUser: userObj.idUser }).select({ password: 1, _id: 0 }).then(data => {
      if (data.password == passwordOld) {
        if (passwordNew == passwordOld) {
          return res.status(500).json({
            success: true,
            error: '👋 Your current password must not be the same as your old password!'
          });
        } else {
          next();
        }
      } else {
        return res.status(500).json({
          success: true,
          error: '👋 You have entered the wrong current password!'
        });
      }
    });
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



//! API View HOME
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
      data: {
        userInformation: { name: entry.name, gratitudeCustomer: entry2, earned: entry3[0].price }
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

router.get('/customerData', checkAuthentication, async function (req, res, next) {
  try {
    let totalCustomers = await customerModel.countDocuments({ softDelete: 0 });
    let customersPerMonth = await customerModel.countDocuments({ "created.time": { $gte: startOfMonth, $lte: endOfMonth }, softDelete: 0 })
    let rGratitude = [];
    for (let i = 1; i <= 12; i++) {
      let month = i;       // January
      let year = moment().year();
      let startDate = (moment([year, month - 1]).format("X")) * 1000;
      let endDate = (moment(startDate).clone().endOf('month').format("X")) * 1000;
      if (startDate <= startOfMonth) {
        let entry4 = await customersModel.aggregate(
          [
            {
              $match: {
                "created.time": { $gte: startDate, $lte: endDate }, softDelete: 0
              }
            },
            {
              $count: "count"
            }

          ]
        ).then(data => {
          (data.length < 1) ? rGratitude.push(0) : rGratitude.push(data[0].count);
        })
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        customerData: {
          totalCustomers: totalCustomers, customersPerMonth: customersPerMonth, chartData: [
            {
              name: 'customerData',
              data: rGratitude,
            },
          ],
        },
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

router.get('/gratitudeCustomerData', checkAuthentication, async function (req, res, next) {
  try {
    let totalServices = await servicesModel.countDocuments({ softDelete: 0 });
    let servicesPerMonth = await servicesModel.countDocuments({ "details.time": { $gte: startOfMonth, $lte: endOfMonth }, softDelete: 0 });
    let rGratitude = [];
    for (let i = 1; i <= 12; i++) {
      let month = i;       // January
      let year = moment().year();
      let startDate = (moment([year, month - 1]).format("X")) * 1000;
      let endDate = (moment(startDate).clone().endOf('month').format("X")) * 1000;
      if (startDate <= startOfMonth) {
        let entry4 = await servicesModel.aggregate(
          [
            {
              $match: {
                "details.time": { $gte: startDate, $lte: endDate }, softDelete: 0
              }
            },
            {
              $count: "count"
            }

          ]
        ).then(data => {
          (data.length < 1) ? rGratitude.push(0) : rGratitude.push(data[0].count);
        })
      }
    }


    return res.status(200).json({
      success: true,
      data: {
        gratitudeCustomerData: {
          totalGratitude: totalServices, gratitudePerMonth: servicesPerMonth, chartData: [
            {
              name: 'gratitudeData',
              data: rGratitude,
            },
          ],
        },
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


router.get('/rankingRevenue', checkAuthentication, async function (req, res, next) {
  try {
    let by = req.query.by;
    let matchBy = {};
    if (by == 1) {  // month
      matchBy = { softDelete: 0, "details.time": { $gte: startOfMonth, $lte: endOfMonth } };
    } else if (by == 2) { // year
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
      if (element2.length > 0) {
        rGratitude.push({ idUser: rGratitude_old[i]._id, avatar: element2[0].avatar, name: element2[0].name, earned: rGratitude_old[i].earned });
      }
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
    if (by == 1) {  // month
      matchBy = { softDelete: 0, "details.time": { $gte: startOfMonth, $lte: endOfMonth } };
    } else if (by == 2) { // year
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
      if (element2.length > 0) {
        rGratitude.push({ idUser: rGratitude_old[i]._id, avatar: element2[0].avatar, name: element2[0].name, countGratitude: rGratitude_old[i].count });
      }
    }

    return res.status(200).json({
      success: true,
      data: { rankingGratitude: rGratitude }
    });
  } catch (err) {
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
    let q = req.query.q;
    let status = req.query.status;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    const servicesData = await servicesModel.find(filterCheckServices(status, regex)).sort({ idServices: -1 })
    const totalServices = await servicesModel.countDocuments(filterCheckServices(status, regex));
    return res.status(200).json({
      success: true,
      data: {
        services: servicesData,
        totalRecords: totalServices,
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

//! End API View HOME


//! API Account Settings -


router.get('/accountSettings/information', checkAuthentication, async function (req, res, next) {
  try {
    const entry = await usersModel.findOne({ idUser: userObj.idUser }).select({ _id: 0 });
    const entry2 = await permissionModel.findOne({ idUser: userObj.idUser }).select({ idUser: 0, name: 0, _id: 0 });
    return res.status(200).json({
      success: true,
      data: { entry, modules: entry2.modules, ability: entry2.ability }
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.post('/accountSettings/general', checkAuthentication, async function (req, res, next) {
  try {
    const entry = await usersModel.updateOne({ idUser: userObj.idUser }, {
      name: req.body?.name,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      telephone: req.body?.telephone,
      email: req.body?.email,
    });
    return res.status(200).json({
      success: true,
      message: "Update Account Successfully!",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.post('/accountSettings/changePassword', checkAuthentication, checkPasswordCurrent, async function (req, res, next) {
  try {
    const entry = await usersModel.updateOne({ idUser: userObj.idUser }, {
      password: req.body?.passwordNew,
    });

    return res.status(200).json({
      success: true,
      message: "Change Password Account Successfully!",
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
