const express = require('express');
const router = express.Router();
const groupVoucherModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucher');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');
const groupCustomerModel = require('../../model/customer/groupCustomer/schemaGroupCustomer');
const shopModel = require('../../model/schemaShop');


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


idAutoGroup = async (req, res, next) => {
  await groupVoucherModel.findOne({}, { idGroupVoucher: 1, _id: 0 }).sort({ idGroupVoucher: -1 })
    .then(data => {
      AutoId = data.idGroupVoucher + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}
idAutoGroupVoucher = async (req, res, next) => {
  await groupVoucherItemsModel.findOne({}, { idVoucher: 1, _id: 0 }).sort({ idVoucher: -1 })
    .then(data => {
      AutoIdVoucher = data.idVoucher + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


updateVoucherAdd = async (req, res, next) => {
  const _id = req.params.id;

  const entry = await groupVoucherModel
    .findOne({ _id: _id })
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

router.get('/list', async function (req, res, next) {
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
      // .select({ "discount": 0, "timeLine": 0, "scopeApply": 0, "modified": 0, "note": 0 })
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

router.get('/trash', async function (req, res, next) {
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
      .select({ "discount": 0, "timeLine": 0, "scopeApply": 0, "modified": 0, "note": 0 })
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

// /* GET Details users listing. */
// // TODO: METHOD - GET
// // -u http://localhost:1509/services/sms/detail/:id
// // ? Example: http://localhost:1509/services/sms/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
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


router.get('/list/customer', async function (req, res, next) {
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

router.get('/list/shop', async function (req, res, next) {
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


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:

router.delete('/delete-soft/:id', async function (req, res, next) {
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

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/voucher/group/delete/:id
// ? Example: http://localhost:1509/voucher/group/delete/:

router.delete('/delete/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherModel.findOneAndDelete({ _id: _id });
    return res.status(200).json({
      success: true,
      message: "Deleted Successfully"
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

router.patch('/trash/restore/:id', async function (req, res, next) {
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

//! VOUCHER ITEMS

// // /* GET List Group Voucher listing. */
// // TODO: METHOD - GET
// // -u http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher
// // ? Example: http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher

router.get('/list/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let softDelete = 0;
    let statusVoucher = 0;
    let q = req.query.q;


    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;


    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const groupVoucherItems = await groupVoucherItemsModel
      .find(voucherItems(regex, softDelete, idGroupVoucher, statusVoucher))
      .select({ "created": 1, "status": 1, "voucherCode": 1, "idVoucher": 1, "_id": 1 })

      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);



    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(voucherItems(regex, softDelete, idGroupVoucher, statusVoucher));

    const typeClassifiedGroup = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher }).select({ classified: 1 });

    Promise.all([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]).then(([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]) => {
      console.log(typeClassifiedGroup)
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
router.get('/trash/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let softDelete = 1;
    let statusVoucher = 0;
    let q = req.query.q;


    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;


    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const groupVoucherItems = await groupVoucherItemsModel
      .find(voucherItems(regex, softDelete, idGroupVoucher, statusVoucher))
      .select({ "created": 1, "status": 1, "voucherCode": 1, "idVoucher": 1, "_id": 1 })

      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);



    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(voucherItems(regex, softDelete, idGroupVoucher, statusVoucher));

    const typeClassifiedGroup = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher }).select({ classified: 1 });

    Promise.all([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]).then(([groupVoucherItems, countGroupVoucherItems, typeClassifiedGroup]) => {
      console.log(typeClassifiedGroup)
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

router.get('/history/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;

    let status = req.query.status;
    if (status == 0) {
      status = 1;
    }

    let softDelete = 0;
    let q = req.query.q;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;
    (status == undefined || status == '') ? status = null : status = status;


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

router.get('/history/trash/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;

    let status = req.query.status;
    if (status == 0) {
      status = 1;
    }

    let softDelete = 1;
    let q = req.query.q;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    (idGroupVoucher == undefined || idGroupVoucher == '') ? idGroupVoucher = null : idGroupVoucher = idGroupVoucher;
    (status == undefined || status == '') ? status = null : status = status;


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


/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/create
// ? Example: http://localhost:1509/voucher/group/create
router.post('/create', idAutoGroup, async function (req, res, next) {
  try {
    const groupVoucher = await groupVoucherModel.create({
      idGroupVoucher: AutoId,
      title: req.body?.title,
      note: req.body?.note,
      classified: req.body?.classified,
      status: req.body?.status,
      discount: req.body?.discount,
      timeLine: req.body?.timeLine,
      scopeApply: req.body?.scopeApply,
      memberGroup: req.body?.memberGroup,
      softDelete: 0,
      created: {
        createBy: "admin",
        time: Date.now()
      },
      modified: {
        modifyBy: "admin",
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


// // TODO: METHOD - GET
// // -u http://localhost:1509/voucher/group/create
// // ? Example: http://localhost:1509/voucher/group/create
router.post('/create/voucher', idAutoGroup, idAutoGroupVoucher, async function (req, res, next) {
  try {

    // let obj = { "voucherCode": ["D9FXADKBAS8NO47109", "D9FXADKBAS8NO47108"] };
    let obj = req.body.voucherCode;
    let arrayDataVoucher = [];
    await obj.forEach(function (item, index) {
      let objectData = {
        idVoucher: AutoIdVoucher + index,
        idGroupVoucher: AutoId,
        voucherCode: item,
        idCustomersUse: null,
        idLocationUse: null,
        status: 0,
        nameCustomerUse: null,
        nameLocationUse: null,
        usedDate: null,
        softDelete: 0,
        created: {
          createBy: "admin",
          time: Date.now()
        },
        modified: {
          modifyBy: "admin",
          time: Date.now()
        }
      }
      arrayDataVoucher.push(objectData)
    });
    // console.log(arrayDataVoucher)

    const entry = await groupVoucherItemsModel.insertMany(arrayDataVoucher)
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

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.put('/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await groupVoucherModel.findByIdAndUpdate({ _id: _id }, {
      note: req.body?.note,
      classified: req.body?.classified,
      status: req.body?.status,
      discount: req.body?.discount,
      timeLine: req.body?.timeLine,
      scopeApply: req.body?.scopeApply,
      memberGroup: req.body?.memberGroup,
      modified: {
        createBy: "Admin",
        time: Date.now()
      }
    });

    return res.status(200).json({
      success: true,
      data: entry,
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


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.post('/update/many/voucher/add/:id', updateVoucherAdd, idAutoGroupVoucher, async function (req, res, next) {
  try {
    let obj = req.body.voucherCode;
    let arrayDataVoucher = [];
    await obj.forEach(function (item, index) {
      let objectData = {
        idVoucher: AutoIdVoucher + index,
        idGroupVoucher: idGroupVoucher.idGroupVoucher,
        voucherCode: item,
        idCustomersUse: null,
        idLocationUse: null,
        status: 0,
        nameCustomerUse: null,
        nameLocationUse: null,
        usedDate: null,
        softDelete: 0,
        created: {
          createBy: "admin",
          time: Date.now()
        },
        modified: {
          modifyBy: "admin",
          time: Date.now()
        }
      }
      arrayDataVoucher.push(objectData)
    });
    const entry = await groupVoucherItemsModel.insertMany(arrayDataVoucher)
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
/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.delete('/delete/many/voucher', async function (req, res, next) {
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







//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
