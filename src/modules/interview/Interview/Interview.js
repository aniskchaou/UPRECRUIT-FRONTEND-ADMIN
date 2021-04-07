import React, { useEffect, useState } from 'react';
import './Interview.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import EditInterview from '../EditInterview/EditInterview';
import AddInterview from '../AddInterview/AddInterview';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import interviewMessage from '../../../main/messages/interviewMessage';
import InterviewTestService from '../../../main/mocks/InterviewTestService';
import HTTPService from '../../../main/services/HTTPService';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ViewInterview from './../ViewInterview/ViewInterview';

const Interview = () => {

  const [interviews, setInterviews] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    LoadJS()
    retrieveInterviews()
  }, []);


  const getAll = () => {
    HTTPService.getAll()
      .then(response => {
        setInterviews(response.data);
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



  const retrieveInterviews = () => {
    var interviews = InterviewTestService.getAll();
    setInterviews(interviews);
  };

  const resfresh = () => {
    retrieveInterviews()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', interviewMessage.delete, 'success')
      InterviewTestService.remove(data)
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
        <strong className="card-title">Entretiens</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nom de l'applicant</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(item =>
              <tr>
                <td>{item.candidates}</td>
                <td>{item.scheduleDate}</td>
                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editInterview" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, interviews.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>  <tfoot>
            <tr>
              <th>Nom de l'applicant</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addInterview" className="btn btn-success btn-sm"><i class="fas fa-plus"></i> Ajouter </button>
        <button type="button" onClick={() => setHidden(!hidden)} className="btn btn-info btn-sm"><i class="fas fa-calendar-alt"></i> Voir les entretiens</button>
        <br />
        <div hidden={hidden}>

          <FullCalendar

            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={[
              { title: 'Entretien developpeur mobile', date: '2021-03-19' },
              { title: 'event 2', date: '2019-04-02' }
            ]}
          />
        </div>
        <div className="modal fade" id="addInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddInterview />
              </div>
              <div className="modal-footer">
                <button onClick={resfresh} type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>



        <div className="modal fade" id="editInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditInterview interview={updatedItem} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>




        <div className="modal fade" id="viewInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ViewInterview />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};

Interview.propTypes = {};

Interview.defaultProps = {};

export default Interview;
