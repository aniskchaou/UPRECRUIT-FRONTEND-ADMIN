import PropTypes from 'prop-types';
import './EditEmailSettings.css';
import { useForm } from 'react-hook-form';

import React, { useEffect, useState } from 'react';
import settingsHTTPService from '../../main/services/settingsHTTPService';
import showMessage from '../../libraries/messages/messages';

const EditEmailSettings = () => {
  const { register, handleSubmit, errors } = useForm()
  const [emailSettings, setEmailSettings] = useState();

  useEffect(() => {
    getEmailSettings()
  }, [])
  const handleInputChange = event => {
    const { name, value } = event.target;
    setEmailSettings({ ...emailSettings, [name]: value });
  };

  const getEmailSettings = () => {
    settingsHTTPService.getEmailSettings().then(data => {
      console.log(data.data[0])
      setEmailSettings(data.data[0])

    })
  }

  const onSubmit = (data) => {
    settingsHTTPService.editEmailSettings(emailSettings.id, data).then(data => {
      console.log(data)
      showMessage('Confirmation', 'CurrentUser.UPDATE_MSG', 'success')
    })
  }
  return (
    <div className="EditDashboardSettings">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">SMTP</label>
          <div className="col-8">

            <input onChange={handleInputChange} value={emailSettings?.smtp || ""} ref={register({ required: true })}
              id="text" name="smtp" type="text" className="form-control" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="select2" className="col-4 col-form-label">Email address</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={emailSettings?.emailSentAddress || ""} ref={register({ required: true })}
              id="text" name="emailSentAddress" type="text" className="form-control" />
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


EditEmailSettings.propTypes = {};

EditEmailSettings.defaultProps = {};

export default EditEmailSettings;

