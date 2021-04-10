const express = require('express');
const router = express.Router();
const mailModel = require('../model/schemaEMail');
const { ObjectId } = require('mongodb');




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
let handlePaLabels = (param2, param3) => {
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
// -u http://localhost:1509/mail/task/param(filter=)&query(q=)
// ? Example : http://localhost:1509/mail/task/sent?q=&page=1&perPage=10
// ? Example : http://localhost:1509/mail/task/label/personal?q=&page=1&perPage=10

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

/* PATCH todo listing update an Record . */
// TODO: METHOD - PATCH
// -u http://localhost:1509/todo/task/update/:id
// ? Example : http://localhost:1509/mail/task/detail/update/606f591f41340a452c5e8377
router.patch('/task/detail/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await mailModel.findByIdAndUpdate({ _id: _id }, {
      isStarred: req.body?.isStarred,
      labels: req.body?.labels,
      isRead: req.body?.isRead,
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


/* PATCH todo listing Update MultiRecord & count Record Update   . */
// TODO: METHOD - PATCH
// -u http://localhost:1509/todo/task/param=:options
// ? Example : http://localhost:1509/mail/task/update-all/606f591f41340a452c5e8377
router.patch('/task/update-all', async function (req, res, next) {
  try {
    const arr = [ObjectId("606f591f41340a452c5e8377"), ObjectId("606f591f41340a452c5e8378"), ObjectId("606f591f41340a452c5e8379")];
    const entry = await mailModel.updateMany(
      {
        _id:
        {
          $in: arr

        }
      },
      {
        $set: {
          folder: req.body?.folder,
          labels: req.body?.labels,
          isRead: req.body?.isRead,
        }
      },
    )



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
