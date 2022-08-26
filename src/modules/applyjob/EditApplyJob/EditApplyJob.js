import React, { useEffect, useState } from 'react';
import './EditApplyJob.css';
import { useForm } from 'react-hook-form';
import ApplyJobTestService from '../../../main/mocks/ApplyJobTestService';
import showMessage from '../../../libraries/messages/messages';
import applyJobMessage from '../../../main/messages/applyJobMessage';
import applyJobValidation from '../../../main/validations/applyJobValidation'
import applyHTTPService from '../../../main/services/applyHTTPService';

const EditApplyApplyJob = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [applyJob, setApplyJob] = useState(props.applyJob);

  useEffect(() => {
    setApplyJob(props.applyJob)
  }, [props.applyJob]);


  const onSubmit = (data) => {
    applyHTTPService.editApply(props.applyJob.id, data).then(data => {
      showMessage('Confirmation', applyJobMessage.edit, 'success')
    })
    // ApplyJobTestService.update(props.applyJob, data)

  }
  const handleInputChange = event => {
    const { name, value } = event.target;
    setApplyJob({ ...applyJob, [name]: value });
  };

  return (
    <div className="EditApplyApplyJob">
      <form className="ajax-form" method="POST" id="createForm" onSubmit={handleSubmit(onSubmit)}>

        <div className="row">

          <div className="col-md-8">
            <div className="form-group">
              <label className="control-label required"><font   ><font   >Candidate</font></font></label>
              <input ref={register({ required: true })} className="form-control" value={applyJob.candidate}
                onChange={handleInputChange} type="text" name="candidate" placeholder="Nom" />
              <div className="error text-danger">
                {errors.candidate && applyJobValidation.candidate}
              </div>

            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >job Offer</font></font></label>
              <input className="form-control" value={applyJob.jobOffer} ref={register({ required: true })}
                onChange={handleInputChange} type="text" name="jobOffer" placeholder="Email" />
              <div className="error text-danger">
                {errors.jobOffer && applyJobValidation.jobOffer}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >date Application</font></font></label>
              <input className="form-control" value={applyJob.dateApplication} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="dateApplication" />
              <div className="error text-danger">
                {errors.dateApplication && applyJobValidation.dateApplication}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >status</font></font></label>
              <input className="form-control" value={applyJob.status} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="status" placeholder="Téléphone" />
              <div className="error text-danger">
                {errors.status && applyJobValidation.status}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >appreciation</font></font></label>
              <input className="form-control" value={applyJob.appreciation} ref={register({ required: true })}
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

EditApplyApplyJob.propTypes = {};

EditApplyApplyJob.defaultProps = {};

export default EditApplyApplyJob;
