import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Degree.css';
import AddDegree from '../AddDegree/AddDegree'
import degreeHTTPService from '../../main/services/degreeHTTPService'
import showMessage from '../../libraries/messages/messages';
import EditDegree from '../../components/EditDegree/EditDegree'
import { LoadJS } from '../../libraries/datatables/datatables';

const Degree = () => {
  const [degrees, setDegree] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  //const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJS()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    degreeHTTPService.getAllDegree()
      .then(response => {
        setDegree(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfresh = () => {
    getAllPatient()
    //forceUpdate()
  }

  const removePatientAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', ' patientMessage.delete', 'success')
      degreeHTTPService.removeDegree(data).then(data => {
        resfresh()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    // resfresh()
  }

  const closeModalEdit = (data) => {
    resfresh()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    resfresh()
    closeButtonAdd.current.click()
  }

  return (

    <div className="card">

      <div className="card-header">
        <strong className="card-title">Degrees</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
          Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Level</th>
              <th>Univesity</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {degrees.map(item => (
              <tr>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.level}</td>
                <td>{item.university}</td>
                <td>{item.location}</td>
                <td>
                  <button onClick={e => updatePatientAction(e, item)} type="button" data-toggle="modal" data-target="#editCategory" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removePatientAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>))}


          </tbody>
          <tfoot>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Level</th>
              <th>Univesity</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </tfoot>

        </table>


        <div className="modal fade" id="editCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditDegree degree={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div className="modal-footer">
                <button ref={closeButtonEdit} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">New</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddDegree closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button ref={closeButtonAdd} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};

Degree.propTypes = {};

Degree.defaultProps = {};

export default Degree;
