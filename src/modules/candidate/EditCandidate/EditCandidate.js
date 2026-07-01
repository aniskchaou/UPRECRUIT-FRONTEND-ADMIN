import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditCandidate.css';
import { useForm } from 'react-hook-form';
import candidateHTTPService from '../../../main/services/candidateHTTPService'
const EditCandidate = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [candidate, setCandidate] = useState(props.candidate);

  useEffect(() => {
    setCandidate(props.candidate)
  }, [props.candidate]);


  const onSubmit = (data) => {
    console.log(data)

    candidateHTTPService.editCandidate(props.candidate.id, data).then(data => {
      //showMessage('Confirmation', 'groupeMessage.edit', 'success')
      props.closeModal()
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Firstname</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.firstName || ""} ref={register({ required: true })}
              id="text" name="firstName" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">lastName</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.lastName || ""} ref={register({ required: true })}
              id="text" name="lastName" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">email</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.email || ""} ref={register({ required: true })}
              id="text" name="email" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Telephone</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.phone || ""} ref={register({ required: true })}
              id="text" name="phone" type="text" className="form-control" />

          </div>
        </div>


        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">date Of birth</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.dateOfBirth || ""} ref={register({ required: true })}
              id="text" name="dateOfBirth" type="date" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">gender</label>
          <div className="col-8">
            <select onChange={handleInputChange} value={candidate?.gender || ""} ref={register({ required: true })}
              id="text" name="gender" type="text" className="form-control" >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

          </div>
        </div>


        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Availability</label>
          <div className="col-8">
            <select onChange={handleInputChange} value={candidate?.immediateAvailable || ""} ref={register({ required: true })}
              id="text" name="immediateAvailable" type="text" className="form-control" >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Skills</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.skills || ""} ref={register({ required: true })}
              id="text" name="skills" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Note</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.note || ""} ref={register({ required: true })}
              id="text" name="note" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Salary</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.salary || ""} ref={register({ required: true })}
              id="text" name="salary" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Language</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.language || ""} ref={register({ required: true })}
              id="text" name="language" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Remote Work</label>
          <div className="col-8">
            <select onChange={handleInputChange} value={candidate?.remoteWork || ""} ref={register({ required: true })}
              id="text" name="remoteWork" type="text" className="form-control" >
              <option value="Fulltime">full time</option>
              <option value="PartTime">part time</option>
            </select>

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Experience</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.experience || ""} ref={register({ required: true })}
              id="text" name="experience" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">City</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.city || ""} ref={register({ required: true })}
              id="text" name="city" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Nationality</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.nationality || ""} ref={register({ required: true })}
              id="text" name="nationality" type="text" className="form-control" />

          </div>
        </div>


        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Career Level</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.careerLevel || ""} ref={register({ required: true })}
              id="text" name="careerLevel" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Address</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.address || ""} ref={register({ required: true })}
              id="text" name="address" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Category</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.categoryJob || ""} ref={register({ required: true })}
              id="text" name="categoryJob" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Country</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={candidate?.country || ""} ref={register({ required: true })}
              id="text" name="country" type="text" className="form-control" />

          </div>
        </div>




        <div className="form-group row">
          <div className="offset-4 col-8">
            <button name="submit" type="submit" className="btn btn-primary">Save</button>
          </div>
        </div>

      </form>
    </div>
  )
};
EditCandidate.propTypes = {};

EditCandidate.defaultProps = {};

export default EditCandidate;

