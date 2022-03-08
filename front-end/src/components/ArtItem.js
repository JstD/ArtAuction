import React from 'react';
import {
  Card, CardImg, CardBody,
  CardTitle,Button

} from 'reactstrap';
import { Link } from 'react-router-dom';
const ArtItem = ({data})=>{
    return(
      <div style={{width:300+'px' ,display: 'inline-block', marginLeft:20+'px'}}>
      <Card style={{height:450+'px'}}>
      <CardImg style={{width:300+'px', height:300+'px'}}
        top width="100%" src={`https://ipfs.io/ipfs/${data.CID}`} alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">Token Id {data.tokenId}</CardTitle>
        <Link to={`/auction/create/${data._id}`}>
        <Button> Create Auction</Button>
        </Link>
        </CardBody>
      </Card>
    </div>
    );
}
export default ArtItem;