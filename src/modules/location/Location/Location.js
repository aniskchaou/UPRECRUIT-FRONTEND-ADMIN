import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Location.css';
import AddLocation from './../AddLocation/AddLocation';
import EditLocation from './../EditLocation/EditLocation';
import ViewLocation from './../ViewLocation/ViewLocation';
import { LoadJS } from './../../../libraries/datatables/datatables';

const deleteLocation=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Location = () =>{

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


 return(
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Lieux de travail</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead>
                  <tr>
                    <th>Lieu</th>
                    <th>Pays</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Paris</td>
                    <td>France</td>
                    <td>
              <button type="button" data-toggle="modal" data-target="#editLocation"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteLocation}><i class="fas fa-trash-alt"></i></button></td>
                  </tr></tbody>
    </table>
       <button type="button" data-toggle="modal" data-target="#addLocation" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
 Ajouter</button>


    <div class="modal fade" id="addLocation" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <AddLocation />
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="editLocation" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <EditLocation/>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="viewLocation" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ViewLocation />
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
)};

Location.propTypes = {};

Location.defaultProps = {};

export default Location;
