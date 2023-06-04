import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Education.css';
import AddEducation from '../AddEducation/AddEducation'
import educationHTTPService from '../../main/services/educationHTTPService'
import showMessage from '../../libraries/messages/messages';
import EditEducation from '../../components/EditEducation/EditEducation'
import { LoadJS } from '../../libraries/datatables/datatables';
const Education = () => {
  const [educations, setEducations] = useState([]);
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
    educationHTTPService.getAllEducation()
      .then(response => {
        setEducations(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfresh = () => {
    getAllPatient()
    // forceUpdate()
  }

  const removePatientAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Are You Sure?");
    if (r) {
      showMessage('Confirmation', ' patientMessage.delete', 'success')
      educationHTTPService.removeEducation(data).then(data => {
        resfresh()
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
        <strong className="card-title">Candidates Educations</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
          Create</button>
        <table id="example1" className="table table-striped table-bordered">

          <thead>
            <tr>
              <th>Degree</th>
              <th>University</th>
              <th>Result</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {educations.map(item => (
              <tr>
                <td>{item.degree}</td>
                <td>{item.university}</td>
                <td>{item.result}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>
                  <button onClick={e => updatePatientAction(e, item)} type="button" data-toggle="modal" data-target="#editCategory" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removePatientAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>))}
          </tbody>
          <tfoot>
            <tr>
              <th>Degree</th>
              <th>University</th>
              <th>Result</th>
              <th>Start</th>
              <th>End</th>
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
                {<EditEducation edu={updatedItem} closeModal={closeModalEdit} />}
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
                <AddEducation closeModal={closeModalAdd} />
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

Education.propTypes = {};

Education.defaultProps = {};

export default Education;
