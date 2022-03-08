import React from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import Web3 from 'web3';

// import { Link } from 'react-router-dom';
import {Artabi,ArtAddress,AuctionAddress, Auctionabi} from '../config/data'

const BidderRoleAuction = ({data}) => {
  const web3 = new Web3(Web3.givenProvider);
  const AuctionContract =  new web3.eth.Contract(Auctionabi, AuctionAddress);
  const handleWithdraw = async ()=>{
    const accounts = await web3.eth.getAccounts();
    await AuctionContract.methods.withdraw(data.auctionId).send({from: accounts[0]});
    window.location.reload();
  }
  return (
    <div style={{width:300+'px' ,display: 'inline-block', margin:20+'px'}}>
      <Card>
      <CardImg style={{width:300+'px', height:300+'px'}} 
        top width="100%" src={`https://ipfs.io/ipfs/${data.cid}`} alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">Id {data.auctionId}</CardTitle>
          
        <Button color="warning" onClick={handleWithdraw}>Withdraw</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default BidderRoleAuction;