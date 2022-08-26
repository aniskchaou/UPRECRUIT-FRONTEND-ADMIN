import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddCompany.css';
import { compose } from 'redux';
import companyHTTPService from '../../main/services/companyHTTPService';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
import categoryMessage from '../../main/messages/categoryMessage';
import companyValidation from '../../main/validations/companyValidation';
const AddCompany = () => {
  const initialState = {
    name: '',
    email: '',
    category: '',
    telephone: '',
    address: '',
    website: '',
    size: '',

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    companyHTTPService.createCompany(data).then(data => {
      setCompany(initialState)
      // showMessage('Confirmation', categoryMessage.add, 'success')
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
                  {errors.name && companyValidation.name}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >email</font></font></label>
                <input className="form-control" value={company.email} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="email" placeholder="Email" />
                <div className="error text-danger">
                  {errors.email && companyValidation.email}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >category</font></font></label>
                <input className="form-control" value={company.category} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="category" placeholder="Email" />
                <div className="error text-danger">
                  {errors.category && companyValidation.category}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >telephone</font></font></label>
                <input className="form-control" value={company.telephone} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="telephone" placeholder="Email" />
                <div className="error text-danger">
                  {errors.telephone && companyValidation.telephone}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >address</font></font></label>
                <input className="form-control" value={company.address} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="address" placeholder="Email" />
                <div className="error text-danger">
                  {errors.address && companyValidation.address}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >website</font></font></label>
                <input className="form-control" value={company.website} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="website" placeholder="Email" />
                <div className="error text-danger">
                  {errors.website && companyValidation.website}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >size</font></font></label>
                <input className="form-control" value={company.size} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="size" placeholder="Email" />
                <div className="error text-danger">
                  {errors.size && companyValidation.size}
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

AddCompany.propTypes = {};

AddCompany.defaultProps = {};

export default AddCompany;
