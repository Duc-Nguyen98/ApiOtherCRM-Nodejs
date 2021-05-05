const express = require('express');
const router = express.Router();
const shopModel = require('../model/schemaShop');
const multer = require('multer');
const fs = require('fs');


const handleFilterSearch = (param, param2, param3, param4) => {
    if (param !== '' && param2 !== '') {
        return { status: parseInt(param), region: parseInt(param2), name: param3, softDelete: param4 }
    } else if (param !== '' && param2 == '') {
        return { status: parseInt(param), name: param3, softDelete: param4 }
    } else if (param == '' && param2 !== '') {
        return { region: parseInt(param2), name: param3, softDelete: param4 }
    } else if (param != '') {
        return { name: param3, softDelete: param4 }
    } else {
        return { softDelete: param4 }
    }
    return
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

// TODO: MIDDLEWARE
const idShopAuto = async (req, res, next) => {
    await shopModel.findOne({}, { idShop: 1, _id: 0 }).sort({ idShop: -1 })
        .then(data => {
            AutoId = data.idShop + 1;
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
router.get('/list', async function (req, res, next) {

    try {
        let status = req.query.status;
        let region = req.query.region;
        let softDelete = 0;
        (status == undefined) ? status = '' : status = status;
        (region == undefined) ? region = '' : region = region;

        let q = req.query.q;

        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const taskOne = await shopModel
            .find(handleFilterSearch(status, region, keyword, softDelete))
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

        const taskTwo = await shopModel.countDocuments(handleFilterSearch(status, region, keyword, softDelete));

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


// * GET Details users listing. 
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        await shopModel
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


/* POST todo listing create a record. */
// TODO: METHOD - POST
// -u http://localhost:1509/shop/create
router.post('/create', idShopAuto, async function (req, res, next) {
    try {
        const entry = await shopModel.create({
            idShop: AutoId,
            avatar: req.body?.avatar,
            name: req.body?.name,
            status: req.body?.status,
            ownerShop: req.body?.ownerShop,
            address: req.body?.address,
            note: req.body?.note,
            telephone: req.body?.telephone,
            telephoneShop: req.body?.telephoneShop,
            fax: req.body?.fax,
            mail: req.body?.mail,
            region: req.body?.region,
            fanpage: req.body?.fanpage,
            website: req.body?.website,


            created: {
                createBy: "Admin",
                time: Date.now()
            },
            modified: {
                createBy: "Admin",
                time: Date.now()
            },
            softDelete: 0
        })
        return res.status(200).json({
            success: true,
            message: "Created Successfully"
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
router.put('/update/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await shopModel
            .findByIdAndUpdate({ _id: _id }, {
                avatar: req.body?.avatar,
                name: req.body?.name,
                status: req.body?.status,
                ownerShop: req.body?.ownerShop,
                address: req.body?.address,
                note: req.body?.note,
                telephone: req.body?.telephone,
                telephoneShop: req.body?.telephoneShop,
                fax: req.body?.fax,
                mail: req.body?.mail,
                region: req.body?.region,
                fanpage: req.body?.fanpage,
                website: req.body?.website,
                modified: {
                    createBy: "Admin",
                    time: Date.now()
                },
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



/* PUT upload Avatar for Customer. */
// TODO: METHOD - PUT
// -u http://localhost:1509/customer/upload/:id

router.post('/upload/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;

        const storage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, './public/upload/shops');
            },
            filename: (req, file, callback) => {
                callback(null, Date.now() + '-' + file.originalname);
            }
        });

        const upload = multer({ storage: storage }).any('file');

        upload(req, res, (err) => {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            }

            let results = req.files.map(async (file) => {
                const user = await shopModel.findOne({ _id: _id });
                var filePath = user.avatar;

                if (filePath) {
                    if (fs.existsSync('./public/' + filePath)) {
                        fs.unlinkSync('./public/' + filePath);
                    }
                }

                const entry = await shopModel.findByIdAndUpdate({ _id: _id }, {
                    avatar: `upload/shops/${file.filename}`,
                    modified: {
                        createBy: "Admin",
                        time: Date.now()
                    }
                });

                return res.status(200).json({
                    success: true,
                    data: `upload/shops/${file.filename}`
                });
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
router.delete('/delete-soft/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await shopModel.findOneAndUpdate({ _id: _id }, { softDelete: 1 });
        return res.status(200).json({
            success: true,
            message: "Deleted Successfully",
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
router.delete('/delete/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await shopModel.findOneAndDelete({ _id: _id });
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

router.patch('/delete/many/shop', async function (req, res, next) {
    try {
        let obj = req.body.shopIdArray;
        const entry = await shopModel.deleteMany({ _id: { $in: obj } }, (err, result) => {
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



router.get('/list/trash', async function (req, res, next) {
    try {
        let group = req.query.group;
        let gender = req.query.gender;
        let softDelete = 1;
        (group == undefined) ? group = '' : group = group;
        (gender == undefined) ? gender = '' : gender = gender;

        let q = req.query.q;

        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const taskOne = await shopModel
            .find(handleFilterSearch(group, gender, keyword, softDelete))
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

        const taskTwo = await shopModel.countDocuments(handleFilterSearch(group, gender, keyword, softDelete));

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


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/customer/trash/restore/:id

router.patch('/trash/restore/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;

        const entry = await shopModel.findOneAndUpdate({ _id: _id }, {
            softDelete: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Recovery Successful"
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

router.patch('/delete-soft/many/shop', async function (req, res, next) {
    try {
        let obj = req.body.shopIdArray;
        const entry = await groupVoucherModel.updateMany({ _id: { $in: obj } }, {
            softDelete: 1
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Delete Soft Successfully"
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

router.patch('/restore/many/shop', async function (req, res, next) {
    try {
        let obj = req.body.shopIdArray;
        const entry = await groupVoucherModel.updateMany({ _id: { $in: obj } }, {
            softDelete: 0
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Restore Successfully"
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
