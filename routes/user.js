const express = require('express');
const router = express.Router();
const userModel = require('../model/schemaUser');
const multer = require('multer');
const fs = require('fs');


const hasFilter = (param, param2, param3, param4, param5) => {
  if (param !== null && param2 !== null && param3 !== null) {

    return { gender: param, role: param2, active: param3, softDelete: param5 }

  } else if (param == null && param2 !== null && param3 !== null) {

    return { role: param2, active: param3, name: param4, softDelete: param5 }

  } else if (param2 == null && param !== null && param3 !== null) {

    return { gender: param, active: param3, name: param4, softDelete: param5 }

  } else if (param3 == null && param !== null && param2 !== null) {

    return { gender: param, role: param2, name: param4, softDelete: param5 }

  } else if (param == null && param2 == null && param3 !== null) {

    return { active: param3, name: param4, softDelete: param5 }

  } else if (param == null && param3 == null && param2 !== null) {

    return { role: param2, name: param4, softDelete: param5 }

  } else if (param2 == null && param3 == null && param !== null) {

    return { gender: param, name: param4, softDelete: param5 }

  } else {

    return { name: param4, softDelete: param5 }
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const idUserAuto = async (req, res, next) => {
  await userModel.findOne({}, { idUser: 1, _id: 0 }).sort({ idUser: -1 })
    .then(data => {
      AutoId = data.idUser + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


router.get('/list', async function (req, res, next) {
  try {
    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let softDelete = 0;
    let q = req.query.q;
    (gender == undefined || gender == '') ? gender = null : gender = gender;
    (role == undefined || role == '') ? role = null : role = role;
    (active == undefined || active == '') ? active = null : active = active;
    console.log(gender, role, active, q)

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await userModel
      .find(hasFilter(gender, role, active, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await userModel.countDocuments(hasFilter(gender, role, active, regex, softDelete));
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
router.post('/create', idUserAuto, async function (req, res, next) {
  try {

    const entry = await userModel.create({
      idUser: AutoId,
      name: req.body?.name,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      role: req.body?.role,
      telephone: req.body?.telephone,
      email: req.body?.email,
      account: req.body?.account,
      password: req.body?.password,
      active: 1,
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

router.put('/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      name: req.body?.name,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      role: req.body?.role,
      active: req.body?.active,
      telephone: req.body?.telephone,
      email: req.body?.email,
      password: "123456",
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
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/active/:id

router.patch('/active/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      active: req.body?.active,
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


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/upload/:id

router.post('/upload/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, './public/upload/users');
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
        const user = await userModel.findOne({ _id: _id });
        var filePath = user.avatar;

        if (filePath) {
          if (fs.existsSync('./public/' + filePath)) {
            fs.unlinkSync('./public/' + filePath);
          }
        }

        const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
          avatar: `upload/users/${file.filename}`,
          modified: {
            createBy: "Admin",
            time: Date.now()
          }
        });

        return res.status(200).json({
          success: true,
          data: `upload/users/${file.filename}`
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

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/user/delete-soft/:id
router.delete('/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await userModel.updateOne({ _id: _id }, { softDelete: 1, active: 1 });
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


router.get('/list/trash', async function (req, res, next) {
  try {
    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let softDelete = 1;
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
      .find(hasFilter(gender, role, active, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await userModel.countDocuments(hasFilter(gender, role, active, regex, softDelete));
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
// -u http://localhost:1509/active/:id

router.patch('/trash/restore/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      softDelete: 0,
      active: 0
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
