const ethers = require('ethers');
const projectId = "129ed97aa7d34db28a510263480b776f";
const url = `https://rinkeby.infura.io/v3/${projectId}`;
const provider = new ethers.providers.JsonRpcProvider(url);
const addressZero = '0x0000000000000000000000000000000000000000';
const ArtSchema = require('./controller/Arts');
const AuctionSchema = require('./controller/Auctions')
const connectDB = require('./config/db');
const art = require('./data/art');
const auction = require('./data/auction');

const Art = new ethers.Contract(art.address,art.abi,provider);
const Auction = new ethers.Contract(auction.address,auction.abi,provider);
connectDB();


Art.on("Transfer", async (...log) => {
    let args=log[log.length-1].args;
    // console.log(args)
    let sender = args[0];
    let receiver = args[1];
    let artId = parseInt(args[2]);
    let cid = await Art.getURI(artId);
    if(sender===addressZero){
        ArtSchema.createArt(artId, cid, receiver);
    }
    else{
        ArtSchema.changeArtOwner(artId, receiver);
    }
});

Auction.on("CreateAuction", (...log)=>{
    let args=log[log.length-1].args;
    let seller = args[0];
    let auctionId = parseInt(args[1]);
    let tokenId = parseInt(args[2]);
    let minBid = parseInt(args[3]);
    let bidIncrement = parseInt(args[4]);
    let start = parseInt(args[5]);
    let period = parseInt(args[6]);
    AuctionSchema.createAuction(auctionId, tokenId, minBid, bidIncrement,start, period, seller,0);
});

Auction.on("Bid", async (...log) =>{
    let args=log[log.length-1].args;
    let auctionId = parseInt(args[1]);
    const data = await Auction.getHighestBid(auctionId);
    highestBidAddress = data[0]
    highestBid = parseInt(data[1]);
    AuctionSchema.Bid(auctionId,highestBidAddress,highestBid);
});

Auction.on("WithDraw",async (...log) =>{
    let args=log[log.length-1].args;
    let auctionId = parseInt(args[1]);
    let withdrawer = args[0];
    const data = await Auction.getHighestBid(auctionId);
    highestBidAddress = data[0]
    highestBid = parseInt(data[1]);
    AuctionSchema.withdraw(withdrawer,auctionId);
    AuctionSchema.Bid(auctionId,highestBidAddress,highestBid);
});

Auction.on("CompleteAuction", (...log)=>{
    let args=log[log.length-1].args;
    let auctionId = parseInt(args[0]);
    AuctionSchema.completeAuction(auctionId);
});


