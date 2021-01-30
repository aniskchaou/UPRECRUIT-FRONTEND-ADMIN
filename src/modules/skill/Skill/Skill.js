import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Skill.css';
import AddSkill from './../AddSkill/AddSkill';
import { LoadJS } from './../../../libraries/datatables/datatables';

const deleteSkill = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}


const Skill = () => {

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Compétences</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Compétences</th>
              <th>Catégories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Java</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteSkill}><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            <tr>
              <td>PHP</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteSkill}><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            <tr>
              <td>Python</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteSkill}><i class="fas fa-trash-alt"></i></button></td>
            </tr>

          </tbody>
          <tfoot>
                  <tr>
                    <th>Compétences</th>
                    <th>Catégories</th>
                    <th>Actions</th>
                  </tr>
                  </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addSkill" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
 Ajouter</button>

        <div class="modal fade" id="addSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddSkill />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Skill.propTypes = {};

Skill.defaultProps = {};

export default Skill;
