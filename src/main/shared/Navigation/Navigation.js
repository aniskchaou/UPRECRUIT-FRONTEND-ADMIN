import React from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <aside id="left-panel" className="left-panel">
      <div className="workspace-nav-card">
        <h3 className="workspace-nav-title">Company Admin Portal</h3>
        <p className="workspace-nav-subtitle">Manage your recruitment, team, and company operations in one place.</p>
        <div className="workspace-nav-metrics">
          <span>16 Open roles</span>
          <span>342 Candidates</span>
        </div>
      </div>
      <nav className="navbar navbar-expand-sm navbar-default">
        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">

            {/* ── OVERVIEW ── */}
            <li className="nav-section-label">Overview</li>
            <li>
              <NavLink activeClassName="activeLink" to="/dashboard">
                <i className="menu-icon fa fa-home"></i>Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/profile">
                <i className="menu-icon fa fa-user"></i>My Profile
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/billing">
                <i className="menu-icon fa fa-credit-card"></i>Billing &amp; Subscription
              </NavLink>
            </li>

            {/* ── COMPANY ── */}
            <li className="nav-section-label">Company</li>
            <li>
              <NavLink activeClassName="activeLink" to="/company">
                <i className="menu-icon fa fa-building"></i>Company Profile
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/organization">
                <i className="menu-icon fa fa-sitemap"></i>Organization Structure
              </NavLink>
            </li>

            {/* ── TEAM ── */}
            <li className="nav-section-label">Team</li>
            <li>
              <NavLink activeClassName="activeLink" to="/users">
                <i className="menu-icon fa fa-user-friends"></i>Team Members
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/roles">
                <i className="menu-icon fa fa-shield-alt"></i>Roles &amp; Permissions
              </NavLink>
            </li>

            {/* ── RECRUITMENT ── */}
            <li className="nav-section-label">Recruitment</li>
            <li>
              <NavLink activeClassName="activeLink" to="/apply">
                <i className="menu-icon fa fa-envelope-open-text"></i>Applications
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/candidate">
                <i className="menu-icon fa fa-users"></i>Candidates
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/talent-pool">
                <i className="menu-icon fa fa-star"></i>Talent Pool
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="activeLink" to="/approval-workflow">
                <i className="menu-icon fa fa-clipboard-check"></i>Approval Workflow
              </NavLink>
            </li>

            {/* ── INTERVIEWS & ASSESSMENTS ── */}
            <li className="nav-section-label">Interviews &amp; Assessments</li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/assessment">
                <i className="menu-icon fa fa-clipboard-check"></i>Assessments
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/offers">
                <i className="menu-icon fa fa-file-contract"></i>Offer Management
              </NavLink>
            </li>

            {/* ── TALENT ── */}
            <li className="nav-section-label">Talent Programs</li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/referral">
                <i className="menu-icon fa fa-hand-holding-heart"></i>Employee Referrals
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/mobility">
                <i className="menu-icon fa fa-arrows-alt"></i>Internal Hiring
              </NavLink>
            </li>

            {/* ── ANALYTICS ── */}
            <li className="nav-section-label">Analytics &amp; Reports</li>
            <li>
              <NavLink activeClassName="activeLink" to="/job-analytics">
                <i className="menu-icon fa fa-chart-bar"></i>Job Analytics
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/candidate-analytics">
                <i className="menu-icon fa fa-user-chart"></i>Candidate Analytics
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/job-application-analytics">
                <i className="menu-icon fa fa-chart-line"></i>Application Analytics
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/analytics">
                <i className="menu-icon fa fa-analytics"></i>Advanced Reports
              </NavLink>
            </li>

            {/* ── OPERATIONS ── */}
            <li className="nav-section-label">Operations</li>
            <li>
              <NavLink activeClassName="activeLink" to="/communication">
                <i className="menu-icon fa fa-paper-plane"></i>Communication
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/enterprise/integrations">
                <i className="menu-icon fa fa-plug"></i>Integrations
              </NavLink>
            </li>

            {/* ── SETTINGS ── */}
            <li className="nav-section-label">Settings</li>
            <li>
              <NavLink activeClassName="activeLink" to="/security">
                <i className="menu-icon fa fa-shield-alt"></i>Security
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/configuration">
                <i className="menu-icon fa fa-cogs"></i>Configuration
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="activeLink" to="/audit-logs">
                <i className="menu-icon fa fa-history"></i>Audit Logs
              </NavLink>
            </li>

          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Navigation;
