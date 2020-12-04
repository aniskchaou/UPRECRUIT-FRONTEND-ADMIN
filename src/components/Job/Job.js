import React from 'react';
import PropTypes from 'prop-types';
import './Job.css';

const Job = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Emplois</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Profession</th>
                    <th>Entreprise</th>
                    <th>Lieu</th>
                    <th>Date début</th>
                    <th>Date de fin</th>
                    <th>Statut</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Developpeur</td>
                    <td>France</td>
                    <td>Paris</td>
                    <td>12/10/2020</td>
                    <td>12/11/2020</td>
                    <td>Active</td>
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Job.propTypes = {};

Job.defaultProps = {};

export default Job;
