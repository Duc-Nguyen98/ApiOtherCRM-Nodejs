const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idShop: {
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
    status: {
        type: Number,
        default: 0
    },
    ownerShop: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: 'ANT-CVV Note Shop'
    },
    telephone: {
        type: String,
        default: 0
    },
    telephoneShop: {
        type: String,
        default: 0
    },
    fax: {
        type: Number,
        default: 0
    },
    mail: {
        type: String,
        default: ''
    },
    region: {
        type: Number,
        default: 0
    },
    fanpage: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
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

module.exports = mongoose.model('shops', schema);
