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
    nameGroupVoucher: {
        type: String,
        default: ''
    },
    idCustomersUse: {
        type: Number,
        default: 0
    },
    nameCustomerUser: {
        type: String,
        default: ''
    },
    idLocationUse: {
        type: Number,
        default: 0
    },
    nameLocationUse: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
    },
    usedDate: {
        type: Date,
        default: 0
    },
    classified: {
        type: Number,
        default: 0
    },
    softDelete: {
        type: Number,
        default: 0
    },



});

module.exports = mongoose.model('group_voucher_items', schema);
