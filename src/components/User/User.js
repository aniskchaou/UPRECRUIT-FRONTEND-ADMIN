import React from 'react';
import PropTypes from 'prop-types';
import './User.css';
import EditUser from './../EditUser/EditUser';
import ViewUser from './../ViewUser/ViewUser';
const deleteUser=()=>{

    return  window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
}
const User = () => (
  <div className="card">
  <div className="card-header">
      <strong className="card-title">Utilisateurs</strong>
  </div>
  <div className="card-body">
      <table id="bootstrap-data-table" className="table table-striped table-bordered">
          <thead>
              <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>Tiger Nixon</td>
                  <td>tiger@gmail.com</td>
                  <td>355355353</td>
                  <td><button type="button" data-toggle="modal" data-target="#viewUser" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editUser"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteUser}><i class="fas fa-trash-alt"></i></button></td>
              </tr>
             
          </tbody>
      </table>
     
      

      <div class="modal fade" id="editUser" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <EditUser />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="viewUser" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ViewUser/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>



  </div>
</div>
);

User.propTypes = {};

User.defaultProps = {};

export default User;
