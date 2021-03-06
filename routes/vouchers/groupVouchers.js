const express = require('express');
const router = express.Router();
var moment = require('moment'); // require
const cron = require('node-cron');

const groupVoucherModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucher');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');
const groupCustomerModel = require('../../model/customer/groupCustomer/schemaGroupCustomer');
const shopModel = require('../../model/schemaShop');
const checkAuthentication = require('../../utils/checkAuthentication');

//! Cron sec
cron.schedule('*/1 * * * *', () => {
  let currentDate = moment(new Date()).format("YYYY-MM-DD");
  try {
    const entry = groupVoucherItemsModel.updateMany({ "timeLine.expiration": { $lt: currentDate }, status: { $lt: 2 } }, { $set: { status: 2 } }).then(data => { })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


const hasFilterGroupVoucher = (param, param2, param3, param4) => {
  if (param !== null && param2 !== null) {
    return { classified: param, status: param2, title: param3, softDelete: param4 }
  } else if (param == null && param2 !== null) {
    return { status: param2, title: param3, softDelete: param4 }
  } else if (param !== null && param2 == null) {
    return { classified: param, title: param3, softDelete: param4 }
  } else {
    return { title: param3, softDelete: param4 }
  }
}

const voucherItems = (param, param2, param3, param4) => {
  return { voucherCode: param, softDelete: param2, idGroupVoucher: param3, status: param4 }
}
//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const idAutoGroup = async (req, res, next) => {
  await groupVoucherModel.findOne({}, { idGroupVoucher: 1, _id: 0 }).sort({ idGroupVoucher: -1 })
    .then(data => {
      (data == null || data == '' || data == undefined) ? AutoIdGroup = 10000 : AutoIdGroup = data.idGroupVoucher + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}
const idAutoVoucher = async (req, res, next) => {
  await groupVoucherItemsModel.findOne({}, { idVoucher: 1, _id: 0 }).sort({ idVoucher: -1 })
    .then(data => {
      (data == null || data == '' || data == undefined) ? AutoIdVoucher = 10000 : AutoIdVoucher = data.idVoucher + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}

const updateVoucherAdd = async (req, res, next) => {
  const _id = req.params.id;
  const entry = await groupVoucherModel
    .findOne({ idGroupVoucher: _id })
    .select({ "idGroupVoucher": 1 })
    .then(data => {
      idGroupVoucher = data;
      next();
    })

}





// /* GET List Group Voucher listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/list
// ? Example: http://localhost:1509/voucher/group/list

router.get('/list', checkAuthentication, async function (req, res, next) {
  try {
    let classified = req.query.classified;
    let status = req.query.status;
    let softDelete = 0;
    let q = req.query.q;
    (classified == undefined || classified == '') ? classified = null : classified = classified;
    (status == undefined || status == '') ? status = null : status = status;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }
    const groupVouchers = await groupVoucherModel
      .find(hasFilterGroupVoucher(classified, status, regex, softDelete))
      .select()
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const countGroupVoucher = await groupVoucherModel.countDocuments(hasFilterGroupVoucher(classified, status, regex, softDelete));

    Promise.all([groupVouchers, countGroupVoucher]).then(([groupVouchers, countGroupVoucher]) => {
      return res.status(200).json({
        success: true,
        groupVouchers: groupVouchers,
        countGroupVoucher: countGroupVoucher
      });
    })


  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/trash
// ? Example: http://localhost:1509/voucher/group/trash

router.get('/trash', checkAuthentication, async function (req, res, next) {
  try {
    let classified = req.query.classified;
    let status = req.query.status;
    let softDelete = 1;
    let q = req.query.q;
    (classified == undefined || classified == '') ? classified = null : classified = classified;
    (status == undefined || status == '') ? status = null : status = status;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }
    const groupVouchers = await groupVoucherModel
      .find(hasFilterGroupVoucher(classified, status, regex, softDelete))
      .select()
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const countGroupVoucher = await groupVoucherModel.countDocuments(hasFilterGroupVoucher(classified, status, regex, softDelete));

    Promise.all([groupVouchers, countGroupVoucher]).then(([groupVouchers, countGroupVoucher]) => {
      return res.status(200).json({
        success: true,
        groupVouchers: groupVouchers,
        countGroupVoucher: countGroupVoucher
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:

router.delete('/delete-soft/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
    return res.status(200).json({
      success: true,
      message: "Deleted Soft Successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/voucher/group//trash/restore/:id
// ? Example: http://localhost:1509/voucher/group/trash/restore/6084868594ca7c92289c2bad

router.patch('/trash/restore/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await groupVoucherModel.findOneAndUpdate({ _id: _id }, {
      softDelete: 0,
    });
    return res.status(200).json({
      success: true,
      message: "Successful Recovery"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



router.get('/list/customer', checkAuthentication, async function (req, res, next) {
  try {
    const listGroupCustomer = await groupCustomerModel.find({ status: 0, softDelete: 0 }).select({ "idGroupCustomer": 1, "avatarGroup": 1, "title": 1, "_id": 1 })
    return res.status(200).json({
      success: true,
      listGroupCustomer: listGroupCustomer,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.get('/list/shop', checkAuthentication, async function (req, res, next) {
  try {
    const listShop = await shopModel.find({ status: 0, softDelete: 0 }).select({ "idShop": 1, "avatar": 1, "name": 1, "_id": 1 })
    return res.status(200).json({
      success: true,
      listShop: listShop,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/create
// ? Example: http://localhost:1509/voucher/group/create
router.post('/create', idAutoGroup, checkAuthentication, async function (req, res, next) {
  try {
    const groupVoucher = await groupVoucherModel.create({
      idGroupVoucher: AutoIdGroup,
      title: req.body?.title,
      note: req.body?.note,
      status: req.body?.status,
      listShop: req.body?.listShop,
      softDelete: 0,
      created: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      },
      modified: {
        modifyBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    })
    return res.status(200).json({
      success: true,
      message: "Successfully Created"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

// * GET Details users listing. 
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    await groupVoucherModel
      .findOne({ _id: _id })
      .then(data => {
        return res.status(200).json({
          success: true,
          data: data
        });
      })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});




/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.put('/update/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await groupVoucherModel.findByIdAndUpdate({ _id: _id }, {
      note: req.body?.note,
      title: req.body?.title,
      note: req.body?.note,
      status: req.body?.status,
      listShop: req.body?.listShop,
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    });

    return res.status(200).json({
      success: true,
      message: "Update Successful"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


// //! VOUCHER ITEMS

// // /* GET List Group Voucher listing. */
// // TODO: METHOD - GET
// // -u http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher
// // ? Example: http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher

router.get('/list/voucher/item/:idGroupVoucher', checkAuthentication, async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let softDelete = 0;
    let status = req.query.status;

    let q = req.query.q;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;
    (status == undefined || status == '' || status == 3 || status == 4 || status == 5) ? status = { $lte: 2 } : status = status;


    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const groupVoucherItems = await groupVoucherItemsModel
      .find(voucherItems(regex, softDelete, idGroupVoucher, status))
      .select()
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);
    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(voucherItems(regex, softDelete, idGroupVoucher, status));

    const typeClassifiedGroup = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher }).select({ classified: 1 });

    Promise.all([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]).then(([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]) => {
      return res.status(200).json({
        success: true,
        groupVoucherItems: groupVoucherItems,
        typeClassifiedGroup: typeClassifiedGroup,
        countGroupVoucherItems: countGroupVoucherItems,
      });
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

// // /* GET List Group Voucher listing. */
// // TODO: METHOD - GET
// // -u http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher
// // ? Example: http://localhost:1509/voucher/group/history/voucher/item/:idGroupVoucher

router.get('/history/voucher/item/:idGroupVoucher', checkAuthentication, async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let status = req.query.status;
    let softDelete = 0;
    let q = req.query.q;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;
    (status == undefined || status == '' || status == 0 || status == 1 || status == 2) ? status = { $gte: 3 } : status = status;


    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const groupVoucherItems = await groupVoucherItemsModel
      .find(voucherItems(regex, softDelete, idGroupVoucher, status))
      .select({})
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(voucherItems(regex, softDelete, idGroupVoucher, status));


    const typeClassifiedGroup = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher }).select({ classified: 1 });




    Promise.all([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]).then(([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]) => {
      return res.status(200).json({
        success: true,
        groupVoucherItems: groupVoucherItems,
        typeClassifiedGroup: typeClassifiedGroup,
        countGroupVoucherItems: countGroupVoucherItems,
      });
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});
// /* GET List Group Voucher listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher
// ? Example: http://localhost:1509/voucher/group/history/voucher/item/:idGroupVoucher

router.get('/history/trash/voucher/item/:idGroupVoucher', checkAuthentication, async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let status = req.query.status;
    let softDelete = 1;
    let q = req.query.q;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;
    (status == undefined || status == '' || status == 0 || status == 1 || status == 2) ? status = { $gte: 3 } : status = status;


    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const groupVoucherItems = await groupVoucherItemsModel
      .find(voucherItems(regex, softDelete, idGroupVoucher, status))
      .select({})
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(voucherItems(regex, softDelete, idGroupVoucher, status));


    const typeClassifiedGroup = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher }).select({ classified: 1 });




    Promise.all([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]).then(([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]) => {
      return res.status(200).json({
        success: true,
        groupVoucherItems: groupVoucherItems,
        typeClassifiedGroup: typeClassifiedGroup,
        countGroupVoucherItems: countGroupVoucherItems,
      });
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/create
// ? Example: http://localhost:1509/voucher/group/create
router.post('/create/voucher', checkAuthentication, idAutoGroup, idAutoVoucher, async function (req, res, next) {
  try {
    let obj = req.body;
    console.log(AutoIdGroup);
    await obj.forEach(function (item, index) {
      item.idVoucher = AutoIdVoucher + index;
      item.idGroupVoucher = AutoIdGroup - 1;
    })

    const entry = await groupVoucherItemsModel.insertMany(obj)
    return res.status(200).json({
      success: true,
      message: "Successfully Created",
      data: entry
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };

});



/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.post('/update/many/voucher/add/:id', checkAuthentication, updateVoucherAdd, idAutoVoucher, async function (req, res, next) {
  try {
    let obj = req.body;
    let idGroupVoucher = req.params.id;
    await obj.forEach(function (item, index) {
      item.idVoucher = AutoIdVoucher + index;
      item.idGroupVoucher = idGroupVoucher;
    })

    const entry = await groupVoucherItemsModel.insertMany(obj)
    return res.status(200).json({
      success: true,
      message: "Successfully Created"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/voucher/group/delete/:id
// ? Example: http://localhost:1509/voucher/group/delete/:

router.delete('/delete/:idGroupVoucher', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.params.idGroupVoucher;
    const group = await groupVoucherModel.deleteMany({ idGroupVoucher: obj }, (err, result) => { });
    const voucherItems = await groupVoucherItemsModel.deleteMany({ idGroupVoucher: obj }, (err, result) => { });


    Promise.all([group, voucherItems]).then(([group, voucherItems]) => {
      return res.status(200).json({
        success: true,
        message: "Delete Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete/many/group', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.GroupIdArray;
    const group = await groupVoucherModel.deleteMany({ idGroupVoucher: { $in: obj } }, (err, result) => { });
    const voucherItems = await groupVoucherItemsModel.deleteMany({ idGroupVoucher: { $in: obj } }, (err, result) => { });

    Promise.all([group, voucherItems]).then(([group, voucherItems]) => {
      return res.status(200).json({
        success: true,
        message: "Delete Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete-soft/many/group', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.GroupIdArray;
    const entry = await groupVoucherModel.updateMany({ idGroupVoucher: { $in: obj } }, {
      softDelete: 1
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Delete Soft Groups Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.patch('/restore/many/group', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.GroupIdArray;
    const entry = await groupVoucherModel.updateMany({ idGroupVoucher: { $in: obj } }, {
      softDelete: 0
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Restore Groups Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete/many/voucher', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.VoucherIdArray;
    const entry = await groupVoucherItemsModel.deleteMany({ _id: { $in: obj } }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Deleted Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete-soft/many/voucher', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.VoucherIdArray;
    const entry = await groupVoucherItemsModel.updateMany({ _id: { $in: obj } }, {
      softDelete: 1
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Delete Soft Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/restore/many/voucher', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.VoucherIdArray;
    const entry = await groupVoucherItemsModel.updateMany({ _id: { $in: obj } }, {
      softDelete: 0
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Restore Successfully"
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.patch('/change/status/many/voucher', checkAuthentication, async function (req, res, next) {
  try {
    let obj = req.body.VoucherIdArray;
    let status = req.query.status;
    const entry = await groupVoucherItemsModel.updateMany({ _id: { $in: obj } }, {
      status: status, modified: {
        modifyBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Changed Status Successfully"
      });
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:
http://localhost:1509/voucher/group/voucher-items/delete-soft/6084a25a94ca7c92289c2bb0
router.delete('/voucher-items/delete-soft/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherItemsModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
    return res.status(200).json({
      success: true,
      message: "Deleted Soft Successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:
router.patch('/trash/voucher-items/restore/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherItemsModel.findOneAndUpdate({ _id: _id }, { softDelete: 0 });
    return res.status(200).json({
      success: true,
      message: "Restore Successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:
router.delete('/trash/voucher-items/delete/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherItemsModel.findOneAndDelete({ _id: _id });
    return res.status(200).json({
      success: true,
      message: "Restore Successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});






//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
