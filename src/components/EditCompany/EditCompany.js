import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditCompany.css';

import companyHTTPService from '../../main/services/companyHTTPService'
import showMessage from '../../libraries/messages/messages';
const EditCompany = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(props.ccompany);

  useEffect(() => {
    setCompany(props.ccompany)
  }, [props.ccompany]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.ccompany, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    console.log(data)
    companyHTTPService.editCompany(props.ccompany.id, data).then(data => {
      showMessage('Confirmation', 'groupeMessage.edit', 'success')
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCompany({ ...company, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Name</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.name} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Email</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.email} ref={register({ required: true })}
              id="text" name="email" type="text" class="form-control" />

          </div>
        </div>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Category</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.category} ref={register({ required: true })}
              id="text" name="category" type="text" class="form-control" />

          </div>
        </div>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Address</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.address} ref={register({ required: true })}
              id="text" name="address" type="text" class="form-control" />

          </div>
        </div>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Website</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.website} ref={register({ required: true })}
              id="text" name="website" type="text" class="form-control" />

          </div>
        </div>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Size</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={company?.size} ref={register({ required: true })}
              id="text" name="size" type="text" class="form-control" />

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

}


EditCompany.propTypes = {};

EditCompany.defaultProps = {};

export default EditCompany;
