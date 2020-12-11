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
                    <th>Actions</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>anis@gmail.com</td>
                    <td>recruiter</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
                    
                 
                  </tr></tbody>
                  </table>
                  <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Staff.propTypes = {};

Staff.defaultProps = {};

export default Staff;
