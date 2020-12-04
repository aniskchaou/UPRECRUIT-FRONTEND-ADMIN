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
                    
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>tache 1</td>
                    <td>terminer</td>
                   
                    
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Task.propTypes = {};

Task.defaultProps = {};

export default Task;
