import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import UserSettings from '../../config/user';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages';
import userHTTPService from '../../../main/services/userHTTPService';
import CurrentUser from '../../config/user';


const Login = ({ handleClick }) => {


  let history = useHistory()
  const { register, handleSubmit, errors } = useForm()
  var userInit = { username: "admin", password: "admin" }
  const [user, setUser] = useState(userInit);
  useEffect(() => {
  }, []);
  /* 
    const onSubmit = (data) => {
      props.rerender();
      UserSettings.CONNECTED_USER = true
      history.push("/dashboard")
    } */

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };


  const onSubmit = (data) => {
    userHTTPService.login({ username: user.username, password: user.password })
      .then(response => {
        setUser(userInit)
        if (Object.keys(response.data).length !== 0) {
          handleClick(true)
          CurrentUser.USER_DETAIL = response.data
          localStorage.setItem('connected', CurrentUser.CONNECTED_USER);
          history.push("/dashboard")
        } else {
          CurrentUser.CONNECTED_USER = false
          showMessage('Error', 'You have entered an invalid username or password', 'warning')
        }
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
        console.log(e)
      });


  }

  return (

    <div className="login-content" id="login-block"   >
      <div className="login-logo">
        <a href="index.html">
          <img className="align-content" src="images/logo.png" alt="" />
        </a>
      </div>
      <div className="login-form">
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" className="form-control" placeholder="Email" value={user.username} ref={register({ required: true })} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" placeholder="Password" onChange={handleInputChange} value={user.password} ref={register({ required: true })} />
          </div>
          <div className="checkbox">


          </div>
          <button type="submit" className="btn btn-success btn-flat m-b-30 m-t-30">Sign in</button>


        </form>
      </div>
    </div>

  )
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
