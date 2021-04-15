const express = require('express');
const router = express.Router();
const mailModel = require('../model/schemaEMail');
const ObjectId = require('mongodb').ObjectId;




let isStarred = true;
let isRead = true;


let handlePaLabels = (param2, param3) => {
  switch (param2) {
    case 'personal':
      return { folder: "inbox", labels: 'personal', subject: param3 }
      break;
    case 'company':
      return { folder: "inbox", labels: 'company', subject: param3 }
      break;
    case 'important':
      return { folder: "inbox", labels: 'important', subject: param3 }
      break;
    case 'private': //? default to  private
      return { folder: "inbox", labels: 'private', subject: param3 }

    default:
      return { folder: "inbox", subject: param3 }
  }
}

let hasFilter = (param, param2, param3) => {
  switch (param) {
    case 'sent':
      return { folder: param, subject: param3 }
      break;
    case 'draft':
      return { folder: param, subject: param3 }
      break;
    case 'starred':
      return { isStarred: isStarred, subject: param3 }
      break;
    case 'spam':
      return { folder: param, subject: param3 }
      break;
    case 'trash':
      return { folder: param, subject: param3 }
      break;
    case 'inbox':
      return { folder: param, subject: param3 }
      break;
    default://? call function  handlePaLabels
      return handlePaLabels(param2, param3)
      break;
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN
/* GET home Todo listing. */

/* GET todo listing view MyTask */
http://localhost:1509/mail/task/?folder=inbox
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/param(filter=)&query(q=)
// ? Example : http://localhost:1509/mail/task?folder=inbox&page=1&perPage=10
// ? Example : http://localhost:1509/mail/task?folder=&label=important&page=1&perPage=10

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

    const emails = await mailModel
      .find(hasFilter(folder, label, regex))
      .sort({ time: -1 })
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);




    const totalRecords = await mailModel.countDocuments(hasFilter(folder, label, regex));
    Promise.all([emailsMeta, emails, totalRecords]).then(([emailsMeta, emails, totalRecords]) => {
      return res.status(200).json({
        success: true,
        emailsMeta: emailsMeta,
        totalRecords: totalRecords,
        emails: emails,
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
      time: new Date().toLocaleDateString(),
      labels: req.body?.labels,
      replies: req.body?.replies,
      folder: 'sent',     // folder after create have value == 'Sent'
      isRead: 'false',     // value default == true
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
// ? Example : http://localhost:1509/task/detail/update/update/606f591f41340a452c5e8377
router.patch('/task/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const item = await mailModel.findOne({ _id: _id });
    let labels = item.labels??[];
    if (labels.includes(req.body?.label)) {
      labels = item.labels.filter(lab => lab != req.body?.label);
    } else {
      labels = [...labels, req.body?.label];
    }

    const entry = await mailModel.findByIdAndUpdate({ _id: _id }, {
      labels: labels,
    });
    return res.status(200).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.log(err);
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
    console.log(req.body.dataToUpdate);
    const cid = req.body.emailIds;
    await mailModel.updateMany({ _id: { $in: cid } }, req.body?.dataToUpdate, (err, result) => {
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

// TODO: METHOD - DELETE MULTI RECORD
// -u http://localhost:1509/mail/task/delete/:id
//? Example : http://localhost:1509/mail/task/delete-multi
router.patch('/task/delete-multi', async function (req, res, next) {
  try {
    const cid = req.body.emailIds;

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
