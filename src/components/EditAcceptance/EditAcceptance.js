import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditAcceptance.css';

import acceptanceHTTPService from '../../main/services/acceptanceHTTPService'
const EditAcceptance = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [acceptance, setAcceptance] = useState(props.acceptance);

  useEffect(() => {
    setAcceptance(props.acceptance)
  }, [props.acceptance]);


  const onSubmit = (data) => {

    acceptanceHTTPService.editAcceptance(props.acceptance.id, data).then(data => {
      // showMessage('Confirmation', 'groupeMessage.edit', 'success')
      props.closeModal()
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setAcceptance({ ...acceptance, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >Name</font></font></label>
          <input className="form-control" value={acceptance.name} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="name" placeholder="Name" />

        </div>

        <div className="form-group">
          <label className="control-label required"><font   ><font   >Description</font></font></label>
          <input className="form-control" value={acceptance.description} ref={register({ required: true })}
            onChange={handleInputChange} type="text" name="description" placeholder="Description" />

        </div>


        <div className="form-group row">
          <div className="col-8">
            <button name="submit" type="submit" className="btn btn-primary"><i className="far fa-save"></i>Save</button>
          </div>
        </div>

      </form>
    </div>
  )
};

EditAcceptance.propTypes = {};

EditAcceptance.defaultProps = {};

export default EditAcceptance;

