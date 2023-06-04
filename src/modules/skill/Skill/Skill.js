import React, { useEffect, useRef, useState } from 'react';
import './Skill.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import AddSkill from '../AddSkill/AddSkill';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import skillMessage from '../../../main/messages/skillMessage';
import SkillTestService from '../../../main/mocks/SkillTestService';
import skillHTTPService from '../../../main/services/skillHTTPService';
import EditSkill from '../../../components/EditSkill/EditSkill'
const Skill = () => {

  const [skills, setSkills] = useState([]);
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
    skillHTTPService.getAllSkill()
      .then(response => {
        setSkills(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfresh = () => {
    getAllPatient()
    //forceUpdate()
  }

  const removePatientAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Are you sure?");
    if (r) {
      showMessage('Confirmation', 'patientMessage.delete', 'success')
      skillHTTPService.removeSkill(data.id).then(data => {
        resfresh()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //resfresh()
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
        <strong className="card-title">Skills</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addSkill" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
          Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>


            {skills.map(item =>
              <tr>
                <td>{item.name}</td>
                <td>
                  <button onClick={e => updatePatientAction(e, item)} type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removePatientAction(e, item)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}
          </tbody>

        </table>


        <div class="modal fade" id="addSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddSkill closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditSkill skill={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
};

Skill.propTypes = {};

Skill.defaultProps = {};

export default Skill;
