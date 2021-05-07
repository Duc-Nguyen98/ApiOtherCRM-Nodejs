const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail')
const servicesModel = require('../model/schemaService');
const customerModel = require('../model/customer/customer/schemaCustomer');
const groupCustomerModel = require('../model/customer/groupCustomer/schemaGroupCustomer');
const groupVoucherModel = require('../model/vouchers/groupVoucher/schemaGroupVoucher');
const voucherItemsModel = require('../model/vouchers/groupVoucher/schemaGroupVoucherItems');
const { parse } = require('node-xlsx');


//! FIlter 

const hasFilter = (param, param2, param3) => {
    if (param !== null) {
        return { type: parseInt(param), titleGroupVoucher: param2, softDelete: parseInt(param3) }
    } else {
        return { titleGroupVoucher: param2, softDelete: param3 }
    }
}

//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const idServicesAuto = async (req, res, next) => {
    await servicesModel.findOne({}, { idServices: 1, _id: 0 }).sort({ idServices: -1 })
        .then(data => {
            (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idServices + 1;
            next();
        })
        .catch(err => {
            console.log(err)
        })
}



const sendSms = (telephoneCustomer, content) => {
    let swapTelephone = telephoneCustomer.replace(/0/i, '+84');
    console.log(swapTelephone)
    const client = require('twilio')(
        "AC80ed1b888d269dc287173c2202ec9ace",
        "2a94e9d362710c2a2aa3a51654ff22d8"
    );
    client.messages.create({
        from: "+15708730303",
        to: swapTelephone,
        body: content
        // to: "+84393177289",
        // body: "You just sent an SMS from Node.js using Twilio!"
    }).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
    })
}

const sendMail = () => {
    const API_KEY = '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';
    sgMail.setApiKey(API_KEY);

    const message = {
        to: 'nguyendiemly99@gmail.com',
        from: 'ducnin1998@gmail.com',
        subject: 'Hello from sendgrid',
        text: 'Hello from sendgrid',
        html: '<h1>Anh Yêu EM !!!!!!!!!!!!!!/h1>'
    }

    sgMail.send(message)
        .then(response => console.log('Email sent...!'))
        .catch(error => console.log(error.message))
}


const checkIdCustomer = async (req, res, next) => {
    let idCustomer = req.body.idCustomer;
    // let idGroupVoucher = req.body.idGroupVoucher;
    // let classifiedVoucher = req.body.classifiedVoucher;
    const entry = await customerModel.findOne({ idCustomer: idCustomer })
        .select({ idCustomer: 1, telephone: 1, email: 1, name: 1 }).then(data => {
            dataCustomer = data;
            next();

        }).catch(err => {
            return err
        })
}

const checkIdGroupVoucher = async (req, res, next) => {
    let idGroupVoucher = req.body.idGroupVoucher;
    const entry = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher })
        .select({ idGroupVoucher: 1, title: 1, scopeApply: 1 }).then(data => {
            dataGroupVoucher = data;
            next();

        }).catch(err => {
            return err
        })
}


const checkVoucherItems = async (req, res, next) => {
    let idGroupVoucher = req.body.idGroupVoucher;
    let voucherCode = req.body.voucherCode;
    const entry = await voucherItemsModel.findOne({ idGroupVoucher: idGroupVoucher, voucherCode: voucherCode }).then(data => {
        infoVoucherCode = data;
        console.log(infoVoucherCode);
        next();
    }).catch(err => {
        return err
    })
}

// !SELECT DATA

router.get('/list/customer', async function (req, res, next) {
    try {
        const customers = await customerModel.find({ softDelete: 0 }).select({ "idCustomer": 1, "name": 1, "telephone": 1, "email": 1, "avatar": 1 });
        return res.status(200).json({
            success: true,
            customers: customers,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/list/group-customer', async function (req, res, next) {
    try {
        // {
        //     "idCustomer": [10002]
        // }
        let idCustomer = req.body.idCustomer
        const groupCustomer = await groupCustomerModel
            .find({ memberCustomer: { $in: idCustomer }, softDelete: 0 })
            .select({ "title": 1, "idGroupCustomer": 1 });
        return res.status(200).json({
            success: true,
            groupCustomer: groupCustomer,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});



router.get('/list/group-voucher', async function (req, res, next) {
    try {
        // {
        //     "idCustomer": [10002]
        // }
        let idCustomer = req.body.idCustomer
        const groupCustomer = await groupCustomerModel
            .find({ memberCustomer: { $in: idCustomer }, softDelete: 0 })
            .select({ "title": 1, "idGroupCustomer": 1 });
        return res.status(200).json({
            success: true,
            groupCustomer: groupCustomer,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});



/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/user/create
// ? Example: http://localhost:1509/user/create
router.post('/create', idServicesAuto, checkIdCustomer, checkIdGroupVoucher, checkVoucherItems, async function (req, res, next) {
    try {

        console.log(dataCustomer, dataGroupVoucher, infoVoucherCode)
        // sendSms("+84393177289", "You just sent an SMS from Node.js using Twilio!")
        let typeService = req.body.type;
        let contentService = req.body.content;

        // const serviceCreate = await servicesModel.create({
        //     idServices: AutoId,
        //     idCustomer: dataCustomer.idCustomer,
        //     idGroupVoucher: dataGroupVoucher.title,
        //     idVoucher: infoVoucherCode.idVoucher,
        //     titleGroupVoucher: dataGroupVoucher.titleGroupVoucher,
        //     type: typeService,
        //     scopeApply: dataGroupVoucher.scopeApply,
        //     telephone: dataCustomer.telephone,
        //     mailCustomer: dataCustomer.email,
        //     voucherCode: infoVoucherCode.voucherCode,
        //     content: contentService,
        //     discount: infoVoucherCode.discount,
        //     timeLine: infoVoucherCode.timeLine,
        //     details: {
        //         sendBy: "Admin",
        //         time: Date.now()
        //     }
        // })
        // const change


        return res.status(200).json({
            success: true,
            message: "Create Successfully"

        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});






router.get('/list', async function (req, res, next) {
    try {
        let type = req.query.type;
        let softDelete = 0;
        let q = req.query.q;
        (type == undefined || type == '') ? type = null : type = type;
        let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const services = await servicesModel
            .find(hasFilter(type, regex, softDelete))
            .sort({ idServices: -1 })
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


        const totalRecords = await servicesModel.countDocuments(hasFilter(type, regex, softDelete));
        Promise.all([services, totalRecords]).then(([services, totalRecords]) => {
            return res.status(200).json({
                success: true,
                totalRecords: totalRecords,
                services: services,
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
        let type = req.query.type;
        let softDelete = 1;
        let q = req.query.q;
        (type == undefined || type == '') ? type = null : type = type;
        let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const services = await servicesModel
            .find(hasFilter(type, regex, softDelete))
            .sort({ idServices: -1 })
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


        const totalRecords = await servicesModel.countDocuments(hasFilter(type, regex, softDelete));
        Promise.all([services, totalRecords]).then(([services, totalRecords]) => {
            return res.status(200).json({
                success: true,
                totalRecords: totalRecords,
                services: services,
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





/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/services/sms/detail/:id
// ? Example: http://localhost:1509/services/sms/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        await servicesModel
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


/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/services/sms/delete-soft/:id
router.delete('/delete-soft/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await servicesModel.updateOne({ _id: _id }, { softDelete: 1 });
        return res.status(200).json({
            success: true,
            message: "Delete-Soft Successfully"
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
// -u http://localhost:1509/services/sms/delete/:id
router.delete('/delete/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await servicesModel.findByIdAndDelete({ _id: _id });
        return res.status(200).json({
            success: true,
            message: "Delete Successfully"
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
// -u http://localhost:1509/services/sms/trash/restore/:id

router.patch('/trash/restore/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;

        const entry = await servicesModel.findOneAndUpdate({ _id: _id }, {
            softDelete: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Restore Successfully"
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

router.patch('/delete-soft/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.updateMany({ _id: { $in: obj } }, {
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


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/trash/restore/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.updateMany({ _id: { $in: obj } }, {
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



/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/delete/many/voucher

router.patch('/trash/delete/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.deleteMany({ _id: { $in: obj } }, (err, result) => {
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





//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
