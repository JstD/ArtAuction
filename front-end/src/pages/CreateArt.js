import React, { useEffect,useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import TopNav from '../components/TopNav';
import styled from 'styled-components';
import server from '../config/host'
import banner from '../images/banner.png';
import {useHistory} from 'react-router-dom';
import './css/createArt.css';
import Web3 from 'web3';
import {Artabi,ArtAddress,AuctionAddress, Auctionabi} from '../config/data'

const CreateArt = ()=>{
    const [fee,setFee] = useState();
    const [cid, setCid] = useState();
    const [disabled, setDisabled] = useState();
    const history = useHistory();
    const web3 = new Web3(Web3.givenProvider);
    const ArtContract =  new web3.eth.Contract(Artabi, ArtAddress);
    useEffect(() => {
        const fetchData = async () => {
            const data = await ArtContract.methods.getMintFee().call();
            setFee(data);
        }
        fetchData()
    }, [])
    const HandleCreateArt = async () => {
        setDisabled(true);
        if(cid){
            const accounts = await web3.eth.getAccounts();
            await ArtContract.methods.createToken(cid)
            .send({from: accounts[0], value: fee})
        }
        else{
            alert('Please enter cid from ipfs')
        }
        setDisabled(false);
        history.push('/myart');
    }
    return(
    <Home> 
    <TopNav/>
    <Banner src={banner}/>
    <AuctionWrapper className={(disabled) ? 'is-disabled' : ''}>
        <Form className="my-form">
        <FormGroup>
            <Label for="CID">Token CID</Label>
            <Input type="text" name="CID" id="CID" placeholder="CID from IPFS" 
            onChange={(event)=>{setCid(event.target.value)}}/>
        </FormGroup>
        <FormGroup>
        <FormText>Create Token Fee: {fee} Wei</FormText>
        </FormGroup>
        <Button color="primary" onClick={HandleCreateArt}>Create Art</Button>{' '}
        </Form>
        </AuctionWrapper>    
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
export default CreateArt;