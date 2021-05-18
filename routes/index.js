var express = require('express');
var router = express.Router();
const fs = require('fs');
const userModel = require('../model/groupUser/schemaUser');
const roleModel = require('../model/groupUser/schemaPermission');
const sgMail = require('@sendgrid/mail')
const jwt = require("jsonwebtoken");
const { ConversationsGrant } = require('twilio/lib/jwt/AccessToken');
const pathMail = `${__dirname}/../views/template/`;

//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const checkUserLogin = async (req, res, next) => {
  await userModel.findOne({
    email: req.body.email,
    password: req.body.password,
    softDelete: 0
  }).then(data => {
    if (data !== null && data.active == 1) {
      informationUser = data;
      next();
    }
    else if (data !== null && data.active == 0) {
      return res.status(200).json({
        success: false,
        message: "👋 Login Fail, This account has been stop activity!",
      });
    }
    else {
      return res.status(200).json({
        success: false,
        message: "👋 Login Fail, Please check again Account & Password!",
      });
    }
  })
    .catch(err => {
      console.log(err)
    })
}

const checkRoleUserLogin = async (req, res, next) => {
  await roleModel.findOne({ idUser: informationUser.idUser }).select({ _id: 0 })
    .then(data => {
      // console.log(data)
      permissions = data;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}

//! Config Mail 
async function sendMail(userMail, content) {
  const API_KEY = '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';
  sgMail.setApiKey(API_KEY);

  const message = {
    to: userMail,
    from: 'ducnin1998@gmail.com',
    subject: 'ANT-CVV Quên Mật Khẩu Đăng Nhập ',
    html: content
  }

  sgMail.send(message)
    .then(response => console.log('Email sent...!'))
    .catch(error => console.log(error.message))

  deleteFile();
}
//! Config File

function deleteFile() {
  fs.unlinkSync(`${pathMail}/templateVirtual.html`, function (err) {
    if (err) throw err;
    console.log('File deleted!');
  });
}

function readFMain(name, email, password) {
  fs.readFile(`${pathMail}/forgotPassword.html`, function read(err, data) {
    if (err) {
      return err;
    } else {
      let content = Buffer.from(data);
      fs.writeFile(`${pathMail}/templateVirtual.html`, content, function (err) {
        if (err) {
          console.log(err)
        } else {
          processFile(name, email, password)
        }
      })
    }
  });
}

function processFile(name, email, password) {
  fs.readFile(`${pathMail}/templateVirtual.html`, 'utf-8', function (err, data) {
    if (err) throw err;
    data = data.replace(/userName/g, name);
    data = data.replace(/userMail/g, email);
    data = data.replace(/userPassword/g, password);
    fs.writeFile(`${pathMail}/templateVirtual.html`, data, 'utf-8', function (err, data) {
      if (err) {
        return err;
      } else {
        fs.readFile(`${pathMail}/templateVirtual.html`, function read(err, data) {
          if (err) {
            return err;
          } else {
            let content = Buffer.from(data);
            content = content.toString();
            sendMail(email, content);
          }
        })
      }
    })
  })
}

/* 
!POST login
  -u localhost:xxxx/
*/
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
  expireTime: '7d',
  refreshTokenExpireTime: '10d',
}
const tokenList = {};
router.post('/login', checkUserLogin, checkRoleUserLogin, async function (req, res, next) {
  try {
    let data = informationUser;
    const token = jwt.sign({
      _id: data._id,
      idUser: data.idUser,
      name: data.name,
    }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime });

    const refreshToken = jwt.sign({
      _id: data._id,
      idUser: data.idUser,
      name: data.name,
    }, jwtConfig.refreshTokenSecret, {
      expiresIn: jwtConfig.refreshTokenExpireTime,
    });
    tokenList[refreshToken] = data;

    const userData = { ...data._doc, role: permissions.name, ability: permissions.ability, modules: permissions.modules };

    delete userData.password;

    return res.status(200).json({
      success: true,
      userData: userData,
      message: "👋 Login Successfully!",
      accessToken: token,
      refreshToken: refreshToken,
    });


  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/**
 * Lấy mã token mới sử dụng Refresh token
 * POST /refresh_token
 */
router.post('/refresh_token', async (req, res) => {
  // User gửi mã Refresh token kèm theo trong body
  const { refreshToken } = req.body;
  // Kiểm tra Refresh token có được gửi kèm và mã này có tồn tại trên hệ thống hay không
  if ((refreshToken) && (refreshToken in tokenList)) {
    try {
      // Kiểm tra mã Refresh token
      await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);
      // Lấy lại thông tin user
      const user = tokenList[refreshToken];
      // Tạo mới mã token và trả lại cho user
      const token = jwt.sign(user, config.secret, {
        expiresIn: config.tokenLife,
      });
      const response = {
        token,
      }
      res.status(200).json(response);
    } catch (err) {
      console.error(err);
      res.status(403).json({
        message: 'Invalid refresh token',
      });
    }
  } else {
    res.status(400).json({
      message: 'Invalid request',
    });
  }
});
/* 
!GET logout
  -u localhost:xxxx/student/logout
*/


router.post('/forgot-password', async (req, res, next) => {
  try {
    await userModel.findOne({ email: req.body.gmailForgot }
    ).then(data => {
      if (data) {
        readFMain(data.name, data.email, data.password)
        return res.status(200).json({
          success: true,
          message: `👋 Hey ${data.name}, please check your email inbox.Thank You!`
        });
      } else {
        return res.status(200).json({
          success: false,
          message: '👋 Information you entered, is not in the system!'
        });
      }
    }).catch(err => {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    })
    deleteFile()
  }
  catch (err) {
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
