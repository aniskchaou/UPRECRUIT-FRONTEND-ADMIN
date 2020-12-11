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
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Paris</td>
                    <td>France</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
                  </tr></tbody>
    </table>
    <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Location.propTypes = {};

Location.defaultProps = {};

export default Location;
