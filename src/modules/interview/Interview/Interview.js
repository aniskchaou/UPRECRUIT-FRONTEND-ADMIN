import React, { useEffect, useRef, useState } from 'react';
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
import interviewHTTPService from "../../../main/services/interviewHTTPService";
const Interview = () => {

  const [interviews, setInterviews] = useState([]);
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
    interviewHTTPService.getAllInterview()
      .then(response => {
        setInterviews(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfresh = () => {
    getAllPatient()
    // forceUpdate()
  }

  const removeInterviewAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      //  showMessage('Confirmation', 'patientMessage.delet', 'success')
      interviewHTTPService.removeInterview(data).then(data => {
        resfresh()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateInterviewAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfresh()
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
        <strong className="card-title">Interviews</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addInterview" className="btn btn-success btn-sm"><i class="fas fa-plus"></i> Create </button>
        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Date</th>
              <th>Interviewer</th>
              <th>Time</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(item =>
              <tr>
                <td>{item.candidates}</td>
                <td>{item.scheduleDate}</td>
                <td>{item.employees}</td>
                <td>{item.scheduleTime}</td>
                <td>{item.comment}</td>
                <td>
                  {/*  <button onClick={e => updateInterviewAction(e, item)} type="button" data-toggle="modal" data-target="#editInterview" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button> */}
                  <button onClick={e => removeInterviewAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>  <tfoot>
            <tr>
              <th>Candidate</th>
              <th>Date</th>
              <th>Interviewer</th>
              <th>Time</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>


        <br />
        <div>

          <FullCalendar

            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={[
              { title: 'Entretien developpeur mobile', date: '2022-07-27' },
              { title: 'event 2', date: '2019-04-02' }
            ]}
          />
        </div>
        <div className="modal fade" id="addInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">New</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddInterview closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button ref={closeButtonAdd} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

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
