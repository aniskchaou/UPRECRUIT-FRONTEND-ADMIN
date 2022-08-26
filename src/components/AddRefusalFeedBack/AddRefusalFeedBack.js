import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddRefusalFeedBack.css';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';
import refusalHTTPService from '../../main/services/refusalHTTPService';
const AddRefusalFeedBack = (props) => {
  const initialState = {
    name: '',
    description: ''

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [refusalFeedBack, setRefusalFeedBack] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    /*  companyHTTPService.createCompany(data).then(data => {
       setCompany(initialState)
       showMessage('Confirmation', categoryMessage.add, 'success')
     }) */
    console.log(data)
    refusalHTTPService.createRefusal(data).then(data => {
      setRefusalFeedBack(initialState)
      props.closeModal()
    })

  }

  const saveCategory = (data) => {


  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setRefusalFeedBack({ ...refusalFeedBack, [name]: value });
  };

  return (
    <div className="AddCategory">


      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">


              <div className="form-group">
                <label className="control-label required"><font   ><font   >name</font></font></label>
                <input className="form-control" value={refusalFeedBack.name} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="name" placeholder="Email" />
                <div className="error text-danger">
                  {errors.name && companyValidation.name}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >description</font></font></label>
                <input className="form-control" value={refusalFeedBack.description} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="description" placeholder="Email" />
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

AddRefusalFeedBack.propTypes = {};

AddRefusalFeedBack.defaultProps = {};

export default AddRefusalFeedBack;
