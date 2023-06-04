import React, { useState } from 'react';
import './AddJob.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../../libraries/messages/messages'
import jobMessage from '../../../main/messages/jobMessage'
import jobValidation from '../../../main/validations/jobValidations'
import JobTestService from '../../../main/mocks/JobTestService';
import HTTPService from '../../../main/services/HTTPService';
import jobHTTPService from '../../../main/services/jobHTTPService';
const AddJob = (props) => {



  const initialState = {
    post: "",
    description: "",
    start: "",
    end: "",
    location: "",
    requirement: ""
  };

  const { register, handleSubmit, errors } = useForm()
  const [job, setJob] = useState(initialState);

  const onSubmit = (data) => {
    //saveJob(data)
    jobHTTPService.createJob(data).then(data => {
      setJob(initialState)
      showMessage('Confirmation', jobMessage.add, 'success')
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
    <div className="AddJob">


      <form onSubmit={handleSubmit(onSubmit)}>


        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Role</label>
          <div class="col-8">
            <div class="input-group">
              <input onChange={handleInputChange} value={job.post} id="text" name="post" type="text" class="form-control" ref={register({ required: true })} />
            </div>
            <div className="error text-danger">
              {errors.post && jobValidation.post}
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea" class="col-4 col-form-label">Description</label>
          <div class="col-8">
            <textarea onChange={handleInputChange} value={job.description} id="textarea" name="description" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
            <div className="error text-danger">
              {errors.description && jobValidation.description}
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea1" class="col-4 col-form-label">Requirements</label>
          <div class="col-8">
            <textarea onChange={handleInputChange} value={job.requirement} id="requirement" name="requirement" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
          <div className="error text-danger">
            {errors.requirement && jobValidation.requirement}
          </div>
        </div>


        <div class="form-group row">
          <label for="text2" class="col-4 col-form-label">Location</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={job.location} id="text2" name="location" type="text" class="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.location && jobValidation.location}
            </div>
          </div>

        </div>


        <div class="form-group row">
          <label for="select1" class="col-4 col-form-label">Category</label>
          <div class="col-8">
            <select class="custom-select" name="category" ref={register({ required: true })}>
              <option value="Développement">IT</option>
              <option value="Design">Design</option>
            </select>
            <div className="error text-danger">
              {errors.category && jobValidation.category}
            </div>
          </div>

        </div>


        <div class="form-group row">
          <label for="select3" class="col-4 col-form-label">Skills</label>
          <div class="col-8">
            <select name="skill" class="custom-select" ref={register({ required: true })}>
              <option value="PHP">PHP</option>
              <option value="Java">Java</option>
            </select>
            <div className="error text-danger">
              {errors.skill && jobValidation.skill}
            </div>
          </div>

        </div>


        <div class="form-group row">
          <label for="text4" class="col-4 col-form-label">Start</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={job.start} id="text4" name="start" type="date" class="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.start && jobValidation.start}
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="text3" class="col-4 col-form-label">End</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={job.end} id="text3" name="end" type="date" class="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.end && jobValidation.end}
            </div>
          </div>

        </div>


        <div class="form-group row">
          <label for="select4" class="col-4 col-form-label">Status</label>
          <div class="col-8">
            <select onChange={handleInputChange} id="select4" name="active" value={job.active} class="custom-select" ref={register({ required: true })}>
              <option value="Available">Available</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="error text-danger">
              {errors.state && jobValidation.state}
            </div>
          </div>

        </div>



        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary">
              <i className="fa fa-check"></i><font><font> Save</font></font></button>

          </div>
        </div>


      </form>

    </div>
  )
};

AddJob.propTypes = {};

AddJob.defaultProps = {};

export default AddJob;
