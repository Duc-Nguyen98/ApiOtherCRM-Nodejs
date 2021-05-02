const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idGroupCustomer: {
        type: Number,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    memberCustomer: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: 'ANT-CVV Note Shop'
    },
    star: {
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
        }
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
        }
    },


});

module.exports = mongoose.model('group_customers', schema);
