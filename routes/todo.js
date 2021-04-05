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
