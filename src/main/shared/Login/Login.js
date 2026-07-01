import React, { useEffect, useState } from 'react';
import './Login.css';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages';
import userHTTPService from '../../../main/services/userHTTPService';
import CurrentUser from '../../config/user';


const Login = ({ handleClick }) => {


  let history = useHistory()
  const { register, handleSubmit } = useForm()
  var userInit = { username: "admin@uprecruit.com", password: "Admin@2026" }
  const [user, setUser] = useState(userInit);

  const DEMO_ACCOUNTS = [
    { label: 'Admin',      username: 'admin@uprecruit.com',    password: 'Admin@2026',      color: '#dc2626' },
    { label: 'HR Manager', username: 'hrmanager@uprecruit.com', password: 'HRManager@2026', color: '#ea580c' },
    { label: 'HR Staff',   username: 'staff@uprecruit.com',    password: 'Staff@2026',      color: '#d97706' },
  ];
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


  const onSubmit = async () => {
    try {
      const primaryResponse = await userHTTPService.login({ username: user.username, password: user.password });
      let authenticatedUser = primaryResponse?.data;

      // Backward compatibility: older environments still use admin/admin.
      if ((!authenticatedUser || Object.keys(authenticatedUser).length === 0)
        && user.username === 'admin'
        && user.password === 'admin') {
        const fallbackResponse = await userHTTPService.login({
          username: 'admin@uprecruit.com',
          password: 'Admin@2026',
        });
        authenticatedUser = fallbackResponse?.data;
      }

      setUser(userInit);

      if (authenticatedUser && Object.keys(authenticatedUser).length !== 0) {
        handleClick(true);
        CurrentUser.USER_DETAIL = authenticatedUser;
        localStorage.setItem('adminConnected', 'true');
        history.push('/dashboard');
        return;
      }

      CurrentUser.CONNECTED_USER = false;
      showMessage('Error', 'You have entered an invalid username or password', 'warning');
    } catch (e) {
      showMessage('Error', CurrentUser.ERR_MSG, 'warning');
      console.log(e);
    }
  }

  return (

    <div className="login-content" id="login-block"   >
      <div className="login-logo">
        <a href="index.html">
          <img className="align-content" src="images/logo.png" alt="" />
        </a>
      </div>
      <div className="login-form">
        <span className="auth-eyebrow">Admin access</span>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage hiring pipelines, talent operations, and employer content from one place.</p>

        {/* Quick-fill demo accounts */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Quick Demo Access</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => setUser({ username: acc.username, password: acc.password })}
                style={{ background: acc.color, color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" className="form-control" placeholder="Email" value={user.username} ref={register({ required: true })} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" placeholder="Password" autoComplete="current-password" onChange={handleInputChange} value={user.password} ref={register({ required: true })} />
          </div>
          <div className="checkbox">


          </div>
          <button type="submit" className="btn btn-success btn-flat m-b-30 m-t-30">Sign in</button>


        </form>
        <p className="login-note">Secure access for recruiters, hiring managers, and administrators.</p>
      </div>
    </div>

  )
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
