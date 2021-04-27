const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idVoucher: {
        type: Number,
        default: 0
    },
    voucherCode: {
        type: String,
        default: ''
    },
    idGroupVoucher: {
        type: Number,
        default: 0
    },

    idCustomersUse: {
        type: Number,
        default: 0
    },

    idLocationUse: {
        type: Number,
        default: 0
    },

    status: {
        type: Number,
        default: 0
    },
    usedDate: {
        type: String,
        default: ''
    },
    classified: {
        type: Number,
        default: 0
    },
    softDelete: {
        type: Number,
        default: 0
    },
    created: {
        type: Object,
        CreateBy: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: ''
        },
    },
    modified: {
        type: Object,
        modifiedBy: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: ''
        },

    }
});

module.exports = mongoose.model('group_voucher_items', schema);
