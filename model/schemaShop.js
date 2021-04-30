const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idShop: {
        type: Number,
        default: ''
    },
    avatar: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 0
    },
    ownerShop: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    note: {
        type: String,
        default: 'ANT-CVV Note Shop'
    },
    telephone: {
        type: String,
        default: null
    },
    telephoneShop: {
        type: String,
        default: null
    },
    fax: {
        type: String,
        default: null
    },
    mail: {
        type: String,
        default: null
    },
    region: {
        type: Number,
        default: 0
    },
    fanpage: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
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
