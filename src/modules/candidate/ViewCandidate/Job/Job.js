import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Job.css';
import EditJob from './../EditJob/EditJob';
import ViewJob from './../ViewJob/ViewJob';
import { LoadJS } from './../../../libraries/datatables/datatables';

const deleteJob=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Job = () =>{

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


 return(
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Emplois</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Profession</th>
                    <th>Entreprise</th>
                    <th>Lieu</th>
                    <th>Date début</th>
                    <th>Date de fin</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Developpeur</td>
                    <td>France</td>
                    <td>Paris</td>
                    <td>12/10/2020</td>
                    <td>12/11/2020</td>
                    <td>Active</td>
                    <td><button type="button" data-toggle="modal" data-target="#viewJob" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editJob"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteJob}><i class="fas fa-trash-alt"></i></button></td>
                  </tr></tbody>
    </table>

    <div class="modal fade" id="viewJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ViewJob/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="editJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <EditJob/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
)};

Job.propTypes = {};

Job.defaultProps = {};

export default Job;
