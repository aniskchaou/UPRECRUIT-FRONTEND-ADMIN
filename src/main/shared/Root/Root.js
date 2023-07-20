import React, { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import Content from '../Content/Content';

import { BrowserRouter as Router, Route } from "react-router-dom"

import Footer from '../Footer/Footer';
import Path from '../Path/Path';
import Login from '../Login/Login';
import User from '../../config/user'
const Root = () => {

  const [connected, setConnected] = useState(false);



  const handleClick = num => {
    setConnected(num)
  };


  return (
    <div className="root-content">
      <Router>
        {connected === true ?
          <div>
            <Navigation connected={connected} />
            <Header handleClick={handleClick} />

            <div id="right-panel" className="right-panel">
              <Content connected={connected} />

              <div className="clearfix"></div>
              <Footer connected={connected} />
            </div>
          </div> : <Login handleClick={handleClick} />}
      </Router>
    </div>
  );

}



Root.propTypes = {};

Root.defaultProps = {};

export default Root;
