const express = require('express');
const router = express.Router();
const mailModel = require('../model/schemaEMail');

let isStarred = true;
let isRead = true;

let hasFilter = (task, keyword) => {
  switch (task) {
    case 'sent':
      return { isRead: isRead, title: keyword }
      break;
    case 'draft':
      return { isRead: isRead, title: keyword }
      break;
    case 'starred':
      return { isRead: isRead, isStarred: isStarred, title: keyword }
      break;
    case 'spam':
      return { isRead: isRead, title: keyword }
      break;
    case 'trash':
      return { isRead: isRead, title: keyword }
      break;
    case 'personal':
      return { isRead: isRead, labels: 'medium', title: keyword }
      break;
    case 'company':
      return { isRead: isRead, labels: 'company', title: keyword }
      break;
    case 'important':
      return { isRead: isRead, labels: 'important', title: keyword }
      break;
    case 'private':
      return { isRead: isRead, labels: 'private', title: keyword }
      break;
    default:
      return { isRead: !isRead, title: keyword }
  }
}

const hasTotalRecords = param => {
  switch (param) {
    case 'sent':
      return { folder: "sent", isRead: isRead }
      break;
    case 'draft':
      return { folder: 'draft', isRead: isRead }
      break;
    case 'starred':
      return { isStarred: isStarred, isRead: isRead }
      break;
    case 'spam':
      return { folder: 'spam', isRead: isRead }
      break;
    case 'trash':
      return { isRead: !isRead }
      break;
    case 'personal':
      return { isRead: isRead, labels: 'personal' }
      break;
    case 'company':
      return { isRead: isRead, labels: 'company' }
      break;
    case 'important':
      return { isRead: isRead, labels: 'important' }
      break;
    case 'private':
      return { isRead: isRead, labels: 'private' }
      break;

    default:
      return { isRead: isRead }
  }
}

//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN
/* GET home Todo listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/mail/
router.get('/', async function (req, res, next) {
  res.send({
    status: 200,
    message: 'Success API ToDo'
  })
});

/* GET todo listing view MyTask */
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/mail/task?labels=important&page=1&perPage=10
router.get('/task', async function (req, res, next) {
  try {
    let labels = req.query.labels;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    console.log(labels, q)
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await mailModel.countDocuments(hasTotalRecords(labels));

    const taskTwo = await mailModel
      .find(hasFilter(labels, regex))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
      return res.status(200).json({
        success: true,
        totalRecords: dataOne,
        data: dataTwo,
      });
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* GET todo listing return list todo follow Tags */

// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/?query(tag=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/mail/task/?tag=medium&q=c&sort=due-date-desc&page=1&perPage=10
router.get('/task/tag', async function (req, res, next) {

  try {
    let tag = req.query.tag;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    let sort = req.query.sort;
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await mailModel.countDocuments(hasTotalRecords(tag));
    const taskTwo = await mailModel
      .find(hasFilter(tag, regex))
      .sort(hasSort(sort))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
      return res.status(200).json({
        success: true,
        totalRecords: dataOne,
        data: dataTwo,
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
