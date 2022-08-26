import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddRenewalContract.css';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';


const AddRenewalContract = () => {
  const initialState = {
    startDate: '',
    endDate: '',
    contractValue: '',
    status: ''

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    /*  companyHTTPService.createCompany(data).then(data => {
       setCompany(initialState)
       showMessage('Confirmation', categoryMessage.add, 'success')
     }) */

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
                <label className="control-label required"><font   ><font   >startDate</font></font></label>
                <input className="form-control" value={company.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.startDate && companyValidation.startDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >endDate</font></font></label>
                <input className="form-control" value={company.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.endDate && companyValidation.endDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >contractValue</font></font></label>
                <input className="form-control" value={company.contractValue} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="contractValue" placeholder="Email" />
                <div className="error text-danger">
                  {errors.contractValue && companyValidation.contractValue}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >status</font></font></label>
                <input className="form-control" value={company.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Email" />
                <div className="error text-danger">
                  {errors.status && companyValidation.status}
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

AddRenewalContract.propTypes = {};

AddRenewalContract.defaultProps = {};

export default AddRenewalContract;
