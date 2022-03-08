const {expect} = require("chai");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
createAuction = async function (time){
    const tokenId = 0;
    mintFee = await hardhatArt.connect(addr1).getMintFee();
    await hardhatArt.connect(addr1).createToken("x",{value:mintFee});
    await hardhatArt.connect(addr1).approve(hardhatAuc.address, tokenId);
    // //Approve fee
    auctionFee = await hardhatAuc.connect(addr1).getAuctionFee();
    // //Create auction
    const minBid = BigInt(10**18);
    const bidIncrement = BigInt(10**18);
    const period = time;
    await hardhatAuc.connect(addr1).createAuction(tokenId, minBid, bidIncrement,period,{value:auctionFee});
}
describe("Auction contract", function(){
    beforeEach(async function(){
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        prov = waffle.provider;
        a = await prov.getBalance(addr1.address);
        b = await prov.getBalance(owner.address);
        // deploy Art
        ART = await ethers.getContractFactory("Arts");
        hardhatArt = await ART.deploy();
        // deploy Auction
        AUC = await ethers.getContractFactory("Auctions");
        hardhatAuc = await AUC.deploy(hardhatArt.address);

    });
    describe("Create auction", function(){

        it ("Should create auction successfully", async function(){
            await createAuction(60*60*24*3);
        })
    })
    describe('Place bidding', function () {
        it('Should bid successfully', async function(){
            await createAuction(60*60*24*3);

            //bid
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});

        });
        it("Shouldn't bid by seller", async function(){
            await createAuction(60*60*24*3);

            //bid
            await expect(hardhatAuc.connect(addr1).placeBid(0,{value:BigInt(10**19)}))
            .to.be.revertedWith("Seller can't bid");
        });
        
        it("Shouldn't bid non-exist auction", async function(){
            await createAuction(60*60*24*3);
            //bid
            await expect(hardhatAuc.connect(owner).placeBid(2,{value:BigInt(10**19)}))
            .to.be.revertedWith("It's not a valid auction Id");
        });
        it("Shouldn't bid less than bidIncrement", async function(){
            await createAuction(60*60*24*3);
            //bid
            await hardhatAuc.connect(addr2).placeBid(0,{value:BigInt(10**19)});
            await expect(hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)}))
            .to.be.revertedWith("The bidding is not valid");
        });
        it("Shouldn't bid when expired", async function(){
            await createAuction(2);
            //bid
            await sleep(2500);
            await expect(hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)}))
            .to.be.revertedWith("Out time");
        });
    });
    describe("Withdraw bidding", function () {
        it("Should withdraw successfully", async () => {
            await createAuction(60*60*24*3);

            //bid
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            // increasing 
            await hardhatAuc.connect(addr2).placeBid(0,{value:BigInt(2*10**19)});

            await hardhatAuc.connect(owner).withdraw(0);
        });
        it("Should withdraw successfully with the highest", async () => {

            await createAuction(60*60*24*3);

            //bid
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            // increasing 
            await hardhatAuc.connect(addr2).placeBid(0,{value:BigInt(2*10**19)});

            await hardhatAuc.connect(addr2).withdraw(0);

        });
        it("Shouldn't withdraw with the last bidder", async () => {
            await createAuction(60*60*24*3);

            //bid
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            // increasing 
        

            await expect(hardhatAuc.connect(owner).withdraw(0))
            .to.be.revertedWith("Last bidder can't withdraw");
        });
        it("Shouldn't withdraw with the last bidder 2", async () => {
            await createAuction(60*60*24*3);

            //bid
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            // increasing 
            await hardhatAuc.connect(addr2).placeBid(0,{value:BigInt(2*10**19)});

            await hardhatAuc.connect(addr2).withdraw(0);        

            await expect(hardhatAuc.connect(owner).withdraw(0))
            .to.be.revertedWith("Last bidder can't withdraw");
        });
    });
    describe("Complete Auction", function () {
        it("Should complete auction with highest bidder", async () => {
            await createAuction(2);
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            await sleep(2000)
            await hardhatAuc.connect(owner).completeAuction(0);
        });
        it("Shouldn't complete auction before expired", async () => {
            await createAuction(60*60*24*3);
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            await expect(hardhatAuc.connect(owner).completeAuction(0))
            .to.be.revertedWith("Is Auctioning");
        });
        
        it("Shouldn't highest bidder withdraw after complete auction", async ()=>{
            await createAuction(4);
            // console.log('before bid: '+parseInt(await prov.getBalance(owner.address)));
            await hardhatAuc.connect(owner).placeBid(0,{value:BigInt(10**19)});
            // console.log('after  bid: '+parseInt(await prov.getBalance(owner.address)));
            await hardhatAuc.connect(addr2).placeBid(0,{value:BigInt(2*10**19)});
            await sleep(4000);
            await hardhatAuc.connect(addr2).completeAuction(0);
            // console.log(parseInt(a-await prov.getBalance(addr1.address)));
            // console.log('after comp: '+parseInt(await prov.getBalance(owner.address)));
            await expect(hardhatAuc.connect(addr2).withdraw(0))
            .to.be.revertedWith("This Auction is completed");
        });

    });

});
