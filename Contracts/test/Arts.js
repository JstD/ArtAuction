const {expect} = require("chai");

describe("Arts contract", function(){
    beforeEach(async function(){
        // deploy Art
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ART = await ethers.getContractFactory("Arts");
        hardhatArt = await ART.deploy();
    });

    describe("Arts contract mint", function(){
        it("Should mint any token successfully", async function(){
            let mintFee = await hardhatArt.connect(addr1).getMintFee();
            await hardhatArt.connect(addr1).createToken("x",{value:mintFee});
            let addr1Balance = await hardhatArt.connect(addr1).balanceOf(addr1.address);
            expect(addr1Balance).to.equal(1);
            await hardhatArt.connect(addr1).createToken("x",{value:mintFee});
            addr1Balance = await hardhatArt.connect(addr1).balanceOf(addr1.address);
            expect(addr1Balance).to.equal(2);
        });
    });
    describe("Transfer testing", function(){
        it("Should transferFrom successfully", async function(){
            let mintFee = await hardhatArt.connect(addr1).getMintFee();
            await hardhatArt.connect(addr1).createToken("x",{value:mintFee});
            await hardhatArt.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
            addr1Balance = await hardhatArt.connect(addr1).balanceOf(addr1.address);
            expect(addr1Balance).to.equal(0);
            addr2Balance = await hardhatArt.connect(addr2).balanceOf(addr2.address);
            expect(addr2Balance).to.equal(1);
        });
        it("Should approve, transferFrom successfully", async function(){
            let mintFee = await hardhatArt.connect(addr1).getMintFee();
            await hardhatArt.connect(addr1).createToken("x",{value:mintFee});
            await hardhatArt.connect(addr1).approve(addr2.address, 0);
            await hardhatArt.connect(addr2).transferFrom(addr1.address, owner.address, 0);
            addr1Balance = await hardhatArt.connect(addr1).balanceOf(addr1.address);
            expect(addr1Balance).to.equal(0);
            ownerBalance = await hardhatArt.connect(owner).balanceOf(owner.address);
            expect(ownerBalance).to.equal(1);
        });

    });
});
