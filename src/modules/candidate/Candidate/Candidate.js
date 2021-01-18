import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Candidate.css';
import EditCandidate from './../EditCandidate/EditCandidate';
import { LoadJS } from './../../../libraries/datatables/datatables';

const deleteCandidate=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette utilisateur ?")
}

const Candidate = () =>{

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


 return(
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Candidats</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Nom de l'applicant</th>
            <th>Emploi</th>
            <th>Adresse</th>
            <th>Date de naissance</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dominique Giroux</td>
            <td>développeur Web</td>
            <td>26, Avenue des Pr'es 03100 MONTLUÇON</td>
            <td>1/5/1990</td>
            <td><button type="button" data-toggle="modal" data-target="#viewCandidate" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editCandidate" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteCandidate}><i class="fas fa-trash-alt"></i></button></td>



          </tr></tbody>
          <tfoot>
          <tr>
            <th>Nom de l'applicant</th>
            <th>Emploi</th>
            <th>Adresse</th>
            <th>Date de naissance</th>
            <th>Actions</th>

          </tr>
        </tfoot>
      </table>
     
      <div class="modal fade" id="addCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="editCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <EditCandidate />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="viewCandidate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

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

Candidate.propTypes = {};

Candidate.defaultProps = {};

export default Candidate;
