const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    dueDate: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    assignee: {
        type: Object,
        fullName: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
    },
    tags: [],
    isCompleted: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isImportant: {
        type: Boolean,
        default: false
    },
});



module.exports = mongoose.model('todos', schema);