import React, { useEffect, useState } from 'react';
import './ApplyJob.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import EditApplyJob from '../EditApplyJob/EditApplyJob';
import AddApplyJob from '../AddApplyJob/AddApplyJob';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import applyJobMessage from '../../../main/messages/applyJobMessage';
import HTTPService from '../../../main/services/HTTPService';
import ApplyJobTestService from "../../../main/mocks/ApplyJobTestService";
import ViewApplyJob from '../ViewApplyJob/ViewApplyJob'
import ViewCandidate from '../../candidate/ViewCandidate/ViewCandidate'
import langJsonFr from "../../../main/local/fr/apply_job.json";
import langJsonEn from "../../../main/local/en/apply_job.json";
import User from '../../../main/config/user';

const ApplyJob = () => {


  const [applyJobs, setJobs] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const [fields, setFields] = useState([]);

  const loadFields = (lang) => {

    switch (lang) {
      case "fr":
        setFields(langJsonFr)
        break;
      case "en":
        setFields(langJsonEn)
        break;
    }


  }


  useEffect(() => {
    loadFields(User.USER_LANG)
    console.log(fields)
    LoadJS()
    retrieveJobs()
  }, []);


  const getAll = () => {
    HTTPService.getAll()
      .then(response => {
        setJobs(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeOne = (data) => {
    HTTPService.remove(data)
      .then(response => {

      })
      .catch(e => {

      });
  }



  const retrieveJobs = () => {
    var applyJobs = ApplyJobTestService.getAll();
    setJobs(applyJobs);
  };

  const resfresh = () => {
    retrieveJobs()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', applyJobMessage.delete, 'success')
      ApplyJobTestService.remove(data)
      //removeOne(data)
      resfresh()
    }

  }

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfresh()
  }




  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Demande d'emplois</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>{fields.field1}</th>
              <th>{fields.field2}</th>
              <th>{fields.field3}</th>
              <th>{fields.field4}</th>
            </tr>
          </thead>
          <tbody>
            {applyJobs.map(item =>
              <tr>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editApplyJob" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, applyJobs.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Nom de demandeur</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addApplyJob" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
 Ajouter</button>

        <div class="modal fade" id="addApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddApplyJob />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

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
                <EditApplyJob applyJob={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

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
