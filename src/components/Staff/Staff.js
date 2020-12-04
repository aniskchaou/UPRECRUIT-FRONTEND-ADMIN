import React from 'react';
import PropTypes from 'prop-types';
import './Staff.css';

const Staff = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Equipes</strong>
  </div>
  <div className="card-body">
  <table id="example1" className="table table-striped table-bordered">
  <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>anis@gmail.com</td>
                    <td>recruiter</td>
                   
                    
                 
                  </tr></tbody>
                  </table>
  </div>
</div>
);

Staff.propTypes = {};

Staff.defaultProps = {};

export default Staff;
