const express = require('express');
const router = express.Router();
const todoModel = require('../model/schemaTodo');


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
// -u http://localhost:1509/todo/task 
router.get('/task', async function (req, res, next) {
  try {
    await todoModel
      .find({ isDeleted: false })
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

/* GET todo listing view Important */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/important
router.get('/important', async function (req, res, next) {
  try {
    await todoModel
      .find({ isDeleted: false, isImportant: true })
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

/* GET todo listing view Deleted */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/deleted
router.get('/deleted', async function (req, res, next) {
  try {
    await todoModel
      .find({ isDeleted: true })
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

module.exports = router;
