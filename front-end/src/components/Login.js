import React from 'react';
import { useHistory,  } from 'react-router-dom';
import {  Button } from "react-bootstrap";
// import { setCurrentUser, getToken, setAuth } from '../store/store';
// import Web3 from 'web3';
import { ethers } from "ethers";
// import { useDispatch } from 'react-redux';
import { Alert } from 'reactstrap';

import server from '../config/host';

// const web3 = new Web3();

export const Login = () => {
  // const user = useSelector(state => {console.log(state); return state.currentUser})
  
  // const resultBox = useRef();
  const history = useHistory();
  // const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload()
    history.pushState('/')
  }
  const signMessage = async (message, signer, publicAddress) => {
    try {  
      await window.ethereum.send("eth_requestAccounts");
      const signature = await signer.signMessage(message);
      return {
        message,
        signature,
        publicAddress
      };
    } catch (err) {
      alert(err);
    }
  };
	const handleClick = async () => {
    try{
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const publicAddress = await signer.getAddress();
      const getNonce = await fetch(`${server}/api/auth?address=${publicAddress}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      const {nonce} = await getNonce.json();
      // nonce : nonce
      const sig = await signMessage(''+nonce, signer,publicAddress);
      const getAuth = await fetch(`${server}/api/auth`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sig),
      });
      const data = await getAuth.json();
      if(getAuth.status ===200){
        localStorage.setItem('TOKEN', data.token);
        // dispatch(getToken(data.token));
        // dispatch(setAuth(true));
        // dispatch(setCurrentUser({name: data.name, address: publicAddress}));
        window.location.reload()
        localStorage.setItem('NAME', data.name);
        localStorage.setItem('ADDRESS', publicAddress);

      }
    }
    catch (err) {
      
      alert('Some thing went wrong: ' + err.message)
    }
  }
	return (
    <div>
      {
        localStorage.getItem('ADDRESS')&&
        (<Alert style={{margin:0, padding:0.25+'rem'}}>
         {localStorage.getItem('ADDRESS')}
        <Button outline color="primary" onClick={handleLogout}
                    style={{marginLeft: 1 + 'em'}}>Logout</Button>
          </Alert>
        )
        ||<Button onClick={handleClick}>Connect to Metamask</Button>}
    </div>
  );
};
export default Login;