import React from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import { Link } from 'react-router-dom';

const getTime = (date) =>{
  let time_now = Math.floor(Date.now()/1000);
  let est = Math.floor((date - time_now)/60);
  let min = est %60;
  est = Math.floor(est/60);
  let hour = est%24;
  let day =  Math.floor(est/24);
  return {min, hour, day}
}
const Auctionitem = ({data}) => {
  let end  = getTime(data.end)
  return (
    <div style={{width:300+'px' ,display: 'inline-block', margin:20+'px'}}>
      <Card style={{height:450+'px'}}>
        <Link to={'/auction/'+data._id}>
        <CardImg style={{width:300+'px', height:300+'px'}}
        top width="100%" src={`https://ipfs.io/ipfs/${data.cid}`} alt="Card image cap" />
        </Link>
        <CardBody>
          <CardTitle tag="h5">Auction Id {data.auctionId}</CardTitle>
        {data.highestAmount?<CardSubtitle tag="h6" className="mb-2 text-muted">Highest Bid {data.highestAmount}</CardSubtitle>:''}
          <CardText>End in: {end.day} days {end.hour} hours {end.min} minutes</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Auctionitem;