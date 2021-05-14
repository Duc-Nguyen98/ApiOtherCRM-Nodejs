const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idUser: {
        type: Number,
        default: ''
    },
    nameRole: {
        type: Number,
        default: ''
    },
    permissions: {
        type: Array,
        default: []
    }

});

module.exports = mongoose.model('roles', schema);
