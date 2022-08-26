import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditExperience.css';

import experienceHTTPService from '../../main/services/experienceHTTPService'
const EditExperience = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [experience, setExperience] = useState(props.experience);

  useEffect(() => {
    setExperience(props.experience)
  }, [props.experience]);


  const onSubmit = (data) => {

    //  GroupeTestService.update(props.experience, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    experienceHTTPService.editExperience(props.experience.id, data).then(data => {

    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setExperience({ ...experience, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="control-label required"><font   ><font   >title</font></font></label>
          <input className="form-control" value={experience.title} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="title" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >company</font></font></label>
          <input className="form-control" value={experience.company} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="company" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >location</font></font></label>
          <input className="form-control" value={experience.location} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="location" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >startDate</font></font></label>
          <input className="form-control" value={experience.startDate} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="startDate" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >endDate</font></font></label>
          <input className="form-control" value={experience.endDate} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="endDate" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >status</font></font></label>
          <input className="form-control" value={experience.status} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="status" placeholder="Email" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >description</font></font></label>
          <input className="form-control" value={experience.description} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="description" placeholder="Email" />

        </div>



        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i>Sauvegarder</button>
          </div>
        </div>

      </form>
    </div>
  )
};

EditExperience.propTypes = {};

EditExperience.defaultProps = {};

export default EditExperience;
