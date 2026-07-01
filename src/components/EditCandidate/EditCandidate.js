import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditCandidate.css';
import { useForm } from 'react-hook-form';
import candidateHTTPService from '../../main/services/candidateHTTPService'
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

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Nom du groupe</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.groupe_name || ""} ref={register({ required: true })}
              id="text" name="groupe_name" type="text" className="form-control" />

          </div>
        </div>


        <div className="form-group row">
          <div className="offset-4 col-8">
            <button name="submit" type="submit" className="btn btn-primary"><i className="far fa-save"></i>Sauvegarder</button>
          </div>
        </div>

      </form>
    </div>
  )
};
EditCandidate.propTypes = {};

EditCandidate.defaultProps = {};

export default EditCandidate;

