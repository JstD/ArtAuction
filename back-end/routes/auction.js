const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Auction = require('../models/Auctions');
const Art = require('../models/Arts');
const BidPlaced = require('../models/BidPlaced');
const eth = require('ethers');
const config = require('config');

async function getCID(tokenId){
    let token = await Art.findOne({tokenId: tokenId});
    return token.CID;
}
router.get('/', async function (req, res){
    try{
        let date = Math.floor(Date.now()/1000);
        let auction = await Auction.find({
            start:{
                $lt: date
            },
            end:{
                $gt:date
            }
        });
        data = []
        for(let i=0;i<auction.length;i++){
            let cid = await getCID(auction[i].tokenId)
            data.push({_id: auction[i].id,
                highestAmount: auction[i].highestAmount,
                auctionId: auction[i].auctionId,
                end: auction[i].end,
                        cid})
        }
        // console.log(data)
        res.json({auction:data})
    }
    catch(err){
        res.status(500).send('Server Error')
    }
});

router.get('/seller', async function (req, res){
    try{
        seller = req.query.seller;
        // console.log(seller);
        let date = Math.floor(Date.now()/1000);
        let auction = await Auction.find({
            start:{
                $lt: date
            },
            end:{
                $gt:date
            },
            seller
        });
        data = []
        for(let i=0;i<auction.length;i++){
            let cid = await getCID(auction[i].tokenId)
            data.push({_id: auction[i].id,
                auctionId: auction[i].auctionId,
                end: auction[i].end,
                        cid})
        }
        
        res.json(data)
    }
    catch(err){
        res.status(500).send('Server Error')
    }
});

router.get('/bidder', async function (req, res){
    try{
        const bidder = req.query.bidder;
        // console.log(bidder)
        const auction = await BidPlaced.find({
            bidder
        });
        data = [];
        for(let i=0;i<auction.length;i++){
            let tmp = await Auction.findOne({auctionId: auction[i].auctionId});
            // console.log(tmp);
            let cid = await getCID(tmp.tokenId)
            data.push({
                auctionId: auction[i].auctionId, cid})
        }
        // console.log(data)
        res.json(data)
    }
    catch(err){
        res.status(500).send('Server Error')
    }
});
router.get('/:id', async function (req, res){
    try{
        const id = req.params.id
        let auction = await Auction.findById(id);
        let cid = await getCID(auction.tokenId);
        res.json({
            ...auction._doc,
            cid
        })
    }
    catch(err){
        res.status(500).send('Server Error')
    }

});

module.exports = router;