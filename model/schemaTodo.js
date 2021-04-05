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
    isCompleted: Boolean,
    isDeleted: Boolean,
    isImportant: Boolean
});



module.exports = mongoose.model('todos', schema);
