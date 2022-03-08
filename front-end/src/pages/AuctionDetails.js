import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import banner from '../images/banner.png';
import { Table, Button } from 'reactstrap';
import './css/pageDetail.css'
import TopNav from '../components/TopNav';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Web3 from 'web3';
import server from '../config/host';
import {Artabi,ArtAddress,AuctionAddress, Auctionabi} from '../config/data'
const timeConverter =(time)=>{
    var date = new Date(time*1000);
    return date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes()+
    ":"+date.getSeconds();
}
const AuctionDetails = ()=>{
    const web3 = new Web3(Web3.givenProvider);

    const {id} = useParams();
    const [auction, setAuction] = useState();
    const [bid, setBid] = useState(0);
    const Bid = async ()=>{
        const AuctionContract =  new web3.eth.Contract(Auctionabi, AuctionAddress);
        const auctionId = auction.auctionId;
        const accounts = await web3.eth.getAccounts()
        await AuctionContract.methods.placeBid(auctionId)
        .send({from: accounts[0], value:bid})
        alert('Bided Successfully!!');
    }
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${server}/api/auction/${id}`, {
                method: 'GET',
            })

            const data = await res.json();
            if (res.status === 200) {
                setAuction(data)
            } else {
                const [msg] = data.errors
                alert(msg.msg)
            }
        }

        fetchData()
    }, [])
    return(
        <Home> 
        <TopNav/>
        <Banner src={banner}/>
        <AuctionWrapper >
            {auction &&
            <div  className="auctionWrapper">
            <img src={`https://ipfs.io/ipfs/${auction.cid}`}/>
            <Table className="auctionTable">
            <tbody>
                <tr>
                <td>Auction Id</td>
                <td>{auction.auctionId}</td>
                </tr>
                <tr>
                    <td>Start time</td>
                <td>{timeConverter(auction.start)}</td>
                </tr>
                <tr>
                <td>End time</td>
                <td>{timeConverter(auction.end)}</td>
                </tr>
                
                <tr>
                <td>Highest bid</td>
                <td>{auction.highestAmount>0?auction.highestAmount:auction.minBid}  Wei</td>
                </tr>
                <tr>
                <td>Highest bidder</td>
                <td>{auction.highestBidder}</td>
                </tr>
                <tr>
                <td>Increment</td>
                <td>{auction.bidIncrement} Wei</td>
                </tr>
            </tbody>
            </Table>
            <div style={{width : 500+'px', display:'inline-block', paddingRight:10+'px'}}>
            <InputGroup >
            <InputGroupAddon addonType="prepend">Wei</InputGroupAddon>
            <Input placeholder="Amount"  type="number" onChange={(event)=>setBid(event.target.value)} />
            </InputGroup>
            </div>
            <Button color="primary" onClick={Bid}>Bid</Button>
            </div>
            }
        </AuctionWrapper>    
        {/* <Banner src={banner} style={{position: 'relative'}}/> */}
        </Home>
    )
}
const Home = styled.div`
    min-height:900px;
    height: max-content;
    width: 100%;
    background-color: #aab8c2;
`;
const Banner = styled.img`
    width = 100%;
    height = 50px;
`;
const AuctionWrapper = styled.div`
    min-height:900px;
    background-color:#ffffff;
    margin: auto;
    width: 75%;
    @media (max-width: 768px) {
        width: 100%;
    }
`
export default AuctionDetails;