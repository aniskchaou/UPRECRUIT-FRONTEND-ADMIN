import React from 'react';
import PropTypes from 'prop-types';
import './Category.css';

const Category = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Catégories d'emplois</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Remarque</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Ingenieur</td>
                    <td>daniel</td>
                    <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>


                  </tr></tbody>
    </table>
    <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

Category.propTypes = {};

Category.defaultProps = {};

export default Category;
