import React, { useState } from 'react';
import './AddApplyJob.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages'
import applyJobMessage from '../../../main/messages/interviewMessage'
import applyJobValidation from '../../../main/validations/applyJobValidation'
import ApplyJobTestService from '../../../main/mocks/ApplyJobTestService';
import HTTPService from '../../../main/services/HTTPService';


const AddApplyJob = () => {

  const initialState = {
    full_name: "",
    email: "",
    phone: "",
    cover_letter: ""
  };
  const [job, setJob] = useState(initialState);
  const { register, handleSubmit, errors } = useForm()


  const onSubmit = (data) => {
    //saveJob(data)
    ApplyJobTestService.create(data)
    setJob(initialState)
    showMessage('Confirmation', applyJobMessage.add, 'success')
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
              <label className="control-label required"><font   ><font   >Nom</font></font></label>
              <input ref={register({ required: true })} className="form-control" value={job.full_name}
                onChange={handleInputChange} type="text" name="full_name" placeholder="Nom" />
              <div className="error text-danger">
                {errors.full_name && applyJobValidation.full_name}
              </div>

            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Email</font></font></label>
              <input className="form-control" value={job.email} ref={register({ required: true })}
                onChange={handleInputChange} type="email" name="email" placeholder="Email" />
              <div className="error text-danger">
                {errors.email && applyJobValidation.email}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Téléphone</font></font></label>
              <input className="form-control" value={job.phone} ref={register({ required: true })}
                onChange={handleInputChange} type="tel" name="phone" placeholder="Téléphone" />
              <div className="error text-danger">
                {errors.candidates && applyJobValidation.phone}
              </div>
            </div>


          </div>
        </div>


        <div id="show-sections">


          <div className="row b-b">
            <div className="col-md-4 pl-4 pr-4 pb-4 pt-4 b-b">
              <h5><font   ><font   >Photo</font></font></h5>
            </div>


            <div className="col-md-8 pb-4 pt-4 b-b">
              <div className="form-group">
                <input className="select-file" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.rtf"
                  type="file" name="resume" /><br />

              </div>
            </div>
          </div>
          <div className="row b-b">
            <div className="col-md-4 pl-4 pr-4 pb-4 pt-4 b-b">
              <h5><font   ><font   >CV</font></font></h5>
            </div>


            <div className="col-md-8 pb-4 pt-4 b-b">
              <div className="form-group">
                <input className="select-file" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.rtf"
                  type="file" name="resume" /><br />

              </div>
            </div>


            <div className="col-md-4 pl-4 pr-4 pt-4 b-b">
              <h5><font   ><font   >Lettre de motivation</font></font></h5>
            </div>
            <div className="col-md-8 pt-4 b-b">
              <div className="form-group">
                <textarea className="form-control" value={job.cover_letter} ref={register({ required: true })}
                  onChange={handleInputChange} name="cover_letter" rows="4"></textarea>
                <div className="error text-danger">
                  {errors.cover_letter && applyJobValidation.cover_letter}
                </div>
              </div>
            </div>
          </div></div>



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
