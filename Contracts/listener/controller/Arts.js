const Art = require('../models/Arts');

async function changeArtOwner(tokenId, newOwner) {
    let art = await Art.findOne({tokenId});
    if(art){
        art.owner = newOwner;
        await art.save();
    }
    else{
        throw new Error("Token not exists")
    }
}
async function createArt(tokenId, CID, owner) {
    let art = await Art.findOne({tokenId});
    if(art){
        throw new Error("Token is exist")
    }
    else{
        art = new Art({tokenId,  CID, owner});
        await art.save()
    }
}
async function getArt(tokenId){
    let art = await Art.findOne({tokenId});
    if(art){
        return art;
    }
    else{
        return null;
    }
}
module.exports = {changeArtOwner, createArt, getArt}