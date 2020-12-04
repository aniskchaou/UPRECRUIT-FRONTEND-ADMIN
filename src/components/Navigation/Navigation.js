import React from 'react';
import PropTypes from 'prop-types';
import './Navigation.css';

const Navigation = () => (
  <aside id="left-panel" className="left-panel">
      <nav className="navbar navbar-expand-sm navbar-default">

        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li className="active">
              <a href="/dashboard"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </a>
            </li>
            <li>
              <a href="/apply"><i className="menu-icon fa fa-laptop"></i>Demande emplois </a>
            </li>
            <li>
              <a href="/candidate"><i className="menu-icon fa fa-laptop"></i>Candidats </a>
            </li>
            <li>
              <a href="/category"><i className="menu-icon fa fa-laptop"></i>Categorie d'emplois </a>
            </li>
            <li>
              <a href="/interview"><i className="menu-icon fa fa-laptop"></i>Entretien </a>
            </li>
            <li>
              <a href="/job"><i className="menu-icon fa fa-laptop"></i>Emplois </a>
            </li>
            <li>
              <a href="/location"><i className="menu-icon fa fa-laptop"></i>Location </a>
            </li>
            <li>
              <a href="/skill"><i className="menu-icon fa fa-laptop"></i>Compétences </a>
            </li>
            <li>
              <a href="/staff"><i className="menu-icon fa fa-laptop"></i>Equipes </a>
            </li>
            <li>
              <a href="/task"><i className="menu-icon fa fa-laptop"></i>Taches </a>
            </li>
            <li>
              <a href="/configuration"><i className="menu-icon fa fa-laptop"></i>Paramètres </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
);

Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
