import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Task.css';
import AddTask from '../AddTask/AddTask';
import EditTask from "../EditTask/EditTask";
import ViewTask from "../ViewTask/ViewTask";
import { LoadJS } from './../../../libraries/datatables/datatables';

const deleteTask=()=>{
   return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}


const Task = () =>{

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


 return(
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Taches</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>tache 1</td>
            <td class="badge badge-success">terminé</td>
            <td><button type="button" data-toggle="modal" data-target="#viewTask" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editTask"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>


          </tr>
          <tr>
            <td>tache 2</td>
            <td class="badge badge-warning">en cours</td>
            <td><button type="button" data-toggle="modal" data-target="#viewTask" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editTask"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>


          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Actions</th>

          </tr>
        </tfoot>
      </table>
      <button type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#addTask">Ajouter</button>

      <div class="modal fade" id="addTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <AddTask />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="editTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
             <EditTask/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              
            </div>
          </div>
        </div>
      </div>

      
      <div class="modal fade" id="viewTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ViewTask/>
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

Task.propTypes = {};

Task.defaultProps = {};

export default Task;