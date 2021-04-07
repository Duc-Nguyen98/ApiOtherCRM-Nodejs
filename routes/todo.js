const express = require('express');
const router = express.Router();
const todoModel = require('../model/schemaTodo');


const hasFilter = (task, keyword) => {
  let isImportant = true;
  let isDeleted = true;
  let isCompleted = true;
  if (task === 'important') {
    return { isImportant: isImportant, isDeleted: !isDeleted, title: keyword }
  } else if (task === 'completed') {
    return { isCompleted: isCompleted, isDeleted: !isDeleted, title: keyword }
  } else if (task === 'deleted') {
    return { isDeleted: isDeleted, title: keyword }
  } else {
    return { isDeleted: !isDeleted, title: keyword }
  }
}

const hasSort = type => {
  if (type === 'title-asc') {
    return { title: 1 }
  } else if (type === "title-desc") {
    return { title: -1 }
  } else if (type === 'due-date-desc') {
    return { dueDate: -1 }
  } else {
    return { dueDate: 1 }
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
// -u http://localhost:1509/todo/task/:params?query(q=)&query(sort=)
// ? Example : http://localhost:1509/todo/task/completed?q=5&sort=title-desc

router.get('/task(/:task)?/', async function (req, res, next) {
  try {
    let task = req.params.task;
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    let sort = req.query.sort;
    let currentPage = parseInt(req.query.page);
    console.log(currentPage)
    await todoModel
      .find(hasFilter(task, regex))
      .sort(hasSort(sort))
      .limit(10)
      .skip((currentPage - 1) * 10)
      .then(data => {
        return res.status(200).json({
          success: true,
          data: data
        })
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
// -u http://localhost:1509/todo/task/tag/:params?query(q=)&query(sort=)
// ? Example : http://localhost:1509/todo/task/tag/medium?q=c&sort=due-date-desc
router.get('/task/tag(/:tags)?/', async function (req, res, next) {
  try {
    let q = req.query.q;
    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
    let sort = req.query.sort;
    let tag = req.params.tags;
    let currentPage = parseInt(req.query.page);

    await todoModel
      .find({
        tags: tag,
        isDeleted: false,
        title: regex
      })
      .sort(hasSort(sort))
      .limit(10)
      .skip((currentPage - 1) * 10)
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

router.post('/task/create', async function (req, res, next) {
  try {
    const entry = await todoModel.create({
      title: req.body?.title,
      dueDate: req.body?.dueDate,
      description: req.body?.description,
      tags: req.body?.tags,
      assignee: JSON.parse(req.body?.assignee),
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
        assignee: JSON.parse(req.body?.assignee),
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
    const isCompleted = await todoModel.findById({ _id: _id }).select('isCompleted')
    const entry = await todoModel.findByIdAndUpdate({ _id: _id }, { isCompleted: !isCompleted });
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
// TODO: METHOD - PATCH
// -u http://localhost:1509/todo/task/delete/:id

router.patch('/task/delete/:id', async function (req, res, next) {
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
