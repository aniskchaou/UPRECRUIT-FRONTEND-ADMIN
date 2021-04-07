import React from 'react';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import Content from '../Content/Content';

import { BrowserRouter as Router, Route } from "react-router-dom"

import Footer from '../Footer/Footer';
import Path from '../Path/Path';
import Login from '../Login/Login';
import User from '../../config/user'
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = { connected: User.CONNECTED_USER };
  }
  rerender = () => {
    this.forceUpdate();
  };
  forceUpdate = () => {
    this.setState((state) => ({
      connected: User.CONNECTED_USER
    }));
  };
  render() {

    return (
      <div className="root-content">
        <Router>
          <Navigation />
          <Header rerender={this.rerender} />

          <div id="right-panel" className="right-panel">
            <Content />

            <div className="clearfix"></div>
            <Footer />
          </div>
          <Login rerender={this.rerender} />
        </Router>
      </div>
    );
  }
}



Root.propTypes = {};

Root.defaultProps = {};

export default Root;
