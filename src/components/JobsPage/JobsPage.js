import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './JobsPage.css';
import EditJobPage from '../../components/EditJobsPage/EditJobsPage'
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
const JobsPage = () => {
  const [frontOffice, setFrontOffice] = useState({});

  useEffect(() => {
    retrieveEvents()
  }, []);


  const retrieveEvents = () => {
    /*   frontOfficeHTTPService.get()
        .then(response => {
  
          setFrontOffice(response.data);
        })
        .catch(e => {
          console.log(e);
        });  */
  };


  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title"> Front Office</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <button type="button" className="btn btn-success" data-toggle="modal" data-target="#editFrontOffice">Edit</button>
                <a type="button" className="btn btn-warning" href="http://localhost:5000">Website</a>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Jobs Title : {frontOffice.title}</li>
                  <li className="list-group-item">sub title : {frontOffice.subTitle} </li>

                </ul>
              </div>
            </div>
            <div className="modal fade" id="editFrontOffice" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Edit</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <EditJobPage frontOffice={frontOffice} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

JobsPage.propTypes = {};

JobsPage.defaultProps = {};

export default JobsPage;

