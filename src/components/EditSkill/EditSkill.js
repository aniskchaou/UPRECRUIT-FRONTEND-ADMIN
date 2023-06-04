import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditSkill.css';

import skillHTTPService from '../../main/services/skillHTTPService'
import skillValidation from '../../main/validations/skillValidation';
const EditSkill = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [skill, setSkill] = useState(props.skill);

  useEffect(() => {
    setSkill(props.skill)
  }, [props.skill]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.skill, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    skillHTTPService.editSkill(props.skill.id, data).then(() => {
      props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setSkill({ ...skill, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form className="ajax-form" id="createForm" onSubmit={handleSubmit(onSubmit)}>

        <div className="row">
          <div className="col-md-9">

            <div className="form-group">
              <label for="address"><font   ><font   >Skill</font></font></label>
              <input onChange={handleInputChange}
                value={skill.name}
                ref={register({ required: true })}
                name="name" id="name"
                className="form-control"
              />
              <div className="error text-danger">
                {errors.name && skillValidation.name}
              </div>
            </div>

          </div>
        </div>



        <button type="submit" id="save-form" className="btn btn-success">
          <i className="fa fa-check"></i><font ><font  > Save</font></font></button>

      </form>
    </div>
  )
};

EditSkill.propTypes = {};

EditSkill.defaultProps = {};

export default EditSkill;
