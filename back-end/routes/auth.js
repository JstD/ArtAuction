const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const eth = require('ethers');
const config = require('config');

router.get('/', async function (req, res){
    try{
        const publicAddress=req.query.address;
        // console.log(publicAddress);
        try {
            let user = await User.findOne({publicAddress});
            if(user)
                res.json({ nonce: user.nonce });
            else{
                user = new User({publicAddress});
                await user.save();
                res.json({nonce: user.nonce});
            }
            
        } catch (err) {
            res.send({ err: "Server Error" })
        }
    }
    catch (err){
        res.send({err: "Wrong params"})
    }

});

router.post('/', async function (req, res){
    // console.log(req.body)
    try{
        const { message, signature , publicAddress} = req.body;
        const signerAddr = await eth.ethers.utils.verifyMessage(message, signature);
        // console.log(signerAddr)
        if(signerAddr==publicAddress){
            let user = await User.findOne({publicAddress});
            if(!user) throw new Error("Error");
            const payload = {
                user: {
                    id: user.id,
                }
            }
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000,
            }, (err, token) => {
                if (err) throw err;
                res.json({ token,
                        name: user.name })
            })
        }
        else{
            res.send('Error')
        }
    } 
    catch (err){
        res.send({err: "Wrong data"})
    }
});

module.exports = router ;
