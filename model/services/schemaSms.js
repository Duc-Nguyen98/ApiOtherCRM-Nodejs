const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idServices: {
        type: Number,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    type: {
        type: Number,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
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
    details: {
        type: Object,
        createBy: {
            type: String,
            default: ''
        },
        dateSent: {
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
