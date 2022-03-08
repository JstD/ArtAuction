import React, { useEffect,useState } from 'react';
import TopNav from '../components/TopNav';
import styled from 'styled-components';
import server from '../config/host'
import banner from '../images/banner.png';
import AuctionItem from  '../components/AuctionItem';

const HomePage = ()=>{
    const [allAuctions, setAuctions] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${server}/api/auction`, {
                method: 'GET',
            })

            const data = await res.json();
            if (res.status === 200) {
                setAuctions(data.auction)
            } else {
                const [msg] = data.errors
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
            {
                allAuctions&&allAuctions.map((data)=><AuctionItem key ={data.id} data ={data}></AuctionItem>)
            }
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
export default HomePage;