import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddApplyJob.css';
import ApplyJobService from '../../../main/services/ApplyJobService';
import { useForm } from 'react-hook-form';

const AddApplyJob = () => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook

  const initialState = {
    full_name: "anis",
    email: "",
    phone: "",
    cover_letter: "sdfsd"
  };


  const [job, setJob] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);



  const handleInputChange = event => {
    const { name, value } = event.target;
    setJob({ ...job, [name]: value });
  };

  const saveJob = () => {
    var data = {
      full_name: job.full_name,
      email: job.email,
      phone: job.phone,
      cover_letter: job.cover_letter
    };

    ApplyJobService.create(data)
      .then(response => {
        setJob({
          full_name: response.job.full_name,
          email: response.job.email,
          phone: response.job.phone,
          cover_letter: response.job.cover_letter
        });
        setSubmitted(true);
        console.log(response.data);
        newJob()
      })
      .catch(e => {
        console.log(data);
        console.log(e);

      });
  };

  const newJob = () => {
    setJob(initialState);
    setSubmitted(false);
  };

  const isSubmitted = () => {
    if (submitted) { return <h1>Yess</h1> }
    else { return <p></p> }
  };



  return (
    <div classNameName="AddApplyJob">
      { isSubmitted()}
      <form className="ajax-form" method="POST" id="createForm">



        <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB" />
        <div className="row">



          <div className="col-md-8">


            <div className="form-group">
              <label className="control-label required"><font   ><font   >Nom</font></font></label>
              <input ref={register({ required: true })} className="form-control" value={job.full_name}
                onChange={handleInputChange} type="text" name="full_name" placeholder="Nom" />

              <div className="error text-danger">
                {errors.full_name && 'Last name is required.'}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Email</font></font></label>
              <input className="form-control" value={job.email}
                onChange={handleInputChange} type="email" name="email" placeholder="Email" />
            </div>

            <div className="form-group">
              <label className="control-label required"><font   ><font   >Téléphone</font></font></label>
              <input className="form-control" value={job.phone}
                onChange={handleInputChange} type="tel" name="phone" placeholder="Téléphone" />
            </div>

            <div id="show-columns"></div>
          </div>
        </div>


        <div id="show-sections">


          <div className="row b-b">
            <div className="col-md-4 pl-4 pr-4 pb-4 pt-4 b-b">
              <h5><font   ><font   >Photo</font></font></h5>
            </div>


            <div className="col-md-8 pb-4 pt-4 b-b">
              <div className="form-group">
                <input className="select-file" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.rtf" type="file" name="resume" /><br />

              </div>
            </div>
          </div>
          <div className="row b-b">
            <div className="col-md-4 pl-4 pr-4 pb-4 pt-4 b-b">
              <h5><font   ><font   >CV</font></font></h5>
            </div>


            <div className="col-md-8 pb-4 pt-4 b-b">
              <div className="form-group">
                <input className="select-file" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.rtf" type="file" name="resume" /><br />

              </div>
            </div>


            <div className="col-md-4 pl-4 pr-4 pt-4 b-b">
              <h5><font   ><font   >Lettre de motivation</font></font></h5>
            </div>


            <div className="col-md-8 pt-4 b-b">

              <div className="form-group">
                <textarea className="form-control" value={job.cover_letter}
                  onChange={handleInputChange} name="cover_letter" rows="4"></textarea>
              </div>
            </div>
          </div></div>



        <br />
        <button onClick={handleSubmit(saveJob)} type="button" id="save-form" className="btn btn-success"><i className="fa fa-check"></i>
          <font   ><font   > Sauvegarder</font></font></button>
        
      </form>
    </div>
  )
};

AddApplyJob.propTypes = {};

AddApplyJob.defaultProps = {};

export default AddApplyJob;
