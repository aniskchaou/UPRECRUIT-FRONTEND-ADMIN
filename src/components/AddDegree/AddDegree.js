import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddDegree.css';
import degreeValidation from '../../main/validations/degreeValidation';
import { useForm } from 'react-hook-form';
import degreeHTTPService from '../../main/services/degreeHTTPService';
import showMessage from '../../libraries/messages/messages';

const AddDegree = () => {
  const initialState = {
    name: '',
    type: '',
    level: '',
    university: '',
    location: ''

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    degreeHTTPService.createDegree(data).then(data => {
      setCompany(initialState)
      showMessage('Confirmation', 'categoryMessage.add', 'success')
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
                <label className="control-label required"><font   ><font   >name</font></font></label>
                <input className="form-control" value={company.name} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="name" placeholder="Email" />
                <div className="error text-danger">
                  {errors.name && degreeValidation.name}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >type</font></font></label>
                <input className="form-control" value={company.type} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="type" placeholder="Email" />
                <div className="error text-danger">
                  {errors.type && degreeValidation.type}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >level</font></font></label>
                <input className="form-control" value={company.level} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="level" placeholder="Email" />
                <div className="error text-danger">
                  {errors.level && degreeValidation.level}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >university</font></font></label>
                <input className="form-control" value={company.university} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="university" placeholder="Email" />
                <div className="error text-danger">
                  {errors.university && degreeValidation.university}
                </div>
              </div>



              <div className="form-group">
                <label className="control-label required"><font   ><font   >location</font></font></label>
                <input className="form-control" value={company.location} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="location" placeholder="Email" />
                <div className="error text-danger">
                  {errors.location && degreeValidation.location}
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

AddDegree.propTypes = {};

AddDegree.defaultProps = {};

export default AddDegree;
