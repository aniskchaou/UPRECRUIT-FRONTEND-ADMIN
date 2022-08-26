import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddTypeContract.css';
import categoryMessage from '../../main/messages/categoryMessage';
import showMessage from '../../libraries/messages/messages';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';

const AddTypeContract = () => {
  const initialState = {
    name: '',


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
                <label className="control-label required"><font   ><font   >name</font></font></label>
                <input className="form-control" value={company.name} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="name" placeholder="Email" />
                <div className="error text-danger">
                  {errors.name && companyValidation.name}
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

AddTypeContract.propTypes = {};

AddTypeContract.defaultProps = {};

export default AddTypeContract;
