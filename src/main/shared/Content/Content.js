import React from 'react';
import './Content.css';
import Configuration from '../../../modules/shared/Configuration/Configuration';

import Category from '../../../modules/category/Category/Category';
import Candidate from '../../../modules/candidate/Candidate/Candidate';
import Interview from '../../../modules/interview/Interview/Interview';
import Job from '../../../modules/job/Job/Job';
import Location from '../../../modules/location/Location/Location';
import Skill from '../../../modules/skill/Skill/Skill';
import Staff from '../../../modules/staff/Staff/Staff';
import Task from '../../../modules/task/Task/Task';
import DashBoard from '../../../modules/shared/DashBoard/DashBoard';
import {  Route } from "react-router-dom"
import ApplyJob from '../../../modules/applyjob/ApplyJob/ApplyJob';

const Content = () => (
  <div className="col-md-12">
    
        
        <Route exact path="/" component={DashBoard} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/apply" component={ApplyJob} />
        <Route exact path="/candidate" component={Candidate} />
        <Route exact path="/interview" component={Interview} />
        <Route exact path="/job" component={Job} />
        <Route exact path="/location" component={Location} />
        <Route exact path="/skill" component={Skill} />
        <Route exact path="/staff" component={Staff} />
        <Route exact path="/task" component={Task} />
        <Route exact path="/configuration" component={Configuration} />
         
          
  
     
   
</div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;
