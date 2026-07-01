import React, { useEffect, useState } from 'react';
import './EditJob.css';
import { useForm } from 'react-hook-form';
import JobTestService from '../../../main/mocks/JobTestService';
import showMessage from '../../../libraries/messages/messages';
import jobMessage from '../../../main/messages/jobMessage';
import jobHTTPService from '../../../main/services/jobHTTPService';
import jobValidation from '../../../main/validations/jobValidations'
const EditJob = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [job, setJob] = useState(props.job);

  useEffect(() => {
    setJob(props.job)
  }, [props.job]);


  const onSubmit = (data) => {

    //JobTestService.update(props.job, data)
    jobHTTPService.editJob(props.job.id, data).then(data => {
      showMessage('Confirmation', jobMessage.edit, 'success')
      props.closeModal()
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setJob({ ...job, [name]: value });
  };


  return (
    <div className="EditJob">
      <form onSubmit={handleSubmit(onSubmit)}>


        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Role</label>
          <div className="col-8">
            <div className="input-group">
              <input onChange={handleInputChange} value={job.post} id="text" name="post" type="text" className="form-control" ref={register({ required: true })} />
            </div>
            <div className="error text-danger">
              {errors.post && jobValidation.post}
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="textarea" className="col-4 col-form-label">Description</label>
          <div className="col-8">
            <textarea onChange={handleInputChange} value={job.description} id="textarea" name="description" cols="40" rows="5" className="form-control" ref={register({ required: true })} ></textarea>
            <div className="error text-danger">
              {errors.description && jobValidation.description}
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="textarea1" className="col-4 col-form-label">Requirements</label>
          <div className="col-8">
            <textarea onChange={handleInputChange} value={job.requirement} id="requirement" name="requirement" cols="40" rows="5" className="form-control" ref={register({ required: true })} ></textarea>
          </div>
          <div className="error text-danger">
            {errors.requirement && jobValidation.requirement}
          </div>
        </div>


        <div className="form-group row">
          <label htmlFor="text2" className="col-4 col-form-label">Location</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={job.location} id="text2" name="location" type="text" className="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.location && jobValidation.location}
            </div>
          </div>

        </div>


        <div className="form-group row">
          <label htmlFor="select1" className="col-4 col-form-label">Category</label>
          <div className="col-8">
            <select className="custom-select" name="category" ref={register({ required: true })}>
              <option value="Développement">IT</option>
              <option value="Design">Design</option>
            </select>
            <div className="error text-danger">
              {errors.category && jobValidation.category}
            </div>
          </div>

        </div>


        <div className="form-group row">
          <label htmlFor="select3" className="col-4 col-form-label">Skills</label>
          <div className="col-8">
            <select name="skill" className="custom-select" ref={register({ required: true })}>
              <option value="PHP">PHP</option>
              <option value="Java">Java</option>
            </select>
            <div className="error text-danger">
              {errors.skill && jobValidation.skill}
            </div>
          </div>

        </div>


        <div className="form-group row">
          <label htmlFor="text4" className="col-4 col-form-label">Start</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={job.start} id="text4" name="start" type="date" className="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.start && jobValidation.start}
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text3" className="col-4 col-form-label">End</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={job.end} id="text3" name="end" type="date" className="form-control" ref={register({ required: true })} />
            <div className="error text-danger">
              {errors.end && jobValidation.end}
            </div>
          </div>

        </div>


        <div className="form-group row">
          <label htmlFor="select4" className="col-4 col-form-label">Status</label>
          <div className="col-8">
            <select onChange={handleInputChange} id="select4" name="active" value={job.active} className="custom-select" ref={register({ required: true })}>
              <option value="Available">Available</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="error text-danger">
              {errors.state && jobValidation.state}
            </div>
          </div>

        </div>



        <div className="form-group row">
          <div className="offset-4 col-8">
            <button name="submit" type="submit" className="btn btn-primary">
              <i className="fa fa-check"></i><font><font> Save</font></font></button>

          </div>
        </div>


      </form>
    </div>
  )
};

EditJob.propTypes = {};

EditJob.defaultProps = {};

export default EditJob;

