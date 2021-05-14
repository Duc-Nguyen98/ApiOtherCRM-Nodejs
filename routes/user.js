const express = require('express');
const router = express.Router();
const userModel = require('../model/groupUser/schemaUser');
const roleModel = require('../model/groupUser/schemaRole');
const permissionModel = require('../model/groupUser/schemaPermission');
const multer = require('multer');
const fs = require('fs');
const checkAuthentication = require('../utils/checkAuthentication');
const sgMail = require('@sendgrid/mail')



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

const checkEmail = async (req, res, next) => {
  let email = req.body?.email;
  await userModel.findOne({ email: email })
    .then(data => {
      if (data) {
        return res.status(200).json({
          success: true,
          message: "👋 This email address is already used!"
        });
      } else {
        next();
      }
    })
    .catch(err => {
      console.log(err)
    })
}


const roleDefault = async (req, res, next) => {
  let _id = req.body.idRole;
  await roleModel.findOne({ _id: _id }).select({ _id: 0 })
    .then(data => {
      RoleUser = data;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


const idUserAuto = async (req, res, next) => {
  await userModel.findOne({}, { idUser: 1, _id: 0 }).sort({ idUser: -1 })
    .then(data => {
      (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idUser + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


router.get('/list', checkAuthentication, async function (req, res, next) {
  try {

    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let softDelete = 0;
    let q = req.query.q;
    (gender == undefined || gender == '') ? gender = null : gender = gender;
    (role == undefined || role == '') ? role = null : role = role;
    (active == undefined || active == '') ? active = null : active = active;
    // console.log(gender, role, active, q)

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
router.post('/create', checkAuthentication, checkEmail, idUserAuto, roleDefault, async function (req, res, next) {
  try {

    const entry = await userModel.create({
      idUser: AutoId,
      name: req.body?.name,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      telephone: req.body?.telephone,
      email: req.body?.email,
      password: req.body?.password,
      active: 0,
      softDelete: 0,
      created: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      },
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    })
    const entry2 = await permissionModel.create({
      idUser: AutoId,
      nameRole: RoleUser.name,
      modules: RoleUser.modules,
      ability: RoleUser.ability
    })
    return res.status(200).json({
      success: true,
      message: "👋 Create Successfully!"
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
router.get('/detail/:id', checkAuthentication, async function (req, res, next) {
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

router.put('/update/:idUser', async function (req, res, next) {
  try {
    let idUser = req.params.idUser;
    let permiss = req.body.permission;

    const entry = await userModel.findOneAndUpdate({ idUser: idUser }, {
      $set: {
        name: req.body?.name,
        gender: req.body?.gender,
        birthDay: req.body?.birthDay,
        active: req.body?.active,
        telephone: req.body?.telephone,
        email: req.body?.email,
        password: req.body?.password,
        // modified: {
        //   createBy: `US${userObj.idUser}-${userObj.name}`,
        //   time: Date.now()
        // }
      }
    });

    // const entry2 = await permissionModel.updateOne({ idUser: idUser }),{
    //   $set: {
    //     name: permiss.name,
    //     modules: permiss.modules,
    //     ability: permiss.ability,
    //   }
    // });



    return res.status(200).json({
      success: true,
      message: "Update Successfully!"
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

router.patch('/active/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      active: req.body?.active,
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    });
    return res.status(200).json({
      success: true,
      message: "Change Status Successfully!"
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

router.post('/upload/:id', checkAuthentication, async function (req, res, next) {
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
            createBy: `US${userObj.idUser}-${userObj.name}`,
            time: Date.now()
          }
        });

        return res.status(200).json({
          success: true,
          data: `upload/users/${file.filename}`,
          message: "Update Avatar Successfully!"
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
router.delete('/delete-soft/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await userModel.updateOne({ _id: _id }, { softDelete: 1, active: 1 });
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
// -u http://localhost:1509/user/delete/:id
router.delete('/delete/:idUser', checkAuthentication, async function (req, res, next) {
  try {
    const idUser = req.params.idUser;
    const entry = await userModel.findOneAndDelete({ idUser: idUser });
    const entry2 = await permissionModel.findOneAndDelete({ idUser: idUser });

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

router.patch('/trash/restore/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findOneAndUpdate({ _id: _id }, {
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





//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
