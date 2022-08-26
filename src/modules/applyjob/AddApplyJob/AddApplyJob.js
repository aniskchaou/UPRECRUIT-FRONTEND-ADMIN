import React, { useState } from 'react';
import './AddApplyJob.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages'
import applyJobMessage from '../../../main/messages/interviewMessage'
import applyJobValidation from '../../../main/validations/applyJobValidation'
import ApplyJobTestService from '../../../main/mocks/ApplyJobTestService';
import HTTPService from '../../../main/services/HTTPService';
import applyHTTPService from '../../../main/services/applyHTTPService'

const AddApplyJob = () => {

  const initialState = {
    condidate: '',
    jobOffer: '',
    dateApplication: '',
    status: '',
    appreciation: ''
  };
  const [job, setJob] = useState(initialState);
  const { register, handleSubmit, errors } = useForm()


  const onSubmit = (data) => {
    //saveJob(data)
    //ApplyJobTestService.create(data)
    applyHTTPService.createApply(data).then(data => {
      setJob(initialState)
      showMessage('Confirmation', applyJobMessage.add, 'success')
    })

  }

  const saveJob = (data) => {

    HTTPService.create(data)
      .then(response => {
        setJob(initialState)
      })
      .catch(e => {
        console.log(e);
      });

  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setJob({ ...job, [name]: value });
  };





  return (
    <div classNameName="AddApplyJob">

      <form className="ajax-form" method="POST" id="createForm" onSubmit={handleSubmit(onSubmit)}>

        <div className="row">

          <div className="col-md-8">
            <div className="form-group">
              <label className="control-label required"><font   ><font   >Candidate</font></font></label>
              <input ref={register({ required: true })} className="form-control" value={job.candidate}
                onChange={handleInputChange} type="text" name="candidate" placeholder="Nom" />
              <div className="error text-danger">
                {errors.candidate && applyJobValidation.candidate}
              </div>

            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >job Offer</font></font></label>
              <input className="form-control" value={job.jobOffer} ref={register({ required: true })}
                onChange={handleInputChange} type="text" name="jobOffer" placeholder="Email" />
              <div className="error text-danger">
                {errors.jobOffer && applyJobValidation.jobOffer}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >date Application</font></font></label>
              <input className="form-control" value={job.dateApplication} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="dateApplication" />
              <div className="error text-danger">
                {errors.dateApplication && applyJobValidation.dateApplication}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >status</font></font></label>
              <input className="form-control" value={job.status} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="status" placeholder="Téléphone" />
              <div className="error text-danger">
                {errors.status && applyJobValidation.status}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >appreciation</font></font></label>
              <input className="form-control" value={job.appreciation} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="appreciation" placeholder="Téléphone" />
              <div className="error text-danger">
                {errors.appreciation && applyJobValidation.appreciation}
              </div>
            </div>



          </div>
        </div>





        <br />
        <button type="submit" id="save-form" className="btn btn-success">
          <i className="fa fa-check"></i>
          <font   ><font   > Sauvegarder</font></font></button>

      </form>
    </div>
  )
};

AddApplyJob.propTypes = {};

AddApplyJob.defaultProps = {};

export default AddApplyJob;
