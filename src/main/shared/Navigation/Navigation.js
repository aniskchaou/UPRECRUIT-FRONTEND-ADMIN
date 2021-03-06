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
              <NavLink activeClassName="activeLink" to="/dashboard"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/apply"><i className="menu-icon fa fa-briefcase"></i>Demandes emplois <span className="badge badge-primary">5</span> </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/candidate"><i className="menu-icon fa fa-user"></i>Candidats </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/category"><i className="menu-icon fa fa-columns"></i>Categories d'emplois </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/interview"><i className="menu-icon fa fa-award"></i>Entretiens  <span className="badge badge-warning">2</span> </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/job"><i className="menu-icon fa fa-brain"></i>Offres d'emplois </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/location"><i className="menu-icon fa fa-archway"></i>Lieux de travail </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/skill"><i className="menu-icon fa fa-bolt"></i>Compétences </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/staff"><i className="menu-icon fa fa-users"></i>Equipes  <span className="badge badge-info">16</span> </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/task"><i className="menu-icon fa fa-bars"></i>Taches </NavLink>
            </li>
            <li >
              <NavLink activeClassName="activeLink" to="/configuration"><i className="menu-icon fa fa-cog"></i>Paramètres </NavLink>
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
