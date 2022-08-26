import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditServicePage.css';

import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService'
const EditServicePage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.frontOffice);

  useEffect(() => {
    setGroupe(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    frontOfficeHTTPService.editServicePage(props.frontOffice.id, data).then(data => {
      //  showMessage('Confirmation', 'groupeMessage.edit', 'success')
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
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i>Sauvegarder</button>
          </div>
        </div>

      </form>
    </div>
  )
};
EditServicePage.propTypes = {};

EditServicePage.defaultProps = {};

export default EditServicePage;
