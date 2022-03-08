import React, { useEffect,useState } from 'react';
import {Button} from 'reactstrap';
import TopNav from '../components/TopNav';
import styled from 'styled-components';
import server from '../config/host'
import banner from '../images/banner.png';
import ArtItem from  '../components/ArtItem';
import { Link } from 'react-router-dom'

// import ItemsWrapper from '../components/ItemsWrapper';

const MyArt = ()=>{
    const address = localStorage.getItem('ADDRESS');
    const [allArts, setArts] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${server}/api/myarts?address=${address}`, {
                method: 'GET',
            })

            const data = await res.json();
            // console.log(data)
            if (res.status === 200) {
                setArts(data)
                // console.log(data)
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
            <BtnCreate>
            <Link to='/myart/create_art'>
            <Button color="success" >Create My Art</Button>
            </Link>
            </BtnCreate>
            {
                allArts && allArts.map((data)=><ArtItem key ={data.id} data ={data}></ArtItem>)
            }
            </AuctionWrapper>    
            {/* <Banner src={banner} style={{position: 'relative'}}/> */}
        </Home>
        
    );
} 
const Home = styled.div`
    height: max-content;
    width: 100%;
    background-color: #aab8c2;
`;
const Banner = styled.img`
    width = 100%;
    height = 50px;
`;
const AuctionWrapper = styled.div`
    padding-top:20px;
    padding-left:20px;
    padding-right:20px;
    min-height:900px;
    background-color:#ffffff;
    margin: auto;
    width: 75%;
    @media (max-width: 768px) {
        width: 100%;
    }
`
const BtnCreate = styled.div`
    padding-bottom:20px;
`
export default MyArt;