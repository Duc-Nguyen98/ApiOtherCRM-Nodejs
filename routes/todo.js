const express = require('express');
const router = express.Router();
const todoModel = require('../model/schemaTodo');

let isImportant = true;
let isDeleted = true;
let isCompleted = true;

let hasFilter = (task, keyword) => {
  switch (task) {
    case 'important':
      return { isImportant: isImportant, isDeleted: !isDeleted, title: keyword }
      break;
    case 'completed':
      return { isCompleted: isCompleted, isDeleted: !isDeleted, title: keyword }
      break;
    case 'deleted':
      return { isDeleted: isDeleted, title: keyword }
      break;
    default:
      return { isDeleted: !isDeleted, title: keyword }
  }
}

const hasSort = type => {
  switch (type) {
    case 'title-asc':
      return { title: 1 }
      break;
    case 'title-desc':
      return { title: -1 }
      break;
    case 'due-date-desc':
      return { dueDate: -1 }
      break;
    default:
      return { dueDate: 1 }
  }
}

const hasTotalRecords = param => {
  switch (param) {
    case 'important':
      return { isImportant: isImportant }
      break;
    case 'completed':
      return { isCompleted: isCompleted }
      break;
    case 'deleted':
      return { isDeleted: isDeleted }
      break;
    case 'team':
      return { tags: 'team' }
      break;
    case 'low':
      return { tags: 'low' }
      break;
    case 'medium':
      return { tags: 'medium' }
      break;
    case 'high':
      return { tags: 'high' }
      break;
    case 'update':
      return { tags: 'update' }
      break;

    default:
      return { isDeleted: !isDeleted }
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
// -u http://localhost:1509/todo/task/?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/todo/task?filter=important&sort=title-desc&page=1&perPage=10
router.get('/task', async function (req, res, next) {
  try {
    let filter = req.query.filter;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    let sort = req.query.sort;
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await todoModel.countDocuments(hasTotalRecords(filter));

    const taskTwo = await todoModel
      .find(hasFilter(filter, regex))
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

/* GET todo listing return list todo follow Tags */

// TODO: METHOD - GET
// -u http://localhost:1509/todo/task/tag/?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/todo/task/tag/?filter=medium&q=c&sort=due-date-desc&page=1&perPage=10
router.get('/task/tag/', async function (req, res, next) {

  try {
    let filter = req.query.filter;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    let sort = req.query.sort;
    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const taskOne = await todoModel.countDocuments(hasTotalRecords(filter));
    const taskTwo = await todoModel
      .find({
        tags: filter,
        isDeleted: false,
        title: regex
      })
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
// -u http://localhost:1509/todo/task/detail/:id
router.get('/task/detail/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    await todoModel
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

/* POST todo listing create a record. */
// TODO: METHOD - POST
// -u http://localhost:1509/todo/task/create
router.patch('/task/create', async function (req, res, next) {
  try {
    const entry = await todoModel.create({
      title: req.body?.title,
      dueDate: req.body?.dueDate,
      description: req.body?.description,
      tags: req.body?.tags,
      assignee: req.body?.assignee,
      isCompleted: req.body?.isCompleted,
      isImportant: req.body?.isImportant,
      isDeleted: req.body?.isDeleted,
      idAuthor: req.body?.idAuthor,
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
// -u http://localhost:1509/todo/task/update/:id
router.put('/task/update/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await todoModel
      .findByIdAndUpdate({ _id: _id }, {
        title: req.body?.title,
        dueDate: req.body?.dueDate,
        description: req.body?.description,
        tags: req.body?.tags,
        assignee: req.body?.assignee,
        isCompleted: req.body?.isCompleted,
        isImportant: req.body?.isImportant,
        isDeleted: req.body?.isDeleted,
        idAuthor: req.body?.idAuthor,
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


/* PATCH todo listing change status isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/todo/task/change/:id
router.patch('/task/change/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const isCompleted = req.body?.isCompleted;
    const entry = await todoModel.findByIdAndUpdate({ _id: _id }, { isCompleted: isCompleted });
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

/* PATCH todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/todo/task/delete-soft/:id
router.delete('/task/delete-soft/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await todoModel.updateOne({ _id: _id }, { isDeleted: true });
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
router.delete('/task/delete/:id', async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await todoModel.findByIdAndDelete({ _id: _id });
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

/* GET todo listing Search Record */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/task/search/?keyword=abc

// router.get('/task/search', async function (req, res, next) {
//   let q = req.query.q;
//   var regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
//   return todoModel.find({ title: regex }, function (err, q) {
//     return res.send(q);
//   });
// });


//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
