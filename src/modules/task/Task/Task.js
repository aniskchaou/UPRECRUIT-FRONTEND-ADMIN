import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Task.css';
import AddTask from '../AddTask/AddTask';
import EditTask from "../EditTask/EditTask";
import ViewTask from "../ViewTask/ViewTask";
import { LoadJS } from './../../../libraries/datatables/datatables';
import TaskTestService from '../../../main/mocks/TaskTestService';
import showMessage from '../../../libraries/messages/messages';
import jobMessage from '../../../main/messages/jobMessage';
import useForceUpdate from 'use-force-update';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}


const Task = () => {

  const [tasks, setTask] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    LoadJS()
    retrievetasks()
  }, []);


  const getAll = () => {
    TaskTestService.getAll()
      .then(response => {
        setTask(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };



  const retrievetasks = () => {
    var tasks = TaskTestService.getAll();
    setTask(tasks);
  };

  const resfresh = () => {
    retrievetasks()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', jobMessage.delete, 'success')
      TaskTestService.remove(data)
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
            {tasks.map(item =>
              <tr>
                <td>{item.title}</td>
                <td><span class="badge badge-success">en cours</span></td>
                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editTask" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, tasks.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Actions</th>

            </tr>
          </tfoot>
        </table>
        <button type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#addTask"><i class="fas fa-plus"></i>
  Ajouter</button>

        <div class="modal fade" id="addTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddTask />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditTask task={updatedItem} />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
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
                <ViewTask />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>




      </div>
    </div>
  )
};

Task.propTypes = {};

Task.defaultProps = {};

export default Task;
