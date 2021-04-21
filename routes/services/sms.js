const express = require('express');
const router = express.Router();
const cmsModel = require('../../model/services/schemaSms');
const customerModel = require('../../model/schemaCustomer');



const hasFilter = (param, param2, param3, param4) => {
  if (param !== null && param2 !== null) {
    return { type: param, status: param2, title: param3, softDelete: param4 }
  } else if (param == null && param2 !== null) {
    return { status: param2, title: param3, softDelete: param4 }
  } else if (param !== null && param2 == null) {
    return { type: param, title: param3, softDelete: param4 }
  } else {
    return { title: param3, softDelete: param4 }
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

idSMSAuto = async (req, res, next) => {
  await cmsModel.findOne({}, { idServices: 1, _id: 0 }).sort({ idServices: -1 })
    .then(data => {
      AutoId = data.idServices + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


sendSms = (telephoneCustomer, content) => {
  const client = require('twilio')(
    "AC80ed1b888d269dc287173c2202ec9ace",
    "2a94e9d362710c2a2aa3a51654ff22d8"
  );

  client.messages.create({
    from: "+15708730303",
    to: telephoneCustomer,
    body: content
    // to: "+84393177289",

    // body: "You just sent an SMS from Node.js using Twilio!"
  })
  return "Send SMS Success !";
}

// /* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/services/sms
// ? Example: http://localhost:1509/services/sms/list/customer




router.get('/list/customer', async function (req, res, next) {
  try {
    const customers = await customerModel.find({ softDelete: 0 });
    return res.status(200).json({
      success: true,
      customers: customers,
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

router.get('/list', async function (req, res, next) {
  try {
    let type = req.query.type;
    let status = req.query.status;
    let softDelete = 0;
    let q = req.query.q;
    (type == undefined || type == '') ? type = null : type = type;
    (status == undefined || status == '') ? status = null : status = status;
    console.log(type, status, q)

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await cmsModel
      .find(hasFilter(type, status, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await cmsModel.countDocuments(hasFilter(type, status, regex, softDelete));
    Promise.all([users, totalRecords]).then(([users, totalRecords]) => {
      return res.status(200).json({
        success: true,
        totalRecords: totalRecords,
        users: users,
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
// // -u http://localhost:1509/user/create
// // ? Example: http://localhost:1509/user/create
router.post('/create', idSMSAuto, async function (req, res, next) {
  try {

    // const entry = await cmsModel.create({
    //   idSMSAuto: AutoId,
    //   title: req.body?.title,
    //   type: req.body?.type,
    //   name: req.body?.name,
    //   status: req.body?.status,
    //   telephone: req.body?.telephone,
    //   content: req.body?.content,
    //   details: req.body?.details,
    //   softDelete: 0,
    // }).then(data => {

    // })

    sendSms("+84393177289", "Test ngay lúc này")



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
// -u http://localhost:1509/services/sms/detail/:id
// ? Example: http://localhost:1509/services/sms/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    await cmsModel
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


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/services/sms/delete-soft/:id
router.delete('/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await cmsModel.updateOne({ _id: _id }, { softDelete: 1 });
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
// -u http://localhost:1509/services/sms/delete/:id
router.delete('/delete/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await cmsModel.findByIdAndDelete({ _id: _id });
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


router.get('/list/trash', async function (req, res, next) {
  try {
    let type = req.query.type;
    let status = req.query.status;
    let softDelete = 1;
    let q = req.query.q;
    (type == undefined || type == '') ? type = null : type = type;
    (status == undefined || status == '') ? status = null : status = status;
    console.log(type, status, q)

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await cmsModel
      .find(hasFilter(type, status, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await cmsModel.countDocuments(hasFilter(type, status, regex, softDelete));
    Promise.all([users, totalRecords]).then(([users, totalRecords]) => {
      return res.status(200).json({
        success: true,
        totalRecords: totalRecords,
        users: users,
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
// -u http://localhost:1509/services/sms/trash/restore/:id

router.patch('/trash/restore/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await cmsModel.findOneAndUpdate({ _id: _id }, {
      softDelete: 0,
    });
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




//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
