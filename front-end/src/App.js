import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import MyArt from './pages/MyArt';
import HomePage from './pages/HomePage';
import AuctionDetails from './pages/AuctionDetails';
import CreateArt from './pages/CreateArt';
import CreateAuction from './pages/CreateAuction';
import MyAuction from './pages/MyAuction';
function App() {
  return (

    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/myart' component={MyArt}/>
        <Route exact path='/myart/create_art' component={CreateArt}/>
        <Route exact path='/auction/create/:id' component={CreateAuction}/>
        <Route exact path='/auction/:id' component={AuctionDetails}/>
        <Route exact path='/myauction' component={MyAuction}/>
      </Switch>
    </Router>
  );
}

export default App;
