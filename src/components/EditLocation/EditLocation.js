import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditLocation.css';

import locationHTTPService from '../../main/services/locationHTTPService'
const EditLocation = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.location);

  useEffect(() => {
    setGroupe(props.location)
  }, [props.location]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.location, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    locationHTTPService.editLocation(props.location.id, data)
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
            <div className="error text-danger">
              {errors.groupe_name && groupeValidation.groupe_name}
            </div>
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

EditLocation.propTypes = {};

EditLocation.defaultProps = {};

export default EditLocation;

