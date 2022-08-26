import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditLanguage.css';

import languageHTTPService from '../../main/services/LanguageHTTPService'
const EditLanguage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [language, setLanguage] = useState(props.language);

  useEffect(() => {
    setLanguage(props.language)
  }, [props.language]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.language, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    languageHTTPService.editLanguage(props.language.id, data)
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLanguage({ ...language, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Language</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={language?.language} ref={register({ required: true })}
              id="text" name="language" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Level</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={language?.level} ref={register({ required: true })}
              id="text" name="level" type="text" class="form-control" />

          </div>
        </div>


        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i> Save</button>
          </div>
        </div>

      </form>
    </div>
  )
};

EditLanguage.propTypes = {};

EditLanguage.defaultProps = {};

export default EditLanguage;
