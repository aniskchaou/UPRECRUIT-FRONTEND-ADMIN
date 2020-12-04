import React from 'react';
import PropTypes from 'prop-types';
import './Location.css';

const Location = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Location</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Lieu</th>
                    <th>Pays</th>
                  
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Paris</td>
                    <td>France</td>
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Location.propTypes = {};

Location.defaultProps = {};

export default Location;
