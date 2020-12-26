import React from 'react';
import PropTypes from 'prop-types';
import './Category.css';
import AddCategory from './../AddCategory/AddCategory';
import EditCategory from './../EditCategory/EditCategory';
const deleteCategory = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}


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
            <td>
              <button type="button" data-toggle="modal" data-target="#editCategory" className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
              <button type="button" className="btn btn-danger btn-sm" onClick={deleteCategory}><i className="fas fa-trash-alt"></i></button></td>


          </tr></tbody>
      </table>
      <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-success btn-sm">Ajouter</button>

      <div className="modal fade" id="editCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <EditCategory />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
               <AddCategory/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

Category.propTypes = {};

Category.defaultProps = {};

export default Category;
