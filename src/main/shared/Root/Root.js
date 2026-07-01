import React, { useCallback, useMemo, useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import Content from '../Content/Content';

import { BrowserRouter as Router, Redirect, useLocation } from "react-router-dom";

import Footer from '../Footer/Footer';
import Login from '../Login/Login';

const RootShell = () => {
  const location = useLocation();
  const [connected, setConnected] = useState(localStorage.getItem('adminConnected') === 'true');

  const pathname = location && location.pathname ? location.pathname : '/';
  const isAdminLoginRoute = pathname === '/login';

  const handleClick = useCallback((nextConnected) => {
    setConnected(nextConnected);
    localStorage.setItem('adminConnected', nextConnected ? 'true' : 'false');
  }, []);

  const adminWorkspace = useMemo(() => (
    <div>
      <Navigation connected={connected} />
      <Header handleClick={handleClick} />

      <div id="right-panel" className="right-panel">
        <Content connected={connected} />

        <div className="clearfix"></div>
        <Footer connected={connected} />
      </div>
    </div>
  ), [connected, handleClick]);

  if (pathname === '/') {
    return <Redirect to="/dashboard" />;
  }

  if (isAdminLoginRoute || connected !== true) {
    return <Login handleClick={handleClick} />;
  }

  return adminWorkspace;
};

const Root = () => (
  <div className="root-content">
    <Router>
      <RootShell />
    </Router>
  </div>
);

Root.propTypes = {};

Root.defaultProps = {};

export default Root;
