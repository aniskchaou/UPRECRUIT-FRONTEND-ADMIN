import React, { useEffect, useState } from 'react';
import './AddApplyJob.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages'
import applyJobMessage from '../../../main/messages/interviewMessage'
import applyJobValidation from '../../../main/validations/applyJobValidation'
import ApplyJobTestService from '../../../main/mocks/ApplyJobTestService';
import HTTPService from '../../../main/services/HTTPService';
import applyHTTPService from '../../../main/services/applyHTTPService'
import candidateHTTPService from '../../../main/services/candidateHTTPService'
import jobHTTPService from '../../../main/services/jobHTTPService';

const AddApplyJob = (props) => {

  const initialState = {
    condidate: '',
    jobOffer: '',
    dateApplication: '',
    status: '',
    appreciation: ''
  };
  const [job, setJob] = useState(initialState);
  const { register, handleSubmit, errors } = useForm()
  const [candidates, setCandidates] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);

  useEffect(() => {
    candidateHTTPService.getAllCandidate().then(data => {
      setCandidates(data.data)
    })

    jobHTTPService.getAllJob().then(data => {
      setJobOffers(data.data)
    })
  }, [])


  const onSubmit = (data) => {
    console.log(data)
    //saveJob(data)
    //ApplyJobTestService.create(data)
    applyHTTPService.createApply(data).then(data => {
      setJob(initialState)
      showMessage('Confirmation', applyJobMessage.add, 'success')
      props.closeModal()
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

          <div className="col-md-12">
            <div className="form-group">
              <label className="control-label required"><font   ><font   >Candidate</font></font></label>
              <select ref={register({ required: true })} className="form-control" value={job.candidate}
                onChange={handleInputChange} type="text" name="candidate" placeholder="Nom" >
                {candidates.map(item =>
                  <option value={item.id}>{item.firstName + ' ' + item.lastName}</option>
                )}
              </select>
              <div className="error text-danger">
                {errors.candidate && applyJobValidation.candidate}
              </div>

            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Job Offer</font></font></label>
              <select className="form-control" value={job.jobOffer} ref={register({ required: true })}
                onChange={handleInputChange} type="text" name="jobOffer" placeholder="Email" >
                {jobOffers.map(item =>
                  <option value={item.id}>{item.post}</option>
                )}
              </select>
              <div className="error text-danger">
                {errors.jobOffer && applyJobValidation.jobOffer}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Application Date</font></font></label>
              <input className="form-control" value={job.dateApplication} ref={register({ required: true })}
                onChange={handleInputChange} type="date" name="dateApplication" />
              <div className="error text-danger">
                {errors.dateApplication && applyJobValidation.dateApplication}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >Status</font></font></label>
              <select className="form-control" value={job.status} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="status" placeholder="Status" >
                <option value="Accepted">Accepted</option>
                <option value="Refused">Refused</option>
              </select>
              <div className="error text-danger">
                {errors.status && applyJobValidation.status}
              </div>
            </div>


            <div className="form-group">
              <label className="control-label required"><font   ><font   >Appreciation</font></font></label>
              <select className="form-control" value={job.appreciation} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="appreciation" placeholder="Téléphone">
                <option value="Good">Good</option>
                <option value="Bad">Bad</option>
              </select>
              <div className="error text-danger">
                {errors.appreciation && applyJobValidation.appreciation}
              </div>
            </div>



          </div>
        </div>





        <br />
        <button type="submit" id="save-form" className="btn btn-success">
          <i className="fa fa-check"></i>
          <font   ><font   > Save</font></font></button>

      </form>
    </div>
  )
};

AddApplyJob.propTypes = {};

AddApplyJob.defaultProps = {};

export default AddApplyJob;
