import React from 'react';
import PropTypes from 'prop-types';
import './Interview.css';

const Interview = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Entretiens</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom de l'applicant</th>
                    <th>Date</th>
                    
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Anis</td>
                    <td>12/11/2020</td>
                   
                    
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Interview.propTypes = {};

Interview.defaultProps = {};

export default Interview;
