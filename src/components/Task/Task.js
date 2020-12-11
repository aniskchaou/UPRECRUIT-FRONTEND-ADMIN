import React from 'react';
import PropTypes from 'prop-types';
import './Task.css';

const Task = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Taches</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Statut</th>
                    <th>Actions</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>tache 1</td>
                    <td>terminer</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
                    
                 
                  </tr></tbody>
    </table>
    <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Task.propTypes = {};

Task.defaultProps = {};

export default Task;
