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

        let totals = [];
        let labels = [];
        let labelsDay = ['MON', 'TUE', 'WED ', 'THU', 'FRI', 'SAT', 'SUN'];
        for (let i = 0; i <= rangesDate; i++) {

            let entry4 = await servicesModel.countDocuments({ softDelete: 0, "details.time": { $gte: ((moment([year, month, date - i]).format("X")) * 1000), $lte: ((moment([year, month, date - i]).endOf('day').format("X")) * 1000) } })
                .then(data => {
                    let day = moment([year, month, date - i]).format("YYYY-MM-DD");
                    day = moment(day).isoWeekday();
                    if (data.length < 1) {
                        labels.push(labelsDay[day - 1]);
                        totals.push(0);
                    } else {
                        labels.push(labelsDay[day - 1]);
                        totals.push(data);
                    }
                })
        }
        return res.status(200).json({
            success: true,
            customersUsedService: {
                labels: labels.reverse(),
                datasets: [
                    {
                        data: totals.reverse()
                    },
                ],
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
                { $match: { softDelete: 0 } },
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
            typeServices: {
                data: [
                    { value: entry[0].count, name: 'Voucher' },
                ]

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
            typeServices: {
                data: [
                    { value: entry[0].count, name: 'SMS' },
                    { value: entry[1].count, name: 'EMAIL' },
                    { value: entry[2].count, name: 'SMS & EMAIL' },
                ]

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
            voucherRelease: {
                series: series,
                xaxis: {
                    categories: listDay.reverse()
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


module.exports = router;
