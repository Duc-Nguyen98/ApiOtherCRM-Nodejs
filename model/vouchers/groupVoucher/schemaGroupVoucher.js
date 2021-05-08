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

    status: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ''
    },
    listShop: {
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
