import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Staff.css';
import AddStaff from './../AddStaff/AddStaff';
import EditStaff from './../EditStaff/EditStaff';
import ViewStaff from './../ViewStaff/ViewStaff';
import { LoadJS } from './../../../libraries/datatables/datatables';
const deleteStaff = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer  ?")
}

const Staff = () => {

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


  return (
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
              <td>GregoireMoquin@armyspy.com</td>
              <td>recruteur</td>
              <td>
                <button type="button" data-toggle="modal" data-target="#editTask" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteStaff}><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            <tr>
              <td>GAviceRouze@teleworm.us</td>
              <td>assistant</td>
              <td>
                <button type="button" data-toggle="modal" data-target="#editTask" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteStaff}><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            </tbody>
        </table>
        <button type="button" data-toggle="modal" data-target="#addStaff" className="btn btn-success btn-sm">Ajouter</button>


        <div class="modal fade" id="addStaff" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddStaff />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editStaff" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditStaff />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="viewStaff" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewStaff />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Staff.propTypes = {};

Staff.defaultProps = {};

export default Staff;
