import React, { useEffect, useRef, useState } from 'react';
import './ApplyJob.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import EditApplyJob from '../EditApplyJob/EditApplyJob';
import AddApplyJob from '../AddApplyJob/AddApplyJob';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import applyJobMessage from '../../../main/messages/applyJobMessage';
import applyHTTPService from '../../../main/services/applyHTTPService';
import ApplyJobTestService from "../../../main/mocks/ApplyJobTestService";
import ViewApplyJob from '../ViewApplyJob/ViewApplyJob'
import ViewCandidate from '../../candidate/ViewCandidate/ViewCandidate'
import langJsonFr from "../../../main/local/fr/apply_job.json";
import langJsonEn from "../../../main/local/en/apply_job.json";
import UserSettings from '../../../main/config/user';

const ApplyJob = () => {


  const [applyJobs, setApplyJobs] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    LoadJS()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    applyHTTPService.getAllApply()
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
    forceUpdate()
  }

  const removeApplyAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', 'patientMessage.delete', 'success')
      applyHTTPService.removeApply(data.id).then(data => {
        getAllPatient()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateApplyAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)

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
        <strong className="card-title">Job Applications</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addApplyJob" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
          Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Job offer</th>
              <th>Application Date </th>
              <th>Appreciation</th>
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
                <td>{item.appreciation}</td>
                <td>{item.status}</td>
                <td>

                  <button onClick={e => removeApplyAction(e, item)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Full Name</th>
              <th>Job offer</th>
              <th>Application Date </th>
              <th>Appreciation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </tfoot>

        </table>


        <div class="modal fade" id="addApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddApplyJob closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonAdd} type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditApplyJob applyJob={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


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

ApplyJob.propTypes = {};

ApplyJob.defaultProps = {};

export default ApplyJob;
