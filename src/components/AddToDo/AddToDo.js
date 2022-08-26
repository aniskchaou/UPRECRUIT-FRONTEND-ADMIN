import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddToDo.css';
import companyValidation from '../../main/validations/companyValidation';
import { useForm } from 'react-hook-form';
import taskHTTPService from '../../main/services/taskHTTPService';
import taskValidation from '../../main/validations/taskValidation';

const AddToDo = () => {
  const initialState = {
    task: '',
    status: '',

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)
    /*  companyHTTPService.createCompany(data).then(data => {
       setCompany(initialState)
       showMessage('Confirmation', categoryMessage.add, 'success')
     })
  */
    taskHTTPService.createTask(data).then(data => {
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
                <label className="control-label required"><font   ><font   >task</font></font></label>
                <input className="form-control" value={company.task} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="task" placeholder="Email" />
                <div className="error text-danger">
                  {errors.task && taskValidation.task}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >status</font></font></label>
                <input className="form-control" value={company.status} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="status" placeholder="Email" />
                <div className="error text-danger">
                  {errors.status && taskValidation.status}
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

AddToDo.propTypes = {};

AddToDo.defaultProps = {};

export default AddToDo;
