const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idServices: {
        type: Number,
        default: ''
    },
    idCustomer: {
        type: String,
        default: ''
    },
    idGroupVoucher: {
        type: Number,
        default: ''
    },
    idVoucher: {
        type: String,
        default: ''
    },
    titleGroupVoucher: {
        type: Number,
        default: 0
    },
    nameCustomer: {
        type: String,
        default: ''
    },
    mailCustomer: {
        type: String,
        default: ''
    },
    telephone: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
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
        release: {
            type: String,
            default: ''
        },
        expiration: {
            type: String,
            default: ''
        }
    },
    details: {
        type: Object,
        sendBy: {
            type: String,
            default: ''
        },
        dateSent: {
            type: String,
            default: ''
        }
    },
    created: {
        createBy: {
            type: String,
            default: 'admin'
        },
        time: {
            type: Date,
            default: ''
        }
    },
    softDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('services', schema);
