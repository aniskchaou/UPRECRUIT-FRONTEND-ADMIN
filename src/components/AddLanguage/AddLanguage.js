import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddLanguage.css';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';
import LanguageHTTPService from '../../main/services/LanguageHTTPService';
const AddLanguage = () => {
  const initialState = {
    language: '',
    level: ''

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
    LanguageHTTPService.createLanguage(data).then(data => {
      setCompany(initialState)
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
                <label className="control-label required"><font   ><font   >language</font></font></label>
                <input className="form-control" value={company.language} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="language" placeholder="Email" />
                <div className="error text-danger">
                  {errors.language && companyValidation.language}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >level</font></font></label>
                <input className="form-control" value={company.level} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="level" placeholder="Email" />
                <div className="error text-danger">
                  {errors.level && companyValidation.level}
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

AddLanguage.propTypes = {};

AddLanguage.defaultProps = {};

export default AddLanguage;
