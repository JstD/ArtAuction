const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Auction = require('../models/Auctions');
const Art = require('../models/Arts');
const eth = require('ethers');
const config = require('config');
const { route } = require('./auth');


router.get('/:id', async (req, res) => {
    try{
        const art = await Art.findById(req.params.id);
        res.json(art);
    }
    catch{
        res.status(500).send('Server Error')
    }
})
router.get('/', async (req, res) => {
    try{
        // console.log(req.query)
        let arts = await Art.find({
            owner: req.query.address
        });
        res.json(arts)
    }
    catch(err){
        res.status(500).send('Server Error')
    }
});

module.exports = router;