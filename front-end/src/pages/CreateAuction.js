import React, { useEffect,useState } from 'react';
import TopNav from '../components/TopNav';
import styled from 'styled-components';
import server from '../config/host'
import banner from '../images/banner.png';
import AuctionItem from  '../components/AuctionItem';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Web3 from 'web3';
import {Artabi,ArtAddress,AuctionAddress, Auctionabi} from '../config/data';
import './css/auctionCreate.css'
const CreateAuction = ()=>{
    const {id} = useParams();
    // console.log(id)
    const history = useHistory();
    const web3 = new Web3(Web3.givenProvider);
    const [disabled, setDisabled] = useState();
    const [art, setArt] = useState();
    const [fee, setFee] = useState();
    const [minBid, setMinBid] = useState();
    const [bidIncrement, setBidIncrement] = useState();
    const [period, setPeriod] = useState();
    const AuctionContract =  new web3.eth.Contract(Auctionabi, AuctionAddress);
    const ArtContract =  new web3.eth.Contract(Artabi, ArtAddress);
    const approveArt = async ()=>{
        setDisabled(true);
        const accounts = await web3.eth.getAccounts();
        await ArtContract.methods.approve(AuctionAddress, art.tokenId).send({from: accounts[0]});
        setDisabled(false);
    }
    const createAuction = async ()=>{
        setDisabled(true);
        const accounts = await web3.eth.getAccounts();
        await AuctionContract.methods.createAuction(art.tokenId, minBid, bidIncrement, period)
        .send({from: accounts[0], value:fee});
        setDisabled(false);
        history.push('/');

    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${server}/api/myarts/${id}`, {
                method: 'GET',
            })

            const data = await res.json();
            if (res.status === 200) {
                setArt(data)
            } else {
                const [msg] = data.errors
                alert(msg.msg)
            }
            const auctionFee = await AuctionContract.methods.getAuctionFee().call();
            setFee(auctionFee);
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
            <AuctionWrapper className={(disabled) ? 'is-disabled' : ''}>
            {art&&
            <div class = "content">
                <div class = "img">
                <img src ={`https://ipfs.io/ipfs/${art.CID}`}></img>
                </div>
                <Form>
                <FormGroup>
                    <Label for="id" >Token Id</Label>
                    <Input type="text" name="id" id="id" 
                     disabled value={art.tokenId} />
                </FormGroup>
                <FormGroup>
                    <Label for="min-bid" >Min bid </Label>
                    <Input type="text" name="min-bid" id="min-bid" placeholder="Wei"
                    onChange ={(e)=>setMinBid(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="bid-inc" >Bid Increment</Label>
                    <Input type="text" name="bid-inc" id="bid-inc"  placeholder="Wei"
                    onChange ={(e)=>setBidIncrement(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="period" >Period</Label>
                    <Input type="text" name="period" id="period"  placeholder="Seconds"
                    onChange ={(e)=>setPeriod(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                <FormText>Create Auction Fee: {fee} Wei</FormText>
                </FormGroup>
                <Button color="secondary" onClick={approveArt}>Approve Art</Button>{' '}
                <Button color="primary" onClick={createAuction}>Create Auction</Button>{' '}
                </Form>
            </div>
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
`
export default CreateAuction;