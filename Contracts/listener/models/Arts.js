const mongoose = require('mongoose')

const ArtSchema = mongoose.Schema({
    tokenId: {
        type: Number,
        required: true,
    },
    CID:{
        type: String,
        required: true,
    },
    owner:{
        type: String
    }
})
module.exports = mongoose.model('arts', ArtSchema);