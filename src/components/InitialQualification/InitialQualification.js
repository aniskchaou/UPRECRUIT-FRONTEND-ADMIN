
import PropTypes from 'prop-types';
import './InitialQualification.css';
import React, { useEffect, useRef, useState } from 'react';
import applyHTTPService from '../../main/services/applyHTTPService';
import showMessage from '../../libraries/messages/messages';
import ViewCandidate from '../../modules/candidate/ViewCandidate/ViewCandidate';
import ViewApplyJob from '../../modules/applyjob/ViewApplyJob/ViewApplyJob';
import { LoadJS } from '../../libraries/datatables/datatables';
const InitialQualification = () => {

  const [applyJobs, setApplyJobs] = useState([]);
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
    applyHTTPService.getAllInitialQualification()
      .then(response => {
        setApplyJobs(response.data);
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

  const removeApplyAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', 'patientMessage.delete', 'success')
      applyHTTPService.removeApply(data).then(data => {
        resfresh()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateApplyAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfresh()
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
        <strong className="card-title">Initial Qualifications</strong>
      </div>
      <div className="card-body">
        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Job offer</th>
              <th>Date </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applyJobs.map(item =>
              <tr>
                <td>{item.condidate}</td>
                <td>{item.jobOffer}</td>
                <td>{item.dateApplication}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={e => updateApplyAction(e, item)} type="button" data-toggle="modal" data-target="#editApplyJob" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removeApplyAction(e, applyJobs.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Full Name</th>
              <th>Job Offer</th>
              <th>Date </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </tfoot>

        </table>





        <div class="modal fade" id="viewCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewCandidate />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Documents</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewApplyJob />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
};

InitialQualification.propTypes = {};

InitialQualification.defaultProps = {};

export default InitialQualification;
