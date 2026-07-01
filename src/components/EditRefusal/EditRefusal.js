import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditRefusal.css';

import RefusalHTTPService from '../../main/services/refusalHTTPService'
import refusalHTTPService from '../../main/services/refusalHTTPService';
const EditRefusal = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.refusal);

  useEffect(() => {
    setGroupe(props.refusal)
  }, [props.refusal]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.refusal, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    refusalHTTPService.editRefusal(props.refusal.id, data).then(data => {
      props.closeModal()
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
          <label htmlFor="text" className="col-4 col-form-label">name</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.name || ""} ref={register({ required: true })}
              id="text" name="name" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">description</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.description || ""} ref={register({ required: true })}
              id="text" name="description" type="text" className="form-control" />

          </div>
        </div>


        <div className="form-group row">
          <div className="offset-4 col-8">
            <button name="submit" type="submit" className="btn btn-primary"><i className="far fa-save"></i> Save</button>
          </div>
        </div>

      </form>
    </div>
  )
};

EditRefusal.propTypes = {};

EditRefusal.defaultProps = {};

export default EditRefusal;

