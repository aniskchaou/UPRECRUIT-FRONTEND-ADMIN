
import PropTypes from 'prop-types';
import './EditSystemSettings.css';
import { useForm } from 'react-hook-form';

import React, { useEffect, useState } from 'react';

import showMessage from '../../libraries/messages/messages';
import settingsHTTPService from '../../main/services/settingsHTTPService';

const EditSystemSettings = () => {
  const { register, handleSubmit, errors } = useForm()
  const [systemSettings, setSystemSettings] = useState();

  useEffect(() => {
    getSystemSettings()
  }, [])
  const handleInputChange = event => {
    const { name, value } = event.target;
    setSystemSettings({ ...systemSettings, [name]: value });
  };

  const getSystemSettings = () => {
    settingsHTTPService.getSystemSettings().then(data => {
      setSystemSettings(data.data[0])
      console.log(data.data[0])
    })
  }

  const onSubmit = (data) => {

    settingsHTTPService.editSystemSettings(systemSettings.id, data).then(data => {

      showMessage('Confirmation', 'CurrentUser.UPDATE_MSG', 'success')
    })
  }
  return (
    <div className="EditDashboardSettings">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Application Name</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={systemSettings?.appName || ""} ref={register({ required: true })}
              id="text" name="appName" type="text" className="form-control" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Show Logo</label>
          <div className="col-8">
            <select onChange={handleInputChange} value={systemSettings?.showLogo || ""} ref={register({ required: true })}
              id="select2" name="showLogo" className="custom-select">

              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Email</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={systemSettings?.email || ""} ref={register({ required: true })}
              id="text" name="email" type="text" className="form-control" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Address</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={systemSettings?.address || ""} ref={register({ required: true })}
              id="text" name="address" type="text" className="form-control" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Entreprise Name</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={systemSettings?.entrepriseName || ""} ref={register({ required: true })}
              id="text" name="entrepriseName" type="text" className="form-control" />
          </div>
        </div>

        <div className="form-group row">
          <div className="offset-4 col-8">
            <button name="submit" type="submit" className="btn btn-primary"><i className="far fa-save"></i>
              Save</button>
          </div>
        </div>


      </form>
    </div>
  )
}


EditSystemSettings.propTypes = {};

EditSystemSettings.defaultProps = {};

export default EditSystemSettings;

