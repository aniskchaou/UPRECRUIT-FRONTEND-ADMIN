import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './User.css';
import EditUser from './../EditUser/EditUser';
import ViewUser from './../ViewUser/ViewUser';
import { LoadJS } from './../../../libraries/datatables/datatables';
import userHTTPService from '../../../main/services/userHTTPService'
import showMessage from '../../../libraries/messages/messages';
const User = () => {

  const [users, setUsers] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  // const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadJS()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    userHTTPService.getAllUser()
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };

  const removePatientAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      //showMessage('Confirmation', 'patientMessage.delete', 'success')
      userHTTPService.removeUser(data.id).then(data => {
        getAllPatient()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //resfresh()
  }



  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Users</strong>
      </div>
      <div className="card-body">
        <table id="bootstrap-data-table" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(item =>
              <tr>
                <td>{item.username}</td>
                <td>

                  <button onClick={e => removePatientAction(e, item)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}

          </tbody>
          <tfoot>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </tfoot>
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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
                <ViewUser />
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

User.propTypes = {};

User.defaultProps = {};

export default User;
