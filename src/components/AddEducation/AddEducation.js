import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddEducation.css';
import educationValidation from '../../main/validations/educationValidation';
import { useForm } from 'react-hook-form';
import educationHTTPService from '../../main/services/educationHTTPService';
import showMessage from '../../libraries/messages/messages';
const AddEducation = () => {
  const initialState = {
    degree: '',
    university: '',
    result: '',
    startDate: '',
    endDate: '',
    status: ''
  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    educationHTTPService.createEducation(data).then(data => {
      setCompany(initialState)
      showMessage('Confirmation', 'categoryMessage.add,', 'success')
    })

  }

  const saveCategory = (data) => {


  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setCompany({ ...company, [name]: value });
  };

  return (
    <div className="AddCategory">


      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">


              <div className="form-group">
                <label className="control-label required"><font   ><font   >degree</font></font></label>
                <input className="form-control" value={company.degree} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="degree" placeholder="Email" />
                <div className="error text-danger">
                  {errors.degree && educationValidation.degree}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >university</font></font></label>
                <input className="form-control" value={company.university} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="university" placeholder="Email" />
                <div className="error text-danger">
                  {errors.university && educationValidation.university}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >result</font></font></label>
                <input className="form-control" value={company.result} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="result" placeholder="Email" />
                <div className="error text-danger">
                  {errors.result && educationValidation.result}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >startDate</font></font></label>
                <input className="form-control" value={company.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.startDate && educationValidation.startDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >endDate</font></font></label>
                <input className="form-control" value={company.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.endDate && educationValidation.endDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >status</font></font></label>
                <input className="form-control" value={company.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Email" />
                <div className="error text-danger">
                  {errors.status && educationValidation.status}
                </div>
              </div>





            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>
      </form>
    </div>
  )
};

AddEducation.propTypes = {};

AddEducation.defaultProps = {};

export default AddEducation;
