import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditCandidate.css';
import { useForm } from 'react-hook-form';
import candidateHTTPService from '../../../main/services/candidateHTTPService'
const EditCandidate = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.groupe);

  useEffect(() => {
    setGroupe(props.groupe)
  }, [props.groupe]);


  const onSubmit = (data) => {

    candidateHTTPService.editCandidate(props.candidate.id, data).then(data => {
      //showMessage('Confirmation', 'groupeMessage.edit', 'success')
    })

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
EditCandidate.propTypes = {};

EditCandidate.defaultProps = {};

export default EditCandidate;
