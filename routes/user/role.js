const express = require('express');
const router = express.Router();
const roleModel = require('../../model/groupUser/schemaRole');
const fs = require('fs');
const checkAuthentication = require('../../utils/checkAuthentication');


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

// TODO: METHOD - GET
// -u http://localhost:1509/todo/task?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/user/list?group=&gender=&q=&sort=title-desc&page=1&perPage=10
router.get('/list', checkAuthentication, async function (req, res, next) {

    try {
        await roleModel.find().then(data => {
            return res.status(200).json({
                success: true,
                listRole: data
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});


// * GET Details users listing. 
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;
        await roleModel
            .findOne({ _id: _id })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
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


/* POST todo listing create a record. */
// TODO: METHOD - POST
// -u http://localhost:1509/shop/create
router.post('/create', checkAuthentication, async function (req, res, next) {
    try {
        const entry = await roleModel.create({
            modules: req.body?.modules,
            ability: req.body?.ability,
        })
        return res.status(200).json({
            success: true,
            message: "Created Successfully",
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

/* PUT todo listing. update an record */
// TODO: METHOD - PUT
// -u http://localhost:1509/todo/update/:id
router.put('/update/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await roleModel
            .findByIdAndUpdate({ _id: _id }, {
                modules: req.body?.modules,
                ability: req.body?.ability,
            })
        return res.status(200).json({
            success: true,
            message: "Updated Successfully"
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
router.delete('/delete/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await roleModel.findOneAndDelete({ _id: _id });
        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
