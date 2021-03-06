const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idCustomer: {
        type: Number,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        default: 0
    },
    birthDay: {
        type: String,
        default: ''
    },
    telephone: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
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
    groups: {
        type: Number,
        default: 0
    },
    softDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('customers', schema);
