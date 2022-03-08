import React, { useEffect,useState } from 'react';
import TopNav from '../components/TopNav';
import styled from 'styled-components';
import server from '../config/host'
import banner from '../images/banner.png';
import AuctionItem from  '../components/AuctionItem';
import { Alert } from 'reactstrap';
import BidderRoleAuction from '../components/BidderRoleAuction';

const MyAuction = ()=>{
    const [sellerAuctions, setSellerAuctions] = useState();
    const [bidderAuctions, setBidderAuctions] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const address = localStorage.getItem('ADDRESS')
            const res = await fetch(`${server}/api/auction/seller?seller=${address}`, {
                method: 'GET',
            })
            
            const data = await res.json();
            if (res.status === 200) {
                // console.log(data)
                setSellerAuctions(data)
            } else {
                const [msg] = data.errors
                alert(msg.msg)
            }
            const bid = await fetch(`${server}/api/auction/bidder?bidder=${address}`, {
                method: 'GET',
            })
            const auction = await bid.json();
            if (bid.status === 200) {
                // console.log(data)
                setBidderAuctions(auction)
            } else {
                const [msg] = auction.errors
                alert(msg.msg)
            }
        }

        fetchData()
    }, [])
    try{
        window.ethereum.enable();
    }
    catch(e){}
    return(
        <Home> 
            <TopNav/>
            <Banner src={banner}/>
            
            
            <AuctionWrapper>
            <div>
            <Alert color="success">
                Seller Role
            </Alert>
            {
                sellerAuctions&&sellerAuctions.map((data)=><AuctionItem key ={data.id} data ={data}></AuctionItem>)
            }
            </div>   
            <div>
            <Alert color="warning">
                Bidder Role
            </Alert>
            {
                bidderAuctions&&bidderAuctions.map((data)=><BidderRoleAuction key ={data.id} data ={data}></BidderRoleAuction>)
            }
            </div>   
            </AuctionWrapper>
            
            {/* <Banner src={banner} style={{position: 'relative'}}/> */}
        </Home>
        
    );
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
export default MyAuction;