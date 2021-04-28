const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idGroupVoucher: {
        type: Number,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    classified: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ''
    },
    discount: {
        type: Object,
        percent: {
            type: Number,
            default: 0
        },
        maximumMoney: {
            type: Number,
            default: 0
        },
        reductionMoney: {
            type: Number,
            default: 0
        }
    },
    timeLine: {
        type: Object,
        effective: {
            type: Object,
            release: {
                type: Date,
                default: 0
            },
            expiration: {
                type: Date,
                default: 0
            }
        },
        expiry: {
            type: Object,
            number: {
                type: Number,
                default: 0
            },
            type: {
                type: Number,
                default: 0
            }
        },

    },
    scopeApply: {
        type: Object,
        location: {
            type: Object,
            all: {
                type: Number,
                default: 0
            },
            listLocation: {
                type: Array,
                default: []
            }
        },
        expiry: {
            type: Object,
            number: {
                type: Number,
                default: 0
            },
            listGroupCustomer: {
                type: Array,
                default: []
            }
        },

    },
    memberGroup: {
        type: Array,
        default: []
    },
    softDelete: {
        type: Number,
        default: 0
    },
    created: {
        type: Object,
        createBy: {
            type: String,
            default: 'admin'
        },
        time: {
            modifyBy: Number,
            default: 0
        },
    },
    modified: {
        type: Object,
        modifyBy: {
            type: String,
            default: 'admin'
        },
        time: {
            type: Number,
            default: 0
        },
    }
});

module.exports = mongoose.model('group_vouchers', schema);
