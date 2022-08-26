import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditDegree.css';

import dregreeHTTPService from '../../main/services/degreeHTTPService'
import degreeHTTPService from '../../main/services/degreeHTTPService';
import degreeValidation from '../../main/validations/degreeValidation';
const EditDegree = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(props.degree);

  useEffect(() => {
    setCompany(props.degree)
  }, [props.degree]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.degree, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    degreeHTTPService.editDegree(props.degree.id, data).then(data => {

    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCompany({ ...company, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">

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




          <div class="form-group row">
            <div class="offset-4 col-8">
              <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i>Sauvegarder</button>
            </div>
          </div>
        </div>
      </form>

    </div >
  )
};

EditDegree.propTypes = {};

EditDegree.defaultProps = {};

export default EditDegree;
