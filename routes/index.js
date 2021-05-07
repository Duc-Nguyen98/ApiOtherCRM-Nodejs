var express = require('express');
var router = express.Router();
const userModel = require('../model/schemaUser');



/* 
!POST login
  -u localhost:xxxx/
*/
router.post('/login', async function (req, res, next) {
  try {
    await userModel.findOne({
      // account: req.body.account,
      // password: req.body.password,
      account: req.body.account,
      password: req.body.password,
      active: 0
    })
      .then(data => {
        if (data) {
          let token = jwt.sign({
            _id: data._id
          }, 'mk');
          res.cookie('token', token);
          return res.status(200).json({
            success: true,
            message: "Login Successfully!",
            token: token
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Login Fail!",
          });
        }

      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: 'Server Error'
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

/* 
!GET logout
  -u localhost:xxxx/student/logout
*/
router.post('/logout', (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: "LogOut Successfully!",
    });
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


module.exports = router;
