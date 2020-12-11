import React from 'react';
import PropTypes from 'prop-types';
import './Skill.css';

const Skill = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Compétences</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégories</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Developpeur java</td>
                    <td>Ingenierie</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
                  </tr></tbody>
    </table>
    <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Skill.propTypes = {};

Skill.defaultProps = {};

export default Skill;
