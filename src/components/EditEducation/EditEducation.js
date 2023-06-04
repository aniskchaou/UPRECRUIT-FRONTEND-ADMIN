import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditEducation.css';
import educationHTTPService from '../../main/services/educationHTTPService';

const EditEducation = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [education, setEducation] = useState(props.edu);

  useEffect(() => {
    setEducation(props.edu)
  }, [props.edu]);


  const onSubmit = (data) => {

    //  GroupeTestService.update(props.education, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    educationHTTPService.editEducation(props.edu.id, data).then(data => {
      props.closeModal()
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
                <label className="control-label required"><font   ><font   >Degree</font></font></label>
                <input className="form-control" value={education.degree} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="degree" placeholder="Degree" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >University</font></font></label>
                <input className="form-control" value={education.university} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="university" placeholder="University" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Result</font></font></label>
                <input className="form-control" value={education.result} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="result" placeholder="Result" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Start</font></font></label>
                <input className="form-control" value={education.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="date" name="startDate" placeholder="Start" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >End</font></font></label>
                <input className="form-control" value={education.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="date" name="endDate" placeholder="End" />

              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Status</font></font></label>
                <input className="form-control" value={education.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Status" />

              </div>
            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
      </form>
    </div>
  )
}

EditEducation.propTypes = {};

EditEducation.defaultProps = {};

export default EditEducation;
