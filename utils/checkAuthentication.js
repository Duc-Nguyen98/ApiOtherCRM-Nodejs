//TODO Middleware checkAuthentication
const jwt = require('jsonwebtoken');

const jwtConfig = {
    secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
    refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
    expireTime: '7d',
    refreshTokenExpireTime: '10d',
}

const checkAuthentication = async (req, res, next) => {
    try {
        //?check login
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        // const token = req.cookies['access_token'];
        // console.log(req.cookies['access_token']);
        //?check again db
        if (token == null) return res.sendStatus(401)

        jwt.verify(token,  jwtConfig.secret, (err, user) => {
            console.log(err);
            if (err) return res.sendStatus(403);
            userObj = user;
            // console.log(new Date(userObj.iat))
            // console.log(new Date(userObj.exp))
            next();
        })
    } catch (err) {
        res.redirect('/');
    }
}

module.exports = checkAuthentication;