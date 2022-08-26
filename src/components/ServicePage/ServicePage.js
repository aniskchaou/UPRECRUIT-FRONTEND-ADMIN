
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
                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#editFrontOffice">Edit</button>
                <a type="button" class="btn btn-warning" href="http://localhost:5000">Website</a>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Service 1 : {frontOffice.sliderTitle}</li>
                  <li class="list-group-item">Service 2: {frontOffice.leftButtonTitle} </li>
                  <li class="list-group-item">Service 3: {frontOffice.leftButtonTitle} </li>
                  <li class="list-group-item">Service 4: {frontOffice.leftButtonTitle} </li>
                  <li class="list-group-item">Service 5: {frontOffice.leftButtonTitle} </li>
                  <li class="list-group-item">Service 6: {frontOffice.leftButtonTitle} </li>
                </ul>
              </div>
            </div>
            <div class="modal fade" id="editFrontOffice" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <EditServicePage frontOffice={frontOffice} />
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

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
