import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditHeaderPage.css';

import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService'
const EditHeaderPage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.frontOffice);

  useEffect(() => {
    setGroupe(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.frontOffice, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    frontOfficeHTTPService.editHeaderPage(props.frontOffice.id, data)
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
            <input onChange={handleInputChange} value={groupe?.title} ref={register({ required: true })}
              id="text" name="title" type="text" class="form-control" />

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

EditHeaderPage.propTypes = {};

EditHeaderPage.defaultProps = {};

export default EditHeaderPage;
