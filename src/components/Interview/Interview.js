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
                    <th>Actions</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Anis</td>
                    <td>12/11/2020</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
                    
                 
                  </tr></tbody>
    </table>
    <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Interview.propTypes = {};

Interview.defaultProps = {};

export default Interview;
