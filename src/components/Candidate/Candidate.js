import React from 'react';
import PropTypes from 'prop-types';
import './Candidate.css';

const Candidate = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Candidats</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom de l'applicant</th>
                    <th>Emploi</th>
                    
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Anis</td>
                    <td>developpeur</td>
                   
                    
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Candidate.propTypes = {};

Candidate.defaultProps = {};

export default Candidate;
