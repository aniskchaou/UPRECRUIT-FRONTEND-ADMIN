import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditSkill.css';

import skillHTTPService from '../../main/services/skillHTTPService'
const EditSkill = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [skill, setSkill] = useState(props.skill);

  useEffect(() => {
    setSkill(props.skill)
  }, [props.skill]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.skill, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    skillHTTPService.editSkill(props.skill.id, data)
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setSkill({ ...skill, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Nom du groupe</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={skill?.name} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
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

EditSkill.propTypes = {};

EditSkill.defaultProps = {};

export default EditSkill;
