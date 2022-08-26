import React from 'react';
import PropTypes from 'prop-types';
import './Profile.css';
import { useHistory } from 'react-router';
import UserSettings from '../../../main/config/user';

const Profile = () => {


  return (

    <div className="card">
      <div className="card-header">
        <strong className="card-title">Mon profile</strong>
      </div>
      <div className="card-body">


        <div className="Profile">
          <div class="col-md-12">
            <div class="card profile-card-2">
              <div class="card-img-block">
                <img class="img-fluid" src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=950&h=650&auto=compress&cs=tinysrgb" alt="Card image cap" />
              </div>
              <div class="card-body pt-5">
                <img src="images/admin.png" alt="profile-image" class="profile" />
                <h5 class="card-title">Landon Hunt</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <div class="icon-block">
                  <button type="button" class="btn btn-warning btn-sm"><i class="fas fa-user-edit"></i> Editer</button>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  )
};

Profile.propTypes = {};

Profile.defaultProps = {};

export default Profile;
