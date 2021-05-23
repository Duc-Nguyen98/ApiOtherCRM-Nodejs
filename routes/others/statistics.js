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

const thisMoment = moment();
const endOfWeek = (moment().clone().endOf('week').format("X")) * 1000;
const startOfWeek = (moment().clone().startOf('week').format("X")) * 1000;
const endOfMonth = (moment().clone().endOf('month').format("X")) * 1000;
const startOfMonth = (moment().clone().startOf('month').format("X")) * 1000;
const endOfYear = (moment().clone().endOf('year').format("X")) * 1000;
const startOfYear = (moment().clone().startOf('year').format("X")) * 1000;

//! API View statistics

router.get('/customersUsedServices', checkAuthentication, async function (req, res, next) {
    try {
        let filter = req.query.filter;
        let totals = [];
        let labels = [];
        if (filter == 1) {
            filter = 7;
            for (let i = 0; i < filter; i++) {
                let labelsMonth = ['MON', 'TUE', 'WED ', 'THU', 'FRI', 'SAT', 'SUN'];
                var day = (moment().isoWeekday()) - i;
                let month = (moment().month());       // January
                let year = moment().year();
                let date = (moment().date()) - i;
                let startWeek = (moment([year, month, date - filter]).format("X")) * 1000;
                let currentWeek = (moment().clone().endOf('day').format("X")) * 1000;
                let startMonth = (moment([year, month, date]).format("X")) * 1000;
                let endMonth = (moment(startMonth).clone().endOf('day').format("X")) * 1000;
                if (startWeek <= currentWeek) {
                    // console.log(startMonth, endMonth)
                    let entry4 = await servicesModel.countDocuments({ softDelete: 0, "details.time": { $gte: startMonth, $lte: endMonth } }).then(data => {
                        if (data.length < 1) {
                            totals.push(0);
                            labels.push(labelsMonth[day - 1]);
                        } else {
                            totals.push(data);
                            labels.push(labelsMonth[day - 1]);
                        }
                    })
                }
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
        } else {
            filter = 12;
            for (let i = 0; i < filter; i++) {
                let labelsMonth = ['JAN', 'FEB', 'MAR ', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                let month = i;       // January
                let year = moment().year();
                let startMonth = (moment([year, month]).format("X")) * 1000;
                let endMonth = (moment(startMonth).clone().endOf('month').format("X")) * 1000;
                if (startMonth <= startOfMonth) {
                    let entry4 = await servicesModel.countDocuments({ softDelete: 0, "details.time": { $gte: startMonth, $lte: endMonth } }).then((data, index) => {
                        if (data.length < 1) {
                            totals.push(0);
                            labels.push(labelsMonth[i]);
                        } else {
                            totals.push(data);
                            labels.push(labelsMonth[i]);
                        }
                    })
                }
            }

            return res.status(200).json({
                success: true,
                customersUsedService: {
                    labels: labels,
                    datasets: [
                        {
                            data: totals
                        },
                    ],
                }
            });
        }

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


module.exports = router;
