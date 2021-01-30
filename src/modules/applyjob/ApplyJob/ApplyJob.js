import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ApplyJob.css';
import AddApplyJob from './../AddApplyJob/AddApplyJob';
import EditApplyJob from './../EditApplyJob/EditApplyJob';
import ViewApplyJob from './../ViewApplyJob/ViewApplyJob';
import ViewCandidate from './../../candidate/ViewCandidate/ViewCandidate';
import { LoadJS } from '../../../libraries/datatables/datatables';
import ApplyJobService from '../../../main/services/ApplyJobService';


const deleteApplyJob = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cet candidat ?")
}


const ApplyJob = () => {
  
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    LoadJS()
    //retrieveJobs()
  }, []);
  
  const getAll = () => {
    ApplyJobService.getAll()
      .then(response => {
        setJobs(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Demande d'emplois</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nom de demandeur</th>
              <th>Emplois</th>
              <th>Lieu</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Martine Clavette</td>
              <td>développeur wrb</td>
              <td>Paris</td>
              <td className="badge badge-success">Acceptée</td>
              <td>
                <button type="button" data-toggle="modal" data-target="#viewCandidate" class="btn btn-info btn-sm"><i class="fas fa-user"></i></button>
                <button type="button" data-toggle="modal" data-target="#editApplyJob" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteApplyJob}><i class="fas fa-trash-alt"></i></button></td>



            </tr></tbody>
          <tfoot>
            <tr>
              <th>Nom de demandeur</th>
              <th>Emplois</th>
              <th>Lieu</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addApplyJob" className="btn btn-success btn-sm">Ajouter</button>

        <div class="modal fade" id="addApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Ajouter demande d'emploi</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddApplyJob />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editApplyJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Editer demande d'emploi</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditApplyJob />
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
                <h5 class="modal-title" id="exampleModalLongTitle">Voir profil</h5>
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
