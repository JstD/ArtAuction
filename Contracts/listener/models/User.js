const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    publicAddress:{
        type: String,
        required: true,
    },
    nonce:{
        type: Number,
        default: () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
})
module.exports = mongoose.model('user', UserSchema);