//TODO Middleware checkAuthentication

const userModel = require('../model/schemaUser')

const checkAuthentication = async (req, res, next) => {
    try {
        //?check login
        let token = req.cookies.token;
        //?check again db
        let idUser = jwt.verify(token, 'mk');
        await userModel
            .findOne({
                _id: idUser._id
            }).select({ idUser: 1, avatar: 1, name: 1, role: 1 })
            .then(data => {
                if (data) {
                    userObj = data;
                    next();
                }
            })
    } catch (err) {
        res.redirect('/');
    }
}

module.exports = checkAuthentication;