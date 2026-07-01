import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditFooterPage.css';

import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService'
const EditFooterPage = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.frontOffice);

  useEffect(() => {
    setGroupe(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.frontOffice, data)
    // showMessage('Confirmation', groupeMessage.edit, 'success')
    frontOfficeHTTPService.editFooterPage(props.frontOffice.id, data).then(data => {

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
            <input onChange={handleInputChange} value={groupe?.title1 || ""} ref={register({ required: true })}
              id="text" name="title1" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Nom du groupe</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.title2 || ""} ref={register({ required: true })}
              id="text" name="title2" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Nom du groupe</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.title3 || ""} ref={register({ required: true })}
              id="text" name="title3" type="text" className="form-control" />

          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="text" className="col-4 col-form-label">Nom du groupe</label>
          <div className="col-8">
            <input onChange={handleInputChange} value={groupe?.title4 || ""} ref={register({ required: true })}
              id="text" name="title4" type="text" className="form-control" />

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
EditFooterPage.propTypes = {};

EditFooterPage.defaultProps = {};

export default EditFooterPage;

