import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddAcceptanceFeedBack.css';
import showMessage from '../../libraries/messages/messages';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';
import acceptanceHTTPService from '../../main/services/acceptanceHTTPService';

const AddAcceptanceFeedBack = (props) => {
  const initialState = {
    name: '',
    description: ''

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    /*   companyHTTPService.createCompany(data).then(data => {
        setCompany(initialState)
        showMessage('Confirmation', categoryMessage.add, 'success')
      }) */
    acceptanceHTTPService.createAcceptance(data).then(data => {
      setCompany(initialState)
      props.closeModal()
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
            <div className="col-md-12">
              <div className="form-group">
                <label className="control-label required"><font   ><font   >name</font></font></label>
                <input className="form-control" value={company.name} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="name" />
                <div className="error text-danger">
                  {errors.name && companyValidation.name}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >description</font></font></label>
                <input className="form-control" value={company.description} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="description" />
                <div className="error text-danger">
                  {errors.description && companyValidation.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
      </form>
    </div>
  )
};

AddAcceptanceFeedBack.propTypes = {};

AddAcceptanceFeedBack.defaultProps = {};

export default AddAcceptanceFeedBack;
