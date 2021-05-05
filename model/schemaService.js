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
    idGroupVoucher: {
        type: Number,
        default: ''
    },
    idVoucher: {
        type: Number,
        default: ''
    },
    titleGroupVoucher: {
        type: String,
        default: ''
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
    scopeApply: {
        shop: {
            all: {
                type: Number,
                default: 0
            },
            listShop: {
                type: Array,
                default: []
            }
        },
        customer: {
            all: {
                type: Number,
                default: 0
            },
            listCustomer: {
                type: Array,
                default: []
            }
        }
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
        time: {
            type: String,
            default: ''
        }
    },
    softDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('services', schema);
