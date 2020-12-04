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
                  
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Ingenieur</td>
                    <td>dani</td>
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Category.propTypes = {};

Category.defaultProps = {};

export default Category;
