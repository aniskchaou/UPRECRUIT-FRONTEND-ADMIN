import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditContract.css';

import contractHTTPService from '../../main/services/companyHTTPService'
const EditContract = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.contract);

  useEffect(() => {
    setGroupe(props.contract)
  }, [props.contract]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.contract, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    contractHTTPService.editCompany(props.contract.id, data)
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

EditContract.propTypes = {};

EditContract.defaultProps = {};

export default EditContract;

