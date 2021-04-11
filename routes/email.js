const express = require('express');
const router = express.Router();
const mailModel = require('../model/schemaEMail');
const ObjectId = require('mongodb').ObjectId;




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
    case 'inbox':
      return { isRead: isRead, subject: param3 }
      break;
    default://? call function  handlePaLabels
      return handlePaLabels(param2, param3)
      break;
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
// ? Example : http://localhost:1509/mail/task/?folder=inbox&q=&page=1&perPage=10
// ? Example :http://localhost:1509/mail/task/?folder=&page=1&perPage=10&q=&label=personal

router.get('/task/', async function (req, res, next) {
  try {
    let folder = req.query.folder;
    let label = req.query.label;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }
    const emails = await mailModel
      .find(hasFilter(folder, label, regex))
      .sort({ time: -1 })
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

    const totalRecords = await mailModel.countDocuments(hasFilter(folder, label, regex));

    let meta = await mailModel.aggregate(
      [
        {
          $group: {
            _id: "$folder",
            count: { $sum: 1 }
          }
        }
      ]
    );

    let emailsMeta = {};

    meta.map(obj => {
      switch (obj._id) {
        case 'sent':
          emailsMeta.sent = obj.count
          break;
        case 'trash':
          emailsMeta.trash = obj.count
          break;
        case 'draft':
          emailsMeta.draft = obj.count
          break;
        case 'spam':
          emailsMeta.spam = obj.count
          break;
        case 'inbox':
          emailsMeta.inbox = obj.count
          break;
        case 'starred':
          emailsMeta.starred = obj.count
          break;
      }
    })

    Promise.all([emails, emailsMeta, totalRecords]).then(([emails, emailsMeta, totalRecords]) => {
      return res.status(200).json({
        success: true,
        totalRecords: totalRecords,
        emails: emails,
        emailsMeta: emailsMeta
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
// -u http://localhost:1509/mail/task/create
// ? Example: http://localhost:1509/mail/task/create
router.post('/task/create', async function (req, res, next) {
  try {
    const entry = await mailModel.create({
      from: req.body?.from,
      to: req.body?.to,
      subject: req.body?.subject,
      cc: req.body?.cc,
      bcc: req.body?.bcc,
      message: req.body?.message,
      attachments: req.body?.attachments,
      time: req.body?.time,
      labels: req.body?.labels,
      replies: req.body?.replies,
      folder: req.body?.folder,     // folder after create have value == 'Sent'
      isRead: req.body?.isRead,     // value default == true
      isStarred: req.body?.isStarred,  // value default == false
      idAuthor: req.body?.idAuthor,
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
// -u http://localhost:1509/mail/task/is-starred/:id

router.patch('/task/is-starred/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const isStarred = req.body?.isStarred;

    const entry = await mailModel.findByIdAndUpdate({ _id: _id }, { isStarred: isStarred });

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
// ? Example : http://localhost:1509/mail/task/update-multi
router.patch('/task/update-multi', async function (req, res, next) {
  try {
    const cid = req.body.cid;
    await mailModel.updateMany({ _id: { $in: cid } }, {
      labels: req.body?.labels,
      isRead: req.body?.isRead,
      folder: req.body?.folder,
    }, (err, result) => {
      return res.status(200).json({
        success: true,
        data: result
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

// TODO: METHOD - DELETE AN RECORD
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

// TODO: METHOD - DELETE MULTI RECORD
// -u http://localhost:1509/mail/task/delete/:id
//? Example : http://localhost:1509/mail/task/delete-multi
router.delete('/task/delete-multi', async function (req, res, next) {

  try {
    const cid = req.body.cid;
    await mailModel.deleteMany({ _id: { $in: cid } }, (err, result) => {
      return res.status(200).json({
        success: true,
        data: result
      });
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
