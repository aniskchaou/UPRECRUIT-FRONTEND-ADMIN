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
import { Route } from "react-router-dom"
import ApplyJob from '../../../modules/applyjob/ApplyJob/ApplyJob';
import Login from '../Login/Login';
import User from '../../config/user';
import AddJob from '../../../modules/job/AddJob/AddJob';
import AddInterview from '../../../modules/interview/AddInterview/AddInterview';
import AddTask from '../../../modules/task/AddTask/AddTask';
import Profile from '../../../modules/shared/Profile/Profile';

const Content = (props) => (
  <div style={{ display: (User.CONNECTED_USER ? 'block' : 'none') }} className="content" >
    <div className="animated fadeIn">
      <div className="row">
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
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/add-job" component={AddJob} />
          <Route exact path="/add-task" component={AddTask} />
          <Route exact path="/add-interview" component={AddInterview} />




        </div>
      </div>
    </div>
  </div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;
