import React from 'react';
import './Navigation.css';
import { Link } from "react-router-dom"

const Navigation = () => (
  <aside id="left-panel" className="left-panel">
      <nav className="navbar navbar-expand-sm navbar-default">

        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li className="active">
              <Link to="/dashboard"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </Link>
            </li>
            <li>
              <Link to="/apply"><i className="menu-icon fa fa-laptop"></i>Demande emplois </Link>
            </li>
            <li>
              <Link to="/candidate"><i className="menu-icon fa fa-laptop"></i>Candidats </Link>
            </li>
            <li>
              <Link to="/category"><i className="menu-icon fa fa-laptop"></i>Categorie d'emplois </Link>
            </li>
            <li>
              <Link to="/interview"><i className="menu-icon fa fa-laptop"></i>Entretien </Link>
            </li>
            <li>
              <Link to="/job"><i className="menu-icon fa fa-laptop"></i>Emplois </Link>
            </li>
            <li>
              <Link to="/location"><i className="menu-icon fa fa-laptop"></i>Location </Link>
            </li>
            <li>
              <Link to="/skill"><i className="menu-icon fa fa-laptop"></i>Compétences </Link>
            </li>
            <li>
              <Link to="/staff"><i className="menu-icon fa fa-laptop"></i>Equipes </Link>
            </li>
            <li>
              <Link to="/task"><i className="menu-icon fa fa-laptop"></i>Taches </Link>
            </li>
            <li>
              <Link to="/configuration"><i className="menu-icon fa fa-laptop"></i>Paramètres </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
);

Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
