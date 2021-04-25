const express = require('express');
const router = express.Router();
const groupVoucherModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucher');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');



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

const hasFilterVoucherItems = (param, param2, param3) => {
  return { voucherCode: param, softDelete: param2, idGroupVoucher: param3 }
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
    const groupVouchers = await groupVoucherModel.find(hasFilterGroupVoucher(classified, status, regex, softDelete)).select({ "discount": 0, "timeLine": 0, "scopeApply": 0, "modified": 0, "note": 0, "_id": 0 });
    return res.status(200).json({
      success: true,
      groupVouchers: groupVouchers,
    });

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
    const groupVouchers = await groupVoucherModel.find(hasFilterGroupVoucher(classified, status, regex, softDelete)).select({ "discount": 0, "timeLine": 0, "scopeApply": 0, "modified": 0, "note": 0, "_id": 0 });
    return res.status(200).json({
      success: true,
      groupVouchers: groupVouchers,
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


// // /* GET Details users listing. */
// // // TODO: METHOD - GET
// // // -u http://localhost:1509/user/create
// // // ? Example: http://localhost:1509/user/create
// router.post('/create', idSMSAuto, async function (req, res, next) {
//   try {
//     const entry = await groupVoucherModel.create({
//       idServices: AutoId,
//       title: req.body?.title,
//       type: req.body?.type,
//       name: req.body?.name,
//       status: req.body?.status,
//       telephone: req.body?.telephone,
//       content: req.body?.content,
//       details: req.body?.details,
//       softDelete: 0,
//     })
//     return res.status(200).json({
//       success: true,
//       data: entry,
//       detailSms: sendSms(entry.telephone, entry.content)
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   };
// });

// /* GET Details users listing. */
// // TODO: METHOD - GET
// // -u http://localhost:1509/services/sms/detail/:id
// // ? Example: http://localhost:1509/services/sms/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    await groupVoucherModel
      .findOne({ _id: _id })
      .select({ "_id": 0 })
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


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/delete-soft/:id
// ? Example: http://localhost:1509/voucher/group/delete-soft/:

router.delete('/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await groupVoucherModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 }).select({ "_id": 0 });
    return res.status(200).json({
      success: true,
      data: entry
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
    const entry = await groupVoucherModel.findOneAndDelete({ _id: _id }).select({ "_id": 0 });
    return res.status(200).json({
      success: true,
      data: entry
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
    }).select({ "_id": 0 });
    return res.status(200).json({
      success: true,
      data: entry
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



//! VOUCHER ITEMS

// /* GET List Group Voucher listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher
// ? Example: http://localhost:1509/voucher/group/list/voucher/item/:idGroupVoucher

router.get('/list/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let status = req.query.status;
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
      .find(hasFilterVoucherItems(regex, softDelete, idGroupVoucher))
      .select({ "_id": 0 })
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(hasFilterVoucherItems(regex, softDelete, idGroupVoucher));

    Promise.all([groupVoucherItems, countGroupVoucherItems]).then(([groupVoucherItems, countGroupVoucherItems]) => {
      return res.status(200).json({
        success: true,
        groupVoucherItems: groupVoucherItems,
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


// /* GET List Group Voucher Items Follow IdGroup listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/voucher/group/trash/voucher/item/:idGroupVoucher
// ? Example: http://localhost:1509/voucher/group/trash/voucher/item/:idGroupVoucher

router.get('/trash/voucher/item/:idGroupVoucher', async function (req, res, next) {
  try {
    let idGroupVoucher = req.params.idGroupVoucher;
    let status = req.query.status;
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
      .find(hasFilterVoucherItems(regex, softDelete, idGroupVoucher))
      .select({ "_id": 0 })
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const countGroupVoucherItems = await groupVoucherItemsModel.countDocuments(hasFilterVoucherItems(regex, softDelete, idGroupVoucher));

    Promise.all([groupVoucherItems, countGroupVoucherItems]).then(([groupVoucherItems, countGroupVoucherItems]) => {
      return res.status(200).json({
        success: true,
        groupVoucherItems: groupVoucherItems,
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



//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
