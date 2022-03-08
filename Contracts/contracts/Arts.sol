// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Arts is ERC721{
    address public owner;
    uint mintFee;
    uint decimals;
    uint256 _lastTokenId;
    mapping(uint256 => string) private _tokenURIs;
    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() ERC721("Arts", "ART"){  
        owner=msg.sender;
        decimals = 18;
        mintFee = 10**14;
    }

    function setFee(uint256 fee) public onlyOwner{
        mintFee = fee;
    }

    function changeOwner(address newOwner) public onlyOwner{
        owner = newOwner;
    }

    function withdrawFee(uint256 amount) public onlyOwner{
        uint256 balance = getTotalFee();
        require(amount <= balance, "Contract not enough token");
        (bool sent, bytes memory data) = payable(msg.sender).
                    call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function getTotalFee() public view onlyOwner returns(uint256){
        return address(this).balance;
    }
    function getMintFee() public view returns(uint256){
        return mintFee;
    }

    function createToken(string memory _tokenURI) public payable {
        require(msg.value>= mintFee, "It's not enough ETH");
        _mint(msg.sender, _lastTokenId);
        _tokenURIs[_lastTokenId] = _tokenURI;
        _lastTokenId++;
    }
    function getURI(uint256 _tokenId) public view returns(string memory){
        require(_tokenId < _lastTokenId, "Invalid Token");
        return _tokenURIs[_tokenId];
    }
    function baseURI() public pure returns(string memory){
        return "https://ipfs.io/ipfs/";
    }
    function getArtUrl(uint256 _tokenId) public view returns(string memory){
        string memory cid = getURI(_tokenId);
        string memory _base = baseURI();
        return string(abi.encodePacked(_base,cid));
    }
}