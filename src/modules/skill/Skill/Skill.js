import React, { useEffect, useState } from 'react';
import './Skill.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import AddSkill from '../AddSkill/AddSkill';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import skillMessage from '../../../main/messages/skillMessage';
import SkillTestService from '../../../main/mocks/SkillTestService';
import HTTPService from '../../../main/services/HTTPService';

const Skill = () => {

  const [skills, setSkills] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    LoadJS()
    retrieveSkills()
  }, []);


  const getAll = () => {
    HTTPService.getAll()
      .then(response => {
        setSkills(response.data);
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



  const retrieveSkills = () => {
    var skills = SkillTestService.getAll();
    setSkills(skills);
  };

  const resfresh = () => {
    retrieveSkills()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', skillMessage.delete, 'success')
      SkillTestService.remove(data)
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
        <strong className="card-title">Compétences</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Compétences</th>
              <th>Catégories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>


            {skills.map(item =>
              <tr>
                <td>{item.skills}</td>
                <td>{item.category_id}</td>
                <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, skills.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>
            )}



            <tr>
              <td>Java</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" ><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            <tr>
              <td>PHP</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" ><i class="fas fa-trash-alt"></i></button></td>
            </tr>
            <tr>
              <td>Python</td>
              <td>Développement</td>
              <td><button type="button" data-toggle="modal" data-target="#viewSkill" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editSkill" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" ><i class="fas fa-trash-alt"></i></button></td>
            </tr>

          </tbody>
          <tfoot>
                  <tr>
                    <th>Compétences</th>
                    <th>Catégories</th>
                    <th>Actions</th>
                  </tr>
                  </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addSkill" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
 Ajouter</button>

        <div class="modal fade" id="addSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddSkill />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editSkill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
