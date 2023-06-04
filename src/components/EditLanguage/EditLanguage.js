import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditLanguage.css';

import languageHTTPService from '../../main/services/LanguageHTTPService'
import companyValidation from '../../main/validations/companyValidation';
const EditLanguage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [language, setLanguage] = useState(props.language);

  useEffect(() => {
    setLanguage(props.language)
  }, [props.language]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.language, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    languageHTTPService.editLanguage(props.language.id, data).then(() => {
      props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLanguage({ ...language, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >Language</font></font></label>
          <input className="form-control" value={language.language} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="language" placeholder="Language" />
          <div className="error text-danger">
            {errors.language && companyValidation.language}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >Level</font></font></label>
          <input className="form-control" value={language.level} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="level" placeholder="Level" />
          <div className="error text-danger">
            {errors.level && companyValidation.level}
          </div>
        </div>


        <div class="form-group row">
          <div class="col-8">
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
