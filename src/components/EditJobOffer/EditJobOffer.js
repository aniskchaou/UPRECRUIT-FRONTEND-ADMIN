import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditJobOffer.css';

import jobHTTPService from '../../main/services/jobHTTPService'
const EditJobOffer = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.job);

  useEffect(() => {
    setGroupe(props.job)
  }, [props.job]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.job, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    jobHTTPService.createJob(props.frontOffice.id, data)
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setGroupe({ ...groupe, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Nom du groupe</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={groupe?.groupe_name} ref={register({ required: true })}
              id="text" name="groupe_name" type="text" class="form-control" />

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
EditJobOffer.propTypes = {};

EditJobOffer.defaultProps = {};

export default EditJobOffer;
