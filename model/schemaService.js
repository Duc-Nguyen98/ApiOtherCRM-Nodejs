const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idServices: {
        type: Number,
        default: ''
    },
    idCustomer: {
        type: Number,
        default: ''
    },
    idVoucher: {
        type: Number,
        default: ''
    },
    titleServices: {
        type: String,
        default: ''
    },
    listShop: {
        type: Array,
        default: []

    },

    nameCustomer: {
        type: String,
        default: ''
    },

    telephoneCustomer: {
        type: String,
        default: ''
    },
    mailCustomer: {
        type: String,
        default: ''
    },
    voucherCode: {
        type: String,
        default: ''
    },
    typeServices: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
    dateAutomaticallySent: {
        type: Number,
        default: 0
    },
    discount: {
        type: Object,
        PercentAMaximum: {
            type: Object,
            percent: {
                type: Number,
                default: 0
            }
            , maximumMoney: {
                type: Number,
                default: 0
            },
        },

    },
    timeLine: {
        type: Object,

    },
    details: {
        type: Object,
        createBy: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        }
    },
    statusSend: {
        type: Number,
        default: 0
    },
    softDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('services', schema);
