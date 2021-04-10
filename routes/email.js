const express = require('express');
const router = express.Router();
const mailModel = require('../model/schemaEMail');

let isStarred = true;
let isRead = true;

let hasFilter = (param, param2, param3) => {
  switch (param) {
    case 'sent':
      return { folder: param, isRead: isRead, subject: param3 }
      break;
    case 'draft':
      return { folder: param, isRead: isRead, subject: param3 }
      break;
    case 'starred':
      return { folder: param, isRead: isRead, isStarred: isStarred, subject: param3 }
      break;
    case 'spam':
      return { folder: param, isRead: isRead, subject: param3 }
      break;
    case 'trash':
      return { folder: param, isRead: !isRead, subject: param3 }
      break;
    case 'label':  //? call function  handlePaLabels
      return handlePaLabels(param2, param3)
      break;
    default:
      return { isRead: isRead, subject: param3 }
  }
}

handlePaLabels = (param2, param3) => {
  switch (param2) {
    case 'personal':
      return { isRead: isRead, labels: 'personal', subject: param3 }
      break;
    case 'company':
      return { isRead: isRead, labels: 'company', subject: param3 }
      break;
    case 'important':
      return { isRead: isRead, labels: 'important', subject: param3 }
      break;
    case 'private': //? default to  private
      return { isRead: isRead, labels: 'private', subject: param3 }
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN
/* GET home Todo listing. */

/* GET todo listing view MyTask */
http://localhost:1509/mail/task/?folder=inbox
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/mail/task?folder=inbox&page=1&perPage=10
router.get('/task(/:folder)?(/:label)?', async function (req, res, next) {
  try {
    let folder = req.params.folder;
    let label = req.params.label;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }
    const taskOne = await mailModel
      .find(hasFilter(folder, label, regex))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const taskTwo = await mailModel.countDocuments(hasFilter(folder, label, regex));


    Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
      return res.status(200).json({
        success: true,
        totalRecords: dataTwo,
        data: dataOne,
      });
    })
  } catch (err) {
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
router.get('/task/detail/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    await mailModel
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
// -u http://localhost:1509/todo/task/is-starred/:id

router.patch('/task/is-starred/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const isStarred = req.body?.isStarred;

    const entry = await todoModel.findByIdAndUpdate({ _id: _id }, { isStarred: isStarred });
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

/* PATCH todo listing deleteSoft Record . */
// TODO: METHOD - PATCH
// -u http://localhost:1509/todo/task/delete-soft/:id
// ? Example : http://localhost:1509/mail/task/detail/delete-soft/606f591f41340a452c5e8377
router.patch('/task/detail/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await mailModel.findByIdAndUpdate({ _id: _id }, { isRead: false });
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

// TODO: METHOD - DELETE
// -u http://localhost:1509/mail/task/delete/:id
//? Example : http://localhost:1509/mail/task/delete/606f591f41340a452c5e8376
router.delete('/task/delete/:id', async function (req, res, next) {

  try {
    const _id = req.params.id;
    const entry = await mailModel.findByIdAndDelete({ _id: _id });
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
