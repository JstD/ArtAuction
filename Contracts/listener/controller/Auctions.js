const Auction = require('../models/Auctions');
const BidPlaced = require('../models/BidPlaceds')
async function createAuction(auctionId,  tokenId,minBid, 
                            bidIncrement, start, period, 
                            highestBidder, highestAmount)
{
    let end = start + period;
    let auction = await Auction.findOne({auctionId});
    if(!auction){
        auction = new Auction({auctionId,tokenId,minBid,bidIncrement,
                                start, end, highestBidder, highestAmount, 
                                seller:highestBidder,
                                isCompleted: false});
        await auction.save();
    }
}
async function Bid(auctionId, bidder, amount){
    let auction = await Auction.findOne({auctionId});
    if(auction){
        auction.highestBidder = bidder;
        auction.highestAmount = amount;
        await auction.save();
    }
    let bidPlaced = await BidPlaced.findOne({
        auctionId,
        bidder
    })
    if(!bidPlaced){
        const newBid = new BidPlaced({auctionId, bidder});
        await newBid.save();
    }
    
}

async function completeAuction(auctionId){
    let auction = await Auction.findOne({auctionId});
    if(auction){
        auction.isCompleted = true;
        await auction.save();
    }
    await BidPlaced.deleteMany({auctionId});
}
async function withdraw(bidder, auctionId){
    await BidPlaced.deleteOne({bidder, auctionId});
}
module.exports = {createAuction, Bid, completeAuction, withdraw};