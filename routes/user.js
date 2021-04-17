const express = require('express');
const router = express.Router();
const userModel = require('../model/schemaUser');

let hasFilter = (param, param2, param3, param4) => {
  if (param !== null && param2 !== null && param3 !== null) {
    return { gender: param, role: param2, active: param3 }

  } else if (param == null && param2 !== null && param3 !== null) {
    return { role: param2, active: param3, name: param4 }
  } else if (param2 == null && param !== null && param3 !== null) {
    return { gender: param, active: param3, name: param4 }
  } else if (param3 == null && param !== null && param2 !== null) {
    return { gender: param, role: param2, name: param4 }
  } else if (param == null && param2 == null && param3 !== null) {
    return { active: param3, name: param4 }
  } else if (param == null && param3 == null && param2 !== null) {
    return { role: param2, name: param4 }
  } else if (param2 == null && param3 == null && param !== null) {
    return { gender: param, name: param4 }
  } else {
    return { name: param4 }
  }
}

//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN
/* GET home Todo listing. */

/* GET todo listing view MyTask */
http://localhost:1509/mail/task/?folder=inbox
// TODO: METHOD - GET
// -u http://localhost:1509/user?query(paginaiton=)&query(q=)
// ? Example : http://localhost:1509/user/list?gender=0&role=1&page=1&perPage=10

router.get('/list', async function (req, res, next) {
  try {
    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let q = req.query.q;
    (gender == undefined || gender == '') ? gender = null : gender = gender;
    (role == undefined || role == '') ? role = null : role = role;
    (active == undefined || active == '') ? active = null : active = active;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await userModel
      .find(hasFilter(gender, role, active, regex))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await userModel.countDocuments(hasFilter(gender, role, active, regex));
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

/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/user/create
// ? Example: http://localhost:1509/user/create
router.post('/create', async function (req, res, next) {
  try {
    const entry = await userModel.create({
      avatar: req.body?.avatar,
      name: req.body?.name,
      gender: req.body?.gender,
      birthDate: req.body?.birthDate,
      role: req.body?.role,
      telephone: req.body?.telephone,
      attachments: req.body?.attachments,
      email: req.body?.email,
      account: req.body?.account,
      password: req.body?.password,
      softDelete: 0,
      created: {
        createBy: "Admin",
        time: Date.now()
      },
      modified: {
        createBy: "Admin",
        time: Date.now()
      }
    })
    return res.status(200).json({
      success: true,
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

/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    await userModel
      .find({ _id: _id })
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

router.put('/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      avatar: req.body?.avatar,
      name: req.body?.name,
      gender: req.body?.gender,
      birthDate: req.body?.birthDate,
      role: req.body?.role,
      telephone: req.body?.telephone,
      attachments: req.body?.attachments,
      email: req.body?.email,
      password: req.body?.password,
      modified: {
        createBy: "Admin",
        time: Date.now()
      }
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


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/user/delete-soft/:id
router.patch('/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await userModel.updateOne({ _id: _id }, { softDelete: 1 });
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
// -u http://localhost:1509/user/delete/:id
router.delete('/delete/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await userModel.findByIdAndDelete({ _id: _id });
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
