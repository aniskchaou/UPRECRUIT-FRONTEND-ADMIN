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

import AddJob from '../../../modules/job/AddJob/AddJob';
import AddInterview from '../../../modules/interview/AddInterview/AddInterview';
import AddTask from '../../../modules/task/AddTask/AddTask';
import Profile from '../../../modules/shared/Profile/Profile';
import Company from '../../../components/Company/Company'
import FirstInterview from '../../../components/FirstInterview/FirstInterview';
import SecondInterview from '../../../components/SecondInterview/SecondInterview';
import InitialQualification from '../../../components/InitialQualification/InitialQualification';
import ContractProposal from '../../../components/ContractProposal/ContractProposal';
import ContractSigned from '../../../components/ContractSigned/ContractSigned';
import Degree from '../../../components/Degree/Degree'
import Language from '../../../components/Language/Language'
import Experience from '../../../components/Experience/Experience'
import Education from '../../../components/Education/Education'
import RenewalContract from '../../../components/RenewalContract/RenewalContract'
import TypeContract from '../../../components/TypeContract/TypeContract'
import RefusalFeedBack from '../../../components/RefusalFeedBack/RefusalFeedBack'
import AcceptanceFeedBack from '../../../components/AcceptanceFeedBack/AcceptanceFeedBack'
import Roles from '../../../components/Roles/Roles'
import ToDo from '../../../components/ToDo/ToDo'

import HeaderPage from '../../../components/HeaderPage/HeaderPage'
import JobsPage from '../../../components/JobsPage/JobsPage'
import CompaniesPage from '../../../components/CompaniesPage/CompaniesPage'
import ServicePage from '../../../components/ServicePage/ServicePage'
import SummaryPage from '../../../components/SummaryPage/SummaryPage'
import FooterPage from '../../../components/FooterPage/FooterPage'
import TestimonialPage from '../../../components/TestimonialPage/TestimonialPage'
import NewsLetterPage from '../../../components/NewsLetterPage/NewsLetterPage'
import NewsLetter from '../../../components/NewsLetter/NewsLetter'
import JobAnalytics from '../../../components/JobAnalytics/JobAnalytics'
import JobApplicationAnalytics from '../../../components/JobApplicationAnalytics/JobApplicationAnalytics';
import CandidateAnalytics from '../../../components/CandidateAnalytics/CandidateAnalytics'
import UserSettings from '../../config/user';
import User from '../../../modules/user/User/User'
const Content = (props) => (
  <div className="content" style={{ display: (UserSettings.CONNECTED_USER ? 'block' : 'none') }} >
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
          <Route exact path="/company" component={Company} />
          <Route exact path="/first-interview" component={FirstInterview} />
          <Route exact path="/second-interview" component={SecondInterview} />
          <Route exact path="/initial-qualification" component={InitialQualification} />
          <Route exact path="/contract-proposal" component={ContractProposal} />
          <Route exact path="/contract-signed" component={ContractSigned} />
          <Route exact path="/todo" component={ToDo} />
          <Route exact path="/language" component={Language} />
          <Route exact path="/degree" component={Degree} />
          <Route exact path="/experience" component={Experience} />
          <Route exact path="/education" component={Education} />
          <Route exact path="/contract-renewal" component={RenewalContract} />
          <Route exact path="/type-contract" component={TypeContract} />
          <Route exact path="/users" component={User} />
          <Route exact path="/roles" component={Roles} />
          <Route exact path="/refusal" component={RefusalFeedBack} />
          <Route exact path="/acceptance" component={AcceptanceFeedBack} />
          <Route exact path="/header" component={HeaderPage} />
          <Route exact path="/jobs" component={JobsPage} />
          <Route exact path="/companies" component={CompaniesPage} />
          <Route exact path="/service" component={ServicePage} />
          <Route exact path="/summary" component={SummaryPage} />
          <Route exact path="/testimonials" component={TestimonialPage} />
          <Route exact path="/newsletter" component={NewsLetterPage} />
          <Route exact path="/newsletters" component={NewsLetter} />
          <Route exact path="/footer" component={FooterPage} />

          <Route exact path="/job-analytics" component={JobAnalytics} />
          <Route exact path="/job-application-analytics" component={JobApplicationAnalytics} />
          <Route exact path="/candidate-analytics" component={CandidateAnalytics} />
        </div>
      </div>
    </div>
  </div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;
