const express = require('express');
const router = express.Router();
const todoModel = require('../../model/schemaTodo');
var moment = require('moment'); // require
const checkAuthentication = require('../../utils/checkAuthentication');
const customerModel = require('../../model/customer/customer/schemaCustomer');
const servicesModel = require('../../model/schemaService');
const usersModel = require('../../model/groupUser/schemaUser');
const permissionModel = require('../../model/groupUser/schemaPermission');
const customersModel = require('../../model/customer/customer/schemaCustomer');
const groupVoucherItemsModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucherItems');
const groupVoucherModel = require('../../model/vouchers/groupVoucher/schemaGroupVoucher');

//! API View statistics


router.get('/customersUsedServices', checkAuthentication, async function (req, res, next) {
    try {
        let day = (moment().isoWeekday());
        let month = (moment().month());       // January
        let year = moment().year();
        let date = (moment().date());

        let dateTo = req.query.dateTo;
        let dateFrom = req.query.dateFrom;
        let rangesDate = moment(dateFrom).diff(moment(dateTo), 'day');
        (dateTo == null && dateFrom == null || dateTo == '' && dateFrom == '' || dateTo == undefined && dateFrom == undefined) ? rangesDate = 7 : rangesDate = rangesDate;

        let totalMoney = 0;
        let totals = [];
        let listDay = [];
        for (let i = 0; i <= rangesDate; i++) {
            let entry4 = await servicesModel.countDocuments({ softDelete: 0, statusSend: { $ne: 2 }, "details.time": { $gte: ((moment([year, month, date - i]).format("X")) * 1000), $lte: ((moment([year, month, date - i]).endOf('day').format("X")) * 1000) } })
                .then(data => {
                    let day = moment([year, month, date - i]).format("DD/MM");
                    if (data.length < 1) {
                        listDay.push(day)
                        totals.push(0);
                    } else {
                        listDay.push(day)
                        totals.push(data);
                    }
                })
        }


        return res.status(200).json({
            success: true,
            data: {
                customersUsedService: {
                    labels: listDay.reverse(),
                    datasets: [
                        {
                            data: totals.reverse()
                        },
                    ]

                }
            }
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/typeServices', checkAuthentication, async function (req, res, next) {
    try {

        const entry = await servicesModel.aggregate(
            [
                { $match: { softDelete: 0, statusSend: { $ne: 2 } } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: "$price" }
                    }
                },
            ]
        )
        return res.status(200).json({
            success: true,
            data: {
                typeServices: {
                    data: [
                        { value: entry[0].count, name: 'Voucher' },
                    ]

                }
            }

        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/messageServices', checkAuthentication, async function (req, res, next) {
    try {

        const entry = await servicesModel.aggregate(
            [
                { $match: { softDelete: 0, statusSend: { $ne: 2 } } },
                {
                    $group: {
                        _id: '$typeServices',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: 1 } },
            ]
        )
        return res.status(200).json({
            success: true,
            data: {
                messageServices: {
                    data: [
                        { value: entry[0].count, name: 'SMS' },
                        { value: entry[1].count, name: 'EMAIL' },
                        { value: entry[2].count, name: 'SMS & EMAIL' },
                    ]

                }
            }

        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/voucherRelease', checkAuthentication, async function (req, res, next) {
    try {
        let day = (moment().isoWeekday());
        let month = (moment().month());       // January
        let year = moment().year();
        let date = (moment().date());
        let dateTo = req.query.dateTo;
        let dateFrom = req.query.dateFrom;
        let rangesDate = moment(dateFrom).diff(moment(dateTo), 'day');
        (dateTo == null && dateFrom == null || dateTo == '' && dateFrom == '' || dateTo == undefined && dateFrom == undefined) ? rangesDate = 7 : rangesDate = rangesDate;

        let totals = [];
        let series = [];
        let listDay = []

        let entry3 = await servicesModel.aggregate(
            [
                { $match: { softDelete: 0 } },
                {
                    $group: {
                        _id: '$idGroupVoucher',
                    }
                },
                { $sort: { _id: 1 } },
            ]
        )

        let checkIdGroup = await groupVoucherModel.find({}).select({ title: 1, _id: 0 });

        for (let j = 0; j < entry3.length; j++) {
            series[j] = {
                name: checkIdGroup[j].title,
                data: [],
            };
            for (let i = 0; i <= rangesDate; i++) {
                let entry4 = await servicesModel.countDocuments({ idGroupVoucher: entry3[j]._id, softDelete: 0, statusSend: { $ne: 2 }, "details.time": { $gte: ((moment([year, month, date - i]).format("X")) * 1000), $lte: ((moment([year, month, date - i]).endOf('day').format("X")) * 1000) } })
                    .then(data => {
                        let day = moment([year, month, date - i]).format("DD/MM");
                        if (data.length < 1) {
                            series[j].data.push(0)
                            listDay.push(day)
                        } else {
                            series[j].data.push(data)
                            listDay.push(day)
                        }
                    })
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                voucherRelease: {
                    labels: listDay.reverse(),
                    series: series,

                }
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };

});

router.get('/serviceRevenue', checkAuthentication, async function (req, res, next) {
    try {
        let day = (moment().isoWeekday());
        let month = (moment().month());       // January
        let year = moment().year();
        let date = (moment().date());
        let rangesDate = 14;

        let days = [];
        let totals = [];
        let sum = 0;
        for (let i = 0; i <= rangesDate; i++) {

            let entry4 = await servicesModel.aggregate(
                [
                    { $match: { softDelete: 0, statusSend: { $ne: 2 }, "details.time": { $gte: ((moment([year, month, date - i]).format("X")) * 1000), $lte: ((moment([year, month, date - i]).endOf('day').format("X")) * 1000) } } },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: '$price' }
                        }
                    },
                ]
            ).then(data => {
                let day = moment([year, month, date - i]).format("DD/MM");

                if (data.length < 1) {
                    days.push(day)
                    totals.push(0);
                } else {
                    days.push(day)
                    totals.push(data[0].count)
                    sum += data[0].count;
                }
            })



        }
        return res.status(200).json({
            success: true,
            data: {
                serviceRevenue: {
                    labels: {
                        categories: days.reverse(),
                    },
                    totalRevenue: sum,
                    series: [
                        {
                            data: totals.reverse(),
                        },
                    ],

                }
            }
        });



    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/customersJoin', checkAuthentication, async function (req, res, next) {
    try {
        let day = (moment().isoWeekday());
        let month = (moment().month());       // January
        let year = moment().year();
        let date = (moment().date());

        let dateTo = req.query.dateTo;
        let dateFrom = req.query.dateFrom;
        let rangesDate = moment(dateFrom).diff(moment(dateTo), 'day');
        (dateTo == null && dateFrom == null || dateTo == '' && dateFrom == '' || dateTo == undefined && dateFrom == undefined) ? rangesDate = 11 : rangesDate = rangesDate;

        let totals = [];
        let labels = [];
        for (let i = 0; i <= rangesDate; i++) {

            let entry4 = await customersModel.countDocuments({ softDelete: 0, "created.time": { $gte: ((moment([year, month, date - i]).format("X")) * 1000), $lte: ((moment([year, month, date - i]).endOf('day').format("X")) * 1000) } })
                .then(data => {
                    let day = moment([year, month, date - i]).format("DD/MM");
                    if (data.length < 1) {
                        labels.push(day);
                        totals.push(0);
                    } else {
                        labels.push(day);
                        totals.push(data);
                    }
                })
        }
        return res.status(200).json({
            success: true,
            data: {
                customersJoin: {
                    labels: labels.reverse(),
                    datasets: [
                        {
                            data: totals.reverse()
                        },
                    ],
                }
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/customerClassification', checkAuthentication, async function (req, res, next) {
    try {

        const entry = await customersModel.aggregate(
            [
                { $match: { softDelete: 0 } },
                {
                    $group: {
                        _id: '$groups',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
            ]
        )
        return res.status(200).json({
            success: true,
            data: {
                customerClassification: {
                    data: [
                        { value: entry[0].count, name: 'Normal' },
                        { value: entry[1].count, name: 'Loyal' },
                        { value: entry[2].count, name: 'Potential' },
                    ]

                }
            }

        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/revenueCustomers', checkAuthentication, async function (req, res, next) {
    try {
        let q = req.query.q;
        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let arrRevenue = [];
        let arrRevenueNew = [];
        let totalRecord = 0;
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }
        const entry = await servicesModel.aggregate(
            [
                { $match: { softDelete: 0 } },
                {
                    $group: {
                        _id: '$idCustomer',
                        earned: { $sum: '$price' }
                    }
                },
                { $sort: { count: -1 } },
            ]
        ).then(data => {
            arrRevenue = data;
        })

        for (let i = 0; i < arrRevenue.length; i++) {
            let element2 = await customerModel.find({ idCustomer: arrRevenue[i]._id, name: keyword })
                .select({ idCustomer: 1, avatar: 1, name: 1, gender: 1, birthDay: 1, telephone: 1, email: 1, groups: 1, _id: 0 })
                .limit(pagination.totalItemsPerPage)
                .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);
            if (element2.length > 0) {
                arrRevenueNew.push({ idCustomer: arrRevenue[i]._id, avatar: element2[0].avatar, name: element2[0].name, gender: element2[0].gender, birthDay: element2[0].birthDay, telephone: element2[0].telephone, email: element2[0].email, groups: element2[0].groups, earned: arrRevenue[i].earned });
            }
            let element3 = await customerModel.countDocuments({ idCustomer: arrRevenue[i]._id, name: keyword }).then(data => {
                totalRecord += data;
            })
        }
        return res.status(200).json({
            success: true,
            totalRecords: totalRecord,
            data: arrRevenueNew
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/interactiveCustomers', checkAuthentication, async function (req, res, next) {
    try {
        let q = req.query.q;
        let keyword = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let arrRevenue = [];
        let arrRevenueNew = [];
        let totalRecord = 0;
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }
        const entry = await servicesModel.aggregate(
            [
                { $match: { softDelete: 0 } },
                {
                    $group: {
                        _id: '$idCustomer',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
            ]
        ).then(data => {
            arrRevenue = data;
        })

        for (let i = 0; i < arrRevenue.length; i++) {
            let element2 = await customerModel.find({ idCustomer: arrRevenue[i]._id, name: keyword })
                .select({ idCustomer: 1, avatar: 1, name: 1, gender: 1, birthDay: 1, telephone: 1, email: 1, groups: 1, _id: 0 })
                .limit(pagination.totalItemsPerPage)
                .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);

            if (element2.length > 0) {
                arrRevenueNew.push({ idCustomer: arrRevenue[i]._id, avatar: element2[0].avatar, name: element2[0].name, gender: element2[0].gender, birthDay: element2[0].birthDay, telephone: element2[0].telephone, email: element2[0].email, groups: element2[0].groups, interactive: arrRevenue[i].count });
            }
            let element3 = await customerModel.countDocuments({ idCustomer: arrRevenue[i]._id, name: keyword }).then(data => {
                totalRecord += data;
            })
        }

        return res.status(200).json({
            success: true,
            totalRecords: totalRecord,
            data: arrRevenueNew
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

module.exports = router;
