import React from 'react';
import PropTypes from 'prop-types';
import './ApplyJob.css';

const ApplyJob = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Demande d'emplois</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom de demandeur</th>
                    <th>Emplois</th>
                    <th>Lieu</th>
                    <th>Statut</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Anis</td>
                    <td>developpeur</td>
                    <td>Paris</td>
                    <td>1Active</td>
                    
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

ApplyJob.propTypes = {};

ApplyJob.defaultProps = {};

export default ApplyJob;
