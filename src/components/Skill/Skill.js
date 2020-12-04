import React from 'react';
import PropTypes from 'prop-types';
import './Skill.css';

const Skill = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Compétences</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégories</th>
                  
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Developpeur java</td>
                    <td>Ingenierie</td>
                 
                  </tr></tbody>
    </table>
  </div>
</div>
);

Skill.propTypes = {};

Skill.defaultProps = {};

export default Skill;
