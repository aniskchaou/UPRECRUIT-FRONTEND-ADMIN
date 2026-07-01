
import PropTypes from 'prop-types';
import './ServicePage.css';
import React, { useEffect, useState } from 'react';
import EditServicePage from '../../components/EditServicePage/EditServicePage'
const ServicePage = () => {
  const [frontOffice, setFrontOffice] = useState({});

  useEffect(() => {
    retrieveEvents()
  }, []);


  const retrieveEvents = () => {
    /*     frontOfficeHTTPService.getFrontOffice()
          .then(response => {
    
            setFrontOffice(response.data);
          })
          .catch(e => {
            console.log(e);
          }); */
  };


  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title"> Services</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <button type="button" className="btn btn-success" data-toggle="modal" data-target="#editFrontOffice">Edit</button>
                <a type="button" className="btn btn-warning" href="http://localhost:5000">Website</a>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Service 1 : {frontOffice.sliderTitle}</li>
                  <li className="list-group-item">Service 2: {frontOffice.leftButtonTitle} </li>
                  <li className="list-group-item">Service 3: {frontOffice.leftButtonTitle} </li>
                  <li className="list-group-item">Service 4: {frontOffice.leftButtonTitle} </li>
                  <li className="list-group-item">Service 5: {frontOffice.leftButtonTitle} </li>
                  <li className="list-group-item">Service 6: {frontOffice.leftButtonTitle} </li>
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
                    <EditServicePage frontOffice={frontOffice} />
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

ServicePage.propTypes = {};

ServicePage.defaultProps = {};

export default ServicePage;

