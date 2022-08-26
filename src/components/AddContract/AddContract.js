import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddContract.css';
import contractValidation from '../../main/validations/contractValidation';
import { useForm } from 'react-hook-form';
import contractHTTPService from '../../main/services/contractHTTPService'
const AddContract = () => {
  const initialState = {
    subject: '',
    contractValue: '',
    contractType: '',
    condidate: '',
    startDate: '',
    endDate: '',
    description: '',
    notes: '',
    comments: '',
    templates: '',
    renew: ''

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
    contractHTTPService.createContract(data).then(data => {

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
                <label className="control-label required"><font   ><font   >subject</font></font></label>
                <input className="form-control" value={company.subject} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="subject" placeholder="Email" />
                <div className="error text-danger">
                  {errors.subject && contractValidation.subject}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >contractValue</font></font></label>
                <input className="form-control" value={company.contractValue} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="contractValue" placeholder="Email" />
                <div className="error text-danger">
                  {errors.contractValue && contractValidation.contractValue}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >contractType</font></font></label>
                <input className="form-control" value={company.category} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="contractType" placeholder="Email" />
                <div className="error text-danger">
                  {errors.contractType && contractValidation.contractType}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >condidate</font></font></label>
                <input className="form-control" value={company.condidate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="condidate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.condidate && contractValidation.condidate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >startDate</font></font></label>
                <input className="form-control" value={company.startDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.startDate && contractValidation.startDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >endDate</font></font></label>
                <input className="form-control" value={company.endDate} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />
                <div className="error text-danger">
                  {errors.endDate && contractValidation.endDate}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >description</font></font></label>
                <input className="form-control" value={company.description} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="description" placeholder="Email" />
                <div className="error text-danger">
                  {errors.description && contractValidation.description}
                </div>
              </div>


              <div className="form-group">
                <label className="control-label required"><font   ><font   >notes</font></font></label>
                <input className="form-control" value={company.notes} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="notes" placeholder="Email" />
                <div className="error text-danger">
                  {errors.notes && contractValidation.notes}
                </div>
              </div>


              <div className="form-group">
                <label className="control-label required"><font   ><font   >comments</font></font></label>
                <input className="form-control" value={company.comments} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="comments" placeholder="Email" />
                <div className="error text-danger">
                  {errors.comments && contractValidation.comments}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >templates</font></font></label>
                <input className="form-control" value={company.templates} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="templates" placeholder="Email" />
                <div className="error text-danger">
                  {errors.templates && contractValidation.templates}
                </div>
              </div>


              <div className="form-group">
                <label className="control-label required"><font   ><font   >renew</font></font></label>
                <input className="form-control" value={company.renew} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="renew" placeholder="Email" />
                <div className="error text-danger">
                  {errors.renew && contractValidation.renew}
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

AddContract.propTypes = {};

AddContract.defaultProps = {};

export default AddContract;
