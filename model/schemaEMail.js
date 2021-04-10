const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({

    from: {
        type: Object,
        email: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
    },
    to: {
        type: Array,
        default: []
    },
    subject: {
        type: String,
        default: ''
    },
    cc: {
        type: Array,
        default: []
    },
    bcc: {
        type: Array,
        default: []
    },
    message: {
        type: String,
        default: ''
    },
    attachments: {
        type: Array,
        default: []
    },

    labels: {
        type: Array,
        default: []
    },

    isStarred: {
        type: Boolean,
        default: false
    },

    isRead: {
        type: Boolean,
        default: true
    },

    time: {
        type: String,
        default: ''
    },
    replies: {
        type: Array,
        default: []
    },
    folder: {
        type: String,
        default: ''
    },
    _idArray: {
        type: Array,
        default: []
    },
});



module.exports = mongoose.model('emails', schema);
