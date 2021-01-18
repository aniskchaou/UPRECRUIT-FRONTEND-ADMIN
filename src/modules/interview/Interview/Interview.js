import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Interview.css';
import AddInterview from './../AddInterview/AddInterview';
import EditInterview from './../EditInterview/EditInterview';
import ViewInterview from './../ViewInterview/ViewInterview';
import { LoadJS } from './../../../libraries/datatables/datatables';
const deleteInterview=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Interview = () =>{

  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
    console.log('hello')
  }, []);


 return(
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
                    <th>Statut</th>
                    <th>Actions</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Anis</td>
                    <td>12/11/2020</td>
                    <td><span class="badge badge-success">Accepté</span></td>
                    <td>
              <button type="button" data-toggle="modal" data-target="#editInterview"className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
              <button type="button" className="btn btn-danger btn-sm" onClick={deleteInterview}><i className="fas fa-trash-alt"></i></button></td>
                    
                 
                  </tr></tbody>  <tfoot>
                  <tr>
                    <th>Nom de l'applicant</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                    
                  </tr>
                  </tfoot>
    </table>
    <button  type="button" data-toggle="modal" data-target="#addInterview" className="btn btn-success btn-sm">Ajouter</button>

    <div className="modal fade" id="addInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <AddInterview />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>



      <div className="modal fade" id="editInterview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <EditInterview />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
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
)};

Interview.propTypes = {};

Interview.defaultProps = {};

export default Interview;
