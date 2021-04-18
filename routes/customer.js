const express = require('express');
const router = express.Router();
const customerModel = require('../model/schemaCustomer');


handleFilterSearch = (param, param2, param3, param4) => {
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
/* GET home Todo listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/
router.get('/', async function (req, res, next) {
  res.send({
    status: 200,
    message: 'Success API ToDo'
  })
});

/* GET todo listing view MyTask */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/task?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/user/list?group=&gender=&q=&sort=title-desc&page=1&perPage=10
router.get('/list', async function (req, res, next) {

  try {
    let group = req.query.group;
    let gender = req.query.gender;
    let softDelete = 0;
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


// * GET Details users listing. 
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
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
router.post('/create', async function (req, res, next) {
  try {
    const entry = await customerModel.create({
      name: req.body?.name,
      address: req.body?.address,
      email: req.body?.email,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      telephone: req.body?.telephone,
      note: req.body?.note,
      groups: req.body?.groups,
      created: {
        createBy: "Admin",
        time: Date.now()
      },
      modified: {
        createBy: "Admin",
        time: Date.now()
      },
      softDelete: 0
    })
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

/* PUT todo listing. update an record */
// TODO: METHOD - PUT
// -u http://localhost:1509/todo/update/:id
router.put('/update/:id', async function (req, res, next) {
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
        // lastTrading: req.body?.lastTrading, // lấy ngày hiện tại của giao dịch mới nhất
        groups: req.body?.groups,
        modified: {
          createBy: "Admin",
          time: Date.now()
        },
      })
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


/* DELETE todo listing deleteSoft Customer */
// TODO: METHOD - DELETE SOFT
// -u http://localhost:1509/customer/delete-soft/:id
router.patch('/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await customerModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
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
// -u http://localhost:1509/todo/task/delete/:id
router.delete('/delete/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await customerModel.findOneAndDelete({ _id: _id });
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

router.patch('/trash/restore/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await customerModel.findOneAndUpdate({ _id: _id }, {
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
