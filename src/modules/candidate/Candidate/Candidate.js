import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Candidate.css';
import EditCandidate from './../EditCandidate/EditCandidate';
import { LoadJS } from './../../../libraries/datatables/datatables';
import ViewCandidate from '../ViewCandidate/ViewCandidate';
import useForceUpdate from 'use-force-update';
import candidateHTTPService from '../../../main/services/candidateHTTPService'
import showMessage from '../../../libraries/messages/messages';

const Candidate = () => {

  const [candidates, setCandidates] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const closeButtonEdit = useRef(null);
  //const closeButtonAdd = useRef(null);


  useEffect(() => {
    LoadJS()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    // setLoading(true);
    candidateHTTPService.getAllCandidate()
      .then(response => {
        setCandidates(response.data);
        // setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };




  const removeCandidateAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Are you sure ?");
    if (r) {
      //showMessage('Confirmation', 'patientMessage.delete', 'success')
      candidateHTTPService.removeCandidate(data.id).then(() => {
        getAllPatient()
      }).catch(e => {
        //showMessage('Confirmation', e, 'warning')
        console.log(e)
      });
    }
  }

  const updateCandidateAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)

  }

  const viewCandidateAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    // resfreshComponent()
  }

  const closeModalEdit = (data) => {
    getAllPatient()
    closeButtonEdit.current.click()
  }

  /*   const closeModalAdd = (data) => {
      getAllPatient()
      closeButtonAdd.current.click()
    }
   */

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Candidates</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>LastName</th>
              <th>Email</th>
              <th>Gender</th>
              <th>City</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tbody>

            {candidates.map(item =>
              <tr>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.gender}</td>
                <td>{item.city}</td>
                <td>
                  <button onClick={e => viewCandidateAction(e, item)} type="button" data-toggle="modal" data-target="#viewCandidate" class="btn btn-primary btn-sm"><i class="fas fa-eye"></i></button>
                  <button onClick={e => updateCandidateAction(e, item)} type="button" data-toggle="modal" data-target="#editCandidate" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removeCandidateAction(e, item)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Firstname</th>
              <th>LastName</th>
              <th>Email</th>
              <th>Gender</th>
              <th>City</th>
              <th>Actions</th>


            </tr>
          </tfoot>
        </table>

        <div class="modal fade" id="editCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditCandidate candidate={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>



        <div class="modal fade" id="viewCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">View</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewCandidate candidate={updatedItem} />
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

Candidate.propTypes = {};

Candidate.defaultProps = {};

export default Candidate;
