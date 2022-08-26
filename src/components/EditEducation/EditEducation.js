import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditEducation.css';
import educationHTTPService from '../../main/services/educationHTTPService';

const EditEducation = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [education, setEducation] = useState(props.education);

  useEffect(() => {
    setEducation(props.education)
  }, [props.education]);


  const onSubmit = (data) => {

    //  GroupeTestService.update(props.education, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    educationHTTPService.editEducation(props.education.id, data).then(data => {

    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setEducation({ ...education, [name]: value });
  };


  return (
    <div className="AddCategory">


      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">


              <div className="form-group">
                <label className="control-label required"><font   ><font   >degree</font></font></label>
                <input className="form-control" value={education.degree} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="degree" placeholder="Email" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >university</font></font></label>
                <input className="form-control" value={education.university} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="university" placeholder="Email" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >result</font></font></label>
                <input className="form-control" value={education.result} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="result" placeholder="Email" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >startDate</font></font></label>
                <input className="form-control" value={education.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >endDate</font></font></label>
                <input className="form-control" value={education.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >status</font></font></label>
                <input className="form-control" value={education.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Email" />

              </div>





            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>
      </form>
    </div>
  )
}

EditEducation.propTypes = {};

EditEducation.defaultProps = {};

export default EditEducation;
