import React, { useEffect, useState } from 'react';
import './Job.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import EditJob from '../EditJob/EditJob';
import AddJob from '../AddJob/AddJob';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import jobMessage from '../../../main/messages/jobMessage';
import JobTestService from '../../../main/mocks/JobTestService';
import HTTPService from '../../../main/services/HTTPService';

const Job = () => {
  
  const [jobs, setJobs] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
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
    var jobs = JobTestService.getAll();
    setJobs(jobs);
  };

  const resfresh = () => {
    retrieveJobs()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', jobMessage.delete, 'success')
      JobTestService.remove(data)
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
        <strong className="card-title">Offres d'emploi</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Poste</th>
              <th>Lieu</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(item =>
              <tr>
                <td>{item.post}</td>
                <td>{item.location}</td>
                <td>{item.start}</td>
                <td>{item.end}</td>
                <td class="badge badge-success">{item.state}</td>

                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editJob" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, jobs.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>


              </tr>


            )}
            <tr>
              <td>Développeur Web</td>
              <td>Paris</td>
              <td>11/10/2020</td>
              <td>11/11/2020</td>
              <td class="badge badge-success">Actif</td>

              <td>
                <button type="button" data-toggle="modal" data-target="#editJob" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
            </tr>

          </tbody>
          <tfoot>
            <tr>
              <th>Poste</th>
              <th>Lieu</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Statut</th>
              <th>Actions</th>

            </tr>
          </tfoot>
        </table>
        <button type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#addJob"><i class="fas fa-plus"></i>
 Ajouter</button>

        <div class="modal fade" id="addJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><i class="fas fa-plus"></i> Nouveau</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddJob />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditJob job={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfresh} class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
}
  ;

Job.propTypes = {};

Job.defaultProps = {};

export default Job;
