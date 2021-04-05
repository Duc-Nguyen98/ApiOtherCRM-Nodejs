const express = require('express');
const router = express.Router();
const todoModel = require('../model/schemaTodo');


/* GET users listing. */
router.get('/task', async function (req, res, next) {
  await todoModel
    .find({ isDeleted: false })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send({
        status: 400,
        message: err.message
      })
    })
});

/* GET Details users listing. */
router.get('/task/:id', async function (req, res, next) {
  const _id = req.params.id;
  await todoModel
    .find({ _id: _id })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send({
        status: 400,
        message: err.message
      })
    })
});



/* POST todo listing. */
router.post('/task', async function (req, res, next) {
  try {
    todoModel
      .create({
        title: req.body?.title,
        dueDate: req.body?.dueDate,
        description: req.body?.description,
        tags: req.body?.tags,
        assignee: JSON.parse(req.body?.assignee),
      })
      .then(data => {
        res.json(data)
      }).cath(err => {
        res.send({
          status: 400,
          message: err.message
        })
      });
  } catch (err) {
    console.log(err);
  }
  // const body = JSON.parse(req.body?.assignee);
  // console.log(body?.Name);
});

/* PUT todo listing. */
router.put('/task/:id', async function (req, res, next) {
  const _id = req.params.id;

  todoModel
    .findByIdAndUpdate({ _id: _id }, {
      title: req.body?.title,
      dueDate: req.body?.dueDate,
      description: req.body?.description,
      tags: req.body?.tags,
      assignee: JSON.parse(req.body?.assignee),
    })
    .then(data => {
      res.json(data)
    })
    .cath(err => {
      res.send({
        status: 400,
        message: err.message
      })
    });
});


/* Delete users listing. */
router.patch('/task/:id', async function (req, res, next) {
  const _id = req.params.id;
  await todoModel.updateOne({ _id: _id }, { isDeleted: true }, (err, data) => {
    res.send({
      status: 200,
      message: "Success"
    });
  });
});

module.exports = router;
