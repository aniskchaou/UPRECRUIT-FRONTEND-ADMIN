import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditJobsPage.css';

import frontOfficeHTTPService from '../../main/services/jobHTTPService'
const EditJobsPage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.frontOffice);

  useEffect(() => {
    setGroupe(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.frontOffice, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    frontOfficeHTTPService.editJob(props.frontOffice.id)
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

EditJobsPage.propTypes = {};

EditJobsPage.defaultProps = {};

export default EditJobsPage;
