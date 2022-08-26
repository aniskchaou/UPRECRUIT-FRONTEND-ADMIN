import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddExperience.css';
import experienceValidation from '../../main/validations/experienceValidation';
import { useForm } from 'react-hook-form';
import experienceHTTPService from '../../main/services/experienceHTTPService';
const AddExperience = () => {
  const initialState = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [experience, setExperience] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    /* companyHTTPService.createCompany(data).then(data => {
      setCompany(initialState)
      showMessage('Confirmation', categoryMessage.add, 'success')
    }) */
    experienceHTTPService.createExperience(data).then(data => {
      setExperience(initialState)
    })

  }

  const saveCategory = (data) => {


  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setExperience({ ...experience, [name]: value });
  };

  return (
    <div className="AddCategory">


      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">


              <div className="form-group">
                <label className="control-label required"><font   ><font   >title</font></font></label>
                <input className="form-control" value={experience.title} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="title" placeholder="Email" />
                <div className="error text-danger">
                  {errors.title && experienceValidation.title}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >company</font></font></label>
                <input className="form-control" value={experience.company} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="company" placeholder="Email" />
                <div className="error text-danger">
                  {errors.company && experienceValidation.company}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >location</font></font></label>
                <input className="form-control" value={experience.location} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="location" placeholder="Email" />
                <div className="error text-danger">
                  {errors.location && experienceValidation.location}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >startDate</font></font></label>
                <input className="form-control" value={experience.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.startDate && experienceValidation.startDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >endDate</font></font></label>
                <input className="form-control" value={experience.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.endDate && experienceValidation.endDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >status</font></font></label>
                <input className="form-control" value={experience.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Email" />
                <div className="error text-danger">
                  {errors.status && experienceValidation.status}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >description</font></font></label>
                <input className="form-control" value={experience.description} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="description" placeholder="Email" />
                <div className="error text-danger">
                  {errors.description && experienceValidation.description}
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

AddExperience.propTypes = {};

AddExperience.defaultProps = {};

export default AddExperience;
