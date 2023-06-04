import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddEducation.css';
import educationValidation from '../../main/validations/educationValidation';
import { useForm } from 'react-hook-form';
import educationHTTPService from '../../main/services/educationHTTPService';
import showMessage from '../../libraries/messages/messages';
const AddEducation = (props) => {
  const initialState = {
    degree: '',
    university: '',
    result: '',
    startDate: '',
    endDate: '',
    status: ''
  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [education, setEducation] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    educationHTTPService.createEducation(data).then(data => {
      setEducation(initialState)
      showMessage('Confirmation', 'categoryMessage.add,', 'success')
      props.closeModal()
    })

  }

  const saveCategory = (data) => {


  };


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
};

AddEducation.propTypes = {};

AddEducation.defaultProps = {};

export default AddEducation;
