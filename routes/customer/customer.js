const express = require('express');
const router = express.Router();
const customerModel = require('../../model/customer/customer/schemaCustomer');
const groupCustomerModel = require('../../model/customer/groupCustomer/schemaGroupCustomer');
const checkAuthentication = require('../../utils/checkAuthentication');

const multer = require('multer');
const fs = require('fs');


const handleFilterSearch = (param, param2, param3, param4) => {
  if (param !== '' && param2 !== '') {
    return { groups: parseInt(param), gender: parseInt(param2), name: param3, softDelete: param4 }
  } else if (param !== '' && param2 == '') {
    return { groups: parseInt(param), name: param3, softDelete: param4 }
  } else if (param == '' && param2 !== '') {
    return { gender: parseInt(param2), name: param3, softDelete: param4 }
  } else {
    return { name: param3, softDelete: param4 }
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

// TODO: MIDDLEWARE
const idCustomerAuto = async (req, res, next) => {
  await customerModel.findOne({}, { idCustomer: 1, _id: 0 }).sort({ idCustomer: -1 })
    .then(data => {
      (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idCustomer + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}
/* GET todo listing view MyTask */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/task?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/user/list?group=&gender=&q=&sort=title-desc&page=1&perPage=10
router.get('/list', checkAuthentication, async function (req, res, next) {

  try {
    let group = req.query.group;
    let gender = req.query.gender;
    let softDelete = 0;
    (group == undefined || group == '') ? group = '' : group = group;
    (gender == undefined || gender == '') ? gender = '' : gender = gender;

    let q = req.query.q;

    let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await customerModel
      .find(handleFilterSearch(group, gender, keyword, softDelete))
      .sort({ idCustomer: -1 })
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const taskTwo = await customerModel.countDocuments(handleFilterSearch(group, gender, keyword, softDelete));

    Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
      return res.status(200).json({
        success: true,
        totalRecords: dataTwo,
        data: dataOne,
      });
    })
  } catch (err) {
    console.log(err);
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
    await customerModel
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




/* POST todo listing create a record. */
// TODO: METHOD - POST
// -u http://localhost:1509/customer/create
router.post('/create', checkAuthentication, idCustomerAuto, async function (req, res, next) {
  try {
    const entry = await customerModel.create({
      idCustomer: AutoId,
      name: req.body?.name,
      address: req.body?.address,
      email: req.body?.email,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      telephone: req.body?.telephone,
      note: req.body?.note,
      groups: req.body?.groups,
      created: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      },
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      },
      softDelete: 0
    })
    return res.status(200).json({
      success: true,
      message: "Created Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };

});

/* PUT todo listing. update an record */
// TODO: METHOD - PUT
// -u http://localhost:1509/todo/update/:id
router.put('/update/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await customerModel
      .findByIdAndUpdate({ _id: _id }, {
        avatar: req.body?.avatar,
        name: req.body?.name,
        address: req.body?.address,
        email: req.body?.email,
        gender: req.body?.gender,
        birthDay: req.body?.birthDay,
        telephone: req.body?.telephone,
        note: req.body?.note,
        groups: req.body?.groups,
        modified: {
          createBy: `US${userObj.idUser}-${userObj.name}`,
          time: Date.now()
        },
      })
    return res.status(200).json({
      success: true,
      message: "Update Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



/* PUT upload Avatar for Customer. */
// TODO: METHOD - PUT
// -u http://localhost:1509/customer/upload/:id

router.post('/upload/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, './public/upload/customers');
      },
      filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
      }
    });

    const upload = multer({ storage: storage }).any('file');

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }
      let results = req.files.map(async (file) => {
        const user = await customerModel.findOne({ _id: _id });
        var filePath = user.avatar;

        if (filePath) {
          if (fs.existsSync('./public/' + filePath)) {
            fs.unlinkSync('./public/' + filePath);
          }
        }

        const entry = await customerModel.findByIdAndUpdate({ _id: _id }, {
          avatar: `upload/customers/${file.filename}`,
          modified: {
            createBy: `US${userObj.idUser}-${userObj.name}`,
            time: Date.now()
          }
        });

        return res.status(200).json({
          success: true,
          data: `upload/customers/${file.filename}`,
          message: "Upload Avatar Successfully!"
        });
      });

    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* DELETE todo listing deleteSoft Customer */
// TODO: METHOD - DELETE SOFT
// -u http://localhost:1509/customer/delete-soft/:id
router.delete('/delete-soft/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await customerModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
    return res.status(200).json({
      success: true,
      message: "Delete-Soft Successfully!"
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
// -u http://localhost:1509/todo/task/delete/:id
router.delete('/delete/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await customerModel.findOneAndDelete({ _id: _id });
    return res.status(200).json({
      success: true,
      message: "Delete Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



router.get('/list/trash', checkAuthentication, async function (req, res, next) {
  try {
    let group = req.query.group;
    let gender = req.query.gender;
    let softDelete = 1;
    (group == undefined) ? group = '' : group = group;
    (gender == undefined) ? gender = '' : gender = gender;

    let q = req.query.q;

    let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await customerModel
      .find(handleFilterSearch(group, gender, keyword, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const taskTwo = await customerModel.countDocuments(handleFilterSearch(group, gender, keyword, softDelete));

    Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
      return res.status(200).json({
        success: true,
        totalRecords: dataTwo,
        data: dataOne,
      });
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/trash/restore/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await customerModel.findOneAndUpdate({ _id: _id }, {
      softDelete: 0
    });
    return res.status(200).json({
      success: true,
      message: "Restore Successfully!"
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
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/delete-soft/many/customer', checkAuthentication, async function (req, res, next) {
  try {
    const obj = req.body.CustomerIdArray;

    const entry = await customerModel.updateMany({ idCustomer: { $in: obj } }, {
      softDelete: 1
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Delete Soft Customers Successfully"
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
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/restore/many/customer', checkAuthentication, async function (req, res, next) {
  try {
    const obj = req.body.CustomerIdArray;

    const entry = await customerModel.updateMany({ idCustomer: { $in: obj } }, {
      softDelete: 0
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        message: "Restore Customers Successfully"
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
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/delete/many/customer', async function (req, res, next) {
  try {
    const obj = req.body.CustomerIdArray;



    // const entry = await customerModel.updateMany({ idCustomer: { $in: obj } }, {
    //   softDelete: 0
    // }, (err, result) => { })

    const entry2 = await groupCustomerModel.find();

    console.log(entry2)


    return res.status(200).json({
      success: true,
      message: "Delete Customers Successfully"
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
