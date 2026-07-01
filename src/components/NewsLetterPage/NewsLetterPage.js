import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './NewsLetterPage.css';
import EditNewsLetterPage from '../../components/EditNewsLetterPage/EditNewsLetterPage'
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import { LoadJS } from '../../libraries/datatables/datatables';
const NewsLetterPage = () => {
  const [frontOffice, setFrontOffice] = useState({});

  useEffect(() => {
    LoadJS()
    retrieveEvents()
  }, []);


  const retrieveEvents = () => {
    frontOfficeHTTPService.getNewsLetterPage()
      .then(response => {

        setFrontOffice(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };


  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title"> NewsLetter Section</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <button type="button" className="btn btn-success" data-toggle="modal" data-target="#editFrontOffice">Edit</button>
                <a type="button" className="btn btn-warning" href="http://localhost:5000">Website</a>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Newsletter Title : {frontOffice.title}</li>
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
                    <EditNewsLetterPage frontOffice={frontOffice} />
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

NewsLetterPage.propTypes = {};

NewsLetterPage.defaultProps = {};

export default NewsLetterPage;

