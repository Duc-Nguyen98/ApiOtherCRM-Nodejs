const express = require('express');
const router = express.Router();
const groupCustomerModel = require('../../model/customer/groupCustomer/schemaGroupCustomer');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const checkAuthentication = require('../../utils/checkAuthentication');

const fs = require('fs');


const handleFilterSearch = (param, param2, param3, param4) => {
    if (param !== '' && param2 !== '') {
        return { status: parseInt(param), star: parseInt(param2), title: param3, softDelete: param4 }
    } else if (param !== '' && param2 == '') {
        return { status: parseInt(param), title: param3, softDelete: param4 }
    } else if (param == '' && param2 !== '') {
        return { star: parseInt(param2), title: param3, softDelete: param4 }
    } else {
        return { title: param3, softDelete: param4 }
    }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

// TODO: MIDDLEWARE
const idGroupCustomerAuto = async (req, res, next) => {
    await groupCustomerModel.findOne({}, { idGroupCustomer: 1, _id: 0 }).sort({ idGroupCustomer: -1 })
        .then(data => {
            (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idGroupCustomer + 1;
            next();
        })
        .catch(err => {
            console.log(err)
        })
}
/* GET todo listing view MyTask */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/task?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/user/list?group=&gender=&q=&sort=title-desc&page=1&perPage=10
router.get('/list', checkAuthentication, async function (req, res, next) {

    try {
        let status = req.query.status;
        let star = req.query.star;
        let softDelete = 0;
        (status == undefined || status == '') ? status = '' : status = status;
        (star == undefined || star == '') ? star = '' : star = star;

        let q = req.query.q;
        console.log(status, star)

        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const taskOne = await groupCustomerModel
            .find(handleFilterSearch(status, star, keyword, softDelete))
            .sort({ idGroupCustomer: -1 })
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

        const taskTwo = await groupCustomerModel.countDocuments(handleFilterSearch(status, star, keyword, softDelete));

        Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
            return res.status(200).json({
                success: true,
                totalRecords: dataTwo,
                data: dataOne,
            });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});
/* GET todo listing view MyTask */
// TODO: METHOD - GET
// -u http://localhost:1509/todo/task?query(filter=)&query(q=)&query(sort=)
// ? Example : http://localhost:1509/user/list?group=&gender=&q=&sort=title-desc&page=1&perPage=10
router.get('/list/trash', checkAuthentication, async function (req, res, next) {

    try {
        let status = req.query.status;
        let star = req.query.star;
        let softDelete = 1;
        (status == undefined || status == '') ? status = '' : status = status;
        (star == undefined || star == '') ? star = '' : star = star;

        let q = req.query.q;
        console.log(status, star)

        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const taskOne = await groupCustomerModel
            .find(handleFilterSearch(status, star, keyword, softDelete))
            .sort({ idGroupCustomer: -1 })
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

        const taskTwo = await groupCustomerModel.countDocuments(handleFilterSearch(status, star, keyword, softDelete));

        Promise.all([taskOne, taskTwo]).then(([dataOne, dataTwo]) => {
            return res.status(200).json({
                success: true,
                totalRecords: dataTwo,
                data: dataOne,
            });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});


router.get('/list/customer', checkAuthentication, async function (req, res, next) {
    try {
        const listCustomer = await customerModel.find({ softDelete: 0 }).select({ "avatar": 1, "idCustomer": 1, "name": 1, "_id": 1 })
        return res.status(200).json({
            success: true,
            listCustomer: listCustomer,
        });
    } catch (err) {
        console.log(err)
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
        await groupCustomerModel
            .findOne({ _id: _id })
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

/* DELETE todo listing deleteSoft Customer */
// TODO: METHOD - DELETE SOFT
// -u http://localhost:1509/customer/delete-soft/:id
router.patch('/delete-soft/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await groupCustomerModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
        return res.status(200).json({
            success: true,
            message: "Deleted Soft Successfully"
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
        const entry = await groupCustomerModel.findOneAndDelete({ _id: _id });
        return res.status(200).json({
            success: true,
            message: "Deleted Soft Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/trash/restore/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;

        const entry = await groupCustomerModel.findOneAndUpdate({ _id: _id }, {
            softDelete: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Restored Successfully"
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
// -u http://localhost:1509/todo/update/:id
router.put('/update/:id', checkAuthentication, async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await groupCustomerModel
            .findByIdAndUpdate({ _id: _id }, {
                title: req.body?.title,
                memberCustomer: req.body?.memberCustomer,
                status: req.body?.status,
                note: req.body?.note,
                modified: {
                    createBy: `US${userObj.idUser}-${userObj.name}`,
                    time: Date.now()
                },
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

/* POST todo listing create a record. */
// TODO: METHOD - POST
// -u http://localhost:1509/customer/create
router.post('/create', checkAuthentication, idGroupCustomerAuto, async function (req, res, next) {
    try {
        const entry = await groupCustomerModel.create({
            idGroupCustomer: AutoId,
            title: req.body?.title,
            status: req.body?.status,
            note: req.body?.note,
            star: req.body?.star,
            created: {
                createBy: `US${userObj.idUser}-${userObj.name}`,
                time: Date.now()
            },
            modified: {
                createBy: `US${userObj.idUser} - ${userObj.name}`,
                time: Date.now()
            },
            softDelete: 0
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



/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/change-star/many/group', checkAuthentication, async function (req, res, next) {
    try {
        let obj = req.body.GroupCustomerIdArray;
        let statusStar = req.body.statusStar
        console.log(statusStar)
        const entry = await groupCustomerModel.updateMany({ _id: { $in: obj } }, {
            star: statusStar
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Changed Star Successfully"
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

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete/many/group', checkAuthentication, async function (req, res, next) {
    try {
        let obj = req.body.GroupCustomerIdArray;
        const entry = await groupCustomerModel.deleteMany({ idGroupCustomer: { $in: obj } }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Deleted Successfully"
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

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/restore/many/group', checkAuthentication, async function (req, res, next) {
    try {
        let obj = req.body.GroupCustomerIdArray;
        const entry = await groupCustomerModel.updateMany({ idGroupCustomer: { $in: obj } }, {
            softDelete: 0
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Delete-Soft Successfully"
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


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete-soft/many/group', checkAuthentication, async function (req, res, next) {
    try {
        let obj = req.body.GroupCustomerIdArray;
        const entry = await groupCustomerModel.updateMany({ idGroupCustomer: { $in: obj } }, {
            softDelete: 1
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Delete-Soft Successfully"
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


//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
