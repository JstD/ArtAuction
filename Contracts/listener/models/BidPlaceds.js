const mongoose = require('mongoose')

const BidPlaced = mongoose.Schema({
    auctionId: {
        type: Number,
    },
    bidder:{
        type: String,
    }
})
module.exports = mongoose.model('bidplaceds', BidPlaced);