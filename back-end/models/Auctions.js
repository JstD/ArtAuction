const mongoose = require('mongoose')

const AuctionsSchema = mongoose.Schema({
    auctionId: {
        type: Number,
        required: true,
    },
    seller: {
        type: String,
    },
    minBid:{
        type: Number,
    },
    tokenId:{
        type: Number
    },
    bidIncrement:{
        type: Number
    },
    start:{
        type: Number
    },
    end:{
        type: Number
    },
    highestBidder:{
        type: String
    },
    highestAmount:{
        type: Number
    },
    isCompleted:{
        type: Boolean
    }
})
module.exports = mongoose.model('auctions', AuctionsSchema);