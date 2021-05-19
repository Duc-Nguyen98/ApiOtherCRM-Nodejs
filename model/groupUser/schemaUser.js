const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idUser: {
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
    gender: {
        type: Number,
        default: 0
    },
    birthDay: {
        type: Date,
        default: ''
    },
    telephone: {
        type: String,
        default: ''
    },

    active: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    role: {
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

    },
    softDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('users', schema);
