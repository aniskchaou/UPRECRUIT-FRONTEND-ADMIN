import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import { BrowserRouter as Router, Route } from "react-router-dom"
import Configuration from '../Configuration/Configuration';
import Dashbord from '../DashBoard/DashBoard';
import Category from '../Category/Category';
import Candidate from '../Candidate/Candidate';
import Interview from '../Interview/Interview';
import Job from '../Job/Job';
import Location from '../Location/Location';
import Skill from '../Skill/Skill';
import Staff from '../Staff/Staff';
import Task from '../Task/Task';
import DashBoard from '../DashBoard/DashBoard';

const Content = () => (
  <div className="col-md-12">
    <Router>
        <div>
        <Route exact path="/" component={DashBoard} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/apply" component={Category} />
        <Route exact path="/candidate" component={Candidate} />
        <Route exact path="/interview" component={Interview} />
        <Route exact path="/job" component={Job} />
        <Route exact path="/location" component={Location} />
        <Route exact path="/skill" component={Skill} />
        <Route exact path="/staff" component={Staff} />
        <Route exact path="/task" component={Task} />
        <Route exact path="/configuration" component={Configuration} />
         
          
        </div>
      </Router>
   
</div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;
