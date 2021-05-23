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


// router.get('/voucherRelease', checkAuthentication, async function (req, res, next) {
//     try {

//         let filter = req.query.filter;
//         let totals = [];
//         let labels = [];
//         if (filter == 1) {
//             filter = 7;
//             for (let i = 0; i < filter; i++) {
//                 let labelsMonth = ['MON', 'TUE', 'WED ', 'THU', 'FRI', 'SAT', 'SUN'];
//                 var day = (moment().isoWeekday()) - i;
//                 let month = (moment().month());       // January
//                 let year = moment().year();
//                 let date = (moment().date()) - i;
//                 let startWeek = (moment([year, month, date - filter]).format("X")) * 1000;
//                 let currentWeek = (moment().clone().endOf('day').format("X")) * 1000;
//                 let startMonth = (moment([year, month, date]).format("X")) * 1000;
//                 let endMonth = (moment(startMonth).clone().endOf('day').format("X")) * 1000;
//                 if (startWeek <= currentWeek) {
//                     // console.log(startMonth, endMonth)
//                     let entry4 = await servicesModel.countDocuments({ softDelete: 0, "details.time": { $gte: startMonth, $lte: endMonth } }).then(data => {
//                         if (data.length < 1) {
//                             console.log(date)
//                             totals.push(0);
//                             labels.push(labelsMonth[day - 1]);
//                         } else {
//                             console.log(date)
//                             totals.push(data);
//                             labels.push(labelsMonth[day - 1]);
//                         }
//                     })
//                 }
//             }
//             return res.status(200).json({
//                 success: true,
//                 customersUsedService: {
//                     labels: labels.reverse(),
//                     datasets: [
//                         {
//                             data: totals.reverse()
//                         },
//                     ],
//                 }
//             });
//         } else {
//             filter = 12;
//             for (let i = 0; i < filter; i++) {
//                 let labelsMonth = ['JAN', 'FEB', 'MAR ', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//                 let month = i;       // January
//                 let year = moment().year();
//                 let startMonth = (moment([year, month]).format("X")) * 1000;
//                 let endMonth = (moment(startMonth).clone().endOf('month').format("X")) * 1000;
//                 if (startMonth <= startOfMonth) {
//                     let entry4 = await servicesModel.countDocuments({ softDelete: 0, "details.time": { $gte: startMonth, $lte: endMonth } }).then((data, index) => {
//                         if (data.length < 1) {
//                             totals.push(0);
//                             labels.push(labelsMonth[i]);
//                         } else {
//                             totals.push(data);
//                             labels.push(labelsMonth[i]);
//                         }
//                     })
//                 }
//             }

//             return res.status(200).json({
//                 success: true,
//                 customersUsedService: {
//                     labels: labels,
//                     datasets: [
//                         {
//                             data: totals
//                         },
//                     ],
//                 }
//             });
//         }
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     };
// });


module.exports = router;
