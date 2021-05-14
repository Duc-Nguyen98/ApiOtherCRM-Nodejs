const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const schema = new mongoose.Schema({
    idUser: {
        type: Number,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    modules: {
        type: Array,
        default: []
    },
    ability: {
        type: Array,
        default: []
    }

});

module.exports = mongoose.model('permissions', schema);
