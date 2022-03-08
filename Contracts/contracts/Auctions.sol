// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import "./Arts.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
contract Auctions {

    /*======================== Properies =========================== */
    //Pure
    using SafeMath for uint256;
    ERC721 private _arts;
    uint256 _auctionLastId;
    uint256 decimals;
    uint256 auctionFee;
    address _owner;
    uint256 bidFee;//(x/10000)
    //Struct
    struct  AuSession{
        address seller;
        uint256 minBid;
        uint256 tokenId;
        uint256 bidIncrement;
        uint256 start;
        uint256 period;
    }
    struct Bidding{
        uint256 highestBid;
        // need idea for data structure that can find maximum efficiently
        mapping(address=>uint256) bidHistory; 
        address[] bidder;
        uint256 numBidder;
        address highestBidAddress;
    }

    //Mapping
    mapping (uint256=>AuSession) _auctSession;
    mapping (uint256=>Bidding) _bidding;
    mapping (uint256=>bool) _isNotCompleted;

    /* ========================== Event ========================== */
    event CreateAuction(address,uint256,uint256,uint256,uint256,uint256,uint256);
    event Bid(address,uint256,uint256);
    event WithDraw(address,uint256);
    event CompleteAuction(uint256);
    /* ========================== Modifier ========================== */
    modifier onlyOwner{
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }
    modifier onlyUnExpired(uint256 auctionId){
        AuSession memory auction = _auctSession[auctionId];
        uint256 start = auction.start;
        uint256 period = auction.period;
        require(start<block.timestamp && start+period>block.timestamp, "Out time" );
        _;
    }
    modifier onlyExpired(uint256 auctionId){
        AuSession memory auction = _auctSession[auctionId];
        uint256 start = auction.start;
        uint256 period = auction.period;
        require(start>block.timestamp || start+period<block.timestamp, "Is Auctioning" );
        _;
    }
    modifier onlyNotSeller(uint256 auctionId){
        AuSession memory auction = _auctSession[auctionId];
        address seller = auction.seller;
        require(msg.sender != seller,"Seller can't bid");
        _;
    }
    modifier validId(uint256 auctionId){
        require(auctionId < _auctionLastId, "It's not a valid auction Id");
        _;
    }
    function checkonlyUnExpired(uint256 auctionId) private onlyUnExpired(auctionId){
        
    }
    /* ========================== Method ========================== */
    constructor(address _artsAddress){
        _arts = Arts(_artsAddress);
        _auctionLastId = 0;
        auctionFee = 10**15;
        _owner = msg.sender;
        bidFee = 10;
    }
    /**============== Basic method ============== */
    function setAuctionFee(uint256 fee) public onlyOwner{
        auctionFee = fee;
    }

    function getAuctionFee() public view returns(uint256){
        return auctionFee;
    }

    function changeOwner(address newOwner) public onlyOwner{
        _owner = newOwner;
    }
    //The owner withdraw fee in the contract
    function withdrawFee(uint256 amount) public onlyOwner{
        uint256 balance = getTotalFee();
        require(amount <= balance, "Contract not enough token");
        (bool sent, bytes memory data) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function getTotalFee() public view onlyOwner returns(uint256){
        return address(this).balance;
    }

    /**============== Processing method ===========*/
    
    //Require approved Art token, Teqie token
    function createAuction(
        uint256 tokenId, 
        uint256 minBid,
        uint256 bidIncrement,
        uint256 period
    ) public payable{
        require(minBid>0, "Price can not less than 0");
        //Check Auction fee

        require(msg.value>=auctionFee,"It's not enough ETH");

        // Transfer this token to smart contract
        _arts.transferFrom(msg.sender, address(this), tokenId);
        //create new Auction Session
        _auctSession[_auctionLastId] = AuSession(msg.sender, minBid, 
                                            tokenId, bidIncrement, 
                                            block.timestamp, period);
        // 
        

        _bidding[_auctionLastId].highestBidAddress = msg.sender;
        _auctionLastId = _auctionLastId.add(1);
        _isNotCompleted[ _auctionLastId.sub(1)] = true;
        emit CreateAuction(msg.sender, _auctionLastId.sub(1), tokenId, minBid, 
        bidIncrement, block.timestamp, period);
    }

    function getBidingAmount(uint256 auctionId) public view returns(uint256){
        Bidding storage bidding = _bidding[auctionId];
        return bidding.bidHistory[msg.sender];
    }

    function placeBid(
        uint256 auctionId
    ) public payable validId(auctionId) onlyUnExpired(auctionId) onlyNotSeller(auctionId) {
        AuSession memory auction = _auctSession[auctionId];
        Bidding storage bidding = _bidding[auctionId];
        uint256 _bid = msg.value;
        // check if the bidding is valid
        require(_bid>auction.minBid && _bid >= bidding.highestBid.add(auction.bidIncrement),
        "The bidding is not valid");
        // send Teqie to contract
        uint256 oldBid = bidding.bidHistory[msg.sender];

        //required approved tokenomic to contract
        bidding.bidHistory[msg.sender] = _bid;
        if(oldBid==0){
            bidding.bidder.push(msg.sender);
            bidding.numBidder++;
        }
        else{
            (bool sent, bytes memory data) = payable(msg.sender).call{value: oldBid}("");
            require(sent, "Failed to send Ether");
        }
        bidding.highestBid = _bid;
        bidding.highestBidAddress = msg.sender;
        emit Bid(msg.sender, auctionId, _bid);
    }

    function withdraw(uint256 auctionId) validId(auctionId) public{
        Bidding storage bidding = _bidding[auctionId];
        uint256 amount = bidding.bidHistory[msg.sender];
        require(amount>0,"Withdrawing with address didn't bid");
        require(bidding.numBidder>1,"Last bidder can't withdraw");
        require(_isNotCompleted[auctionId],"This Auction is completed");
        //delete user
        bidding.bidHistory[msg.sender] = 0;
        uint n = bidding.bidder.length;
        if(msg.sender == bidding.highestBidAddress){
            //must withdraw before auction finishing
            checkonlyUnExpired(auctionId);
            address nextMaxBidder = bidding.bidder[0];
            uint256 nextMaxBid = bidding.bidHistory[nextMaxBidder];
            for(uint256 i=1;i<n;i++){
                uint256 bid = bidding.bidHistory[bidding.bidder[i]];
                if(nextMaxBid<bid){
                    nextMaxBid = bid;
                    nextMaxBidder = bidding.bidder[i];
                }
            }
            bidding.highestBid = nextMaxBid;
            bidding.highestBidAddress = nextMaxBidder;
        }
        (bool sent, bytes memory data) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
        for(uint256 i=0;i<n;i++){
            if(bidding.bidder[i]==msg.sender){
                bidding.bidder[i] = address(0);
                bidding.numBidder--;
                break;
            }
        }
        emit WithDraw(msg.sender, auctionId);
    }

    function completeAuction(uint256 auctionId) public
    validId(auctionId) onlyExpired(auctionId)  {
        require(_isNotCompleted[auctionId], "This Auction was completed");
        AuSession memory auction = _auctSession[auctionId];
        Bidding storage bidding = _bidding[auctionId];
        address highestBidAddress = bidding.highestBidAddress;
        // Refund to loser
        uint256 n = bidding.bidder.length;
        bool sent;
        bytes memory data;
        for(uint256 i =0;i<n;i++){
            if(bidding.bidder[i]!=address(0) && bidding.bidder[i]!=highestBidAddress){
                address refunder = bidding.bidder[i];
                if(bidding.bidHistory[refunder]>0){
                    (sent, data) = payable(refunder).
                    call{value: bidding.bidHistory[refunder]}("");
                    require(sent, "Failed to send Ether");
                }
            }
        }
        //Art to winner
        _arts.transferFrom(address(this), highestBidAddress, auction.tokenId);
        //ETH to seller
        (sent,data) = payable(auction.seller).
        call{value: bidding.highestBid}("");
        require(sent, "Failed to send Ether");

        _isNotCompleted[auctionId] = false;
        emit CompleteAuction(auctionId);
    }
    function getHighestBid(uint256 auctionId) public view validId(auctionId) returns(address,uint256)  
    {
        Bidding storage bidding = _bidding[auctionId];
        return (bidding.highestBidAddress, bidding.highestBid);
    }
}
