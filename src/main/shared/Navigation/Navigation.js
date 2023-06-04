import React from 'react';
import './Navigation.css';
import { NavLink } from "react-router-dom"
import User from '../../config/user';

const Navigation = (props) => {


  return (
    <aside style={{ display: (User.CONNECTED_USER ? 'block' : 'none') }} id="left-panel" className="left-panel">
      <nav className="navbar navbar-expand-sm navbar-default">

        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li >
              <NavLink activeClassName="activeLink" to="/dashboard"><i className="menu-icon fa fa-laptop"></i>Dashboard </NavLink>
            </li>
            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-bullseye"></i>Applications</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/apply">Job Application <span className="badge badge-primary">5</span> </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/company">Companies</NavLink>
                </li>
              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-bars"></i>Recruitement</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/initial-qualification">Initial Qualification</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/first-interview">First Interview </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/second-interview">Second Interview </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/contract-proposal">Contract proposal </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/contract-signed">Contract signed</NavLink>
                </li>

              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-user"></i>Candidates</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/candidate">Candidates </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/language">Languges </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/degree">Degree </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/experience">Experience </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/education">Educations </NavLink>
                </li>
              </ul>
            </li>




            <li >
              <NavLink activeClassName="activeLink" to="/interview"><i className="menu-icon fa fa-address-card"></i>Interviews  <span className="badge badge-warning">2</span> </NavLink>
            </li>
            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-user-circle"></i>Job Offers</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/job">Job Offers </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/skill">Skills </NavLink>
                </li>
                {/*  <li >
                  <NavLink activeClassName="activeLink" to="/category">Category </NavLink>
                </li> */}

                <li >
                  <NavLink activeClassName="activeLink" to="/location">Locations </NavLink>
                </li>

              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-blind"></i>HR</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/users">Teams </NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/roles">Roles </NavLink>
                </li>
              </ul>
            </li>
            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-folder"></i>CMS</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/header">Header Section</NavLink>
                </li>

                <li >
                  <NavLink activeClassName="activeLink" to="/footer">Footer Section</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/summary">Summary Section</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/newsletter">Newsletters Section</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/testimonials">Testimonials </NavLink>
                </li>

                <li >
                  <NavLink activeClassName="activeLink" to="/newsletters">Newsletters</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/service">Services </NavLink>
                </li>

              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-comment"></i>FeedBacks</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/refusal">Refusal</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/acceptance">Acceptence</NavLink>
                </li>
              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-handshake"></i>Contracts</a>
              <ul class="sub-menu children dropdown-menu">
                {/*  <li >
                  <NavLink activeClassName="activeLink" to="/type-contract"> contracts Types</NavLink>
                </li> */}
                <li >
                  <NavLink activeClassName="activeLink" to="/contract-signed">Contracts</NavLink>
                </li>
              </ul>
            </li>

            <li >
              <NavLink activeClassName="activeLink" to="/todo"><i className="menu-icon fa fa-tasks"></i>Tasks </NavLink>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-handshake"></i>Charts</a>
              <ul class="sub-menu children dropdown-menu">
                <li >
                  <NavLink activeClassName="activeLink" to="/job-analytics"> Job</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/job-application-analytics">Job Applications</NavLink>
                </li>
                <li >
                  <NavLink activeClassName="activeLink" to="/candidate-analytics">Candidate</NavLink>
                </li>
              </ul>
            </li>




            <li >
              <NavLink activeClassName="activeLink" to="/configuration"><i className="menu-icon fa fa-cogs"></i>Settings </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
};

Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
