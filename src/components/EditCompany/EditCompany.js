import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditCompany.css';

import companyHTTPService from '../../main/services/companyHTTPService'
import showMessage from '../../libraries/messages/messages';
import companyValidation from '../../main/validations/companyValidation';
const EditCompany = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(props.company);

  useEffect(() => {
    setCompany(props.company)
  }, [props.company]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.ccompany, data)
    //showMessage('Confirmation', groupeMessage.edit, 'success')
    console.log(data)
    companyHTTPService.editCompany(props.company.id, data).then(data => {
      showMessage('Confirmation', 'groupeMessage.edit', 'success')
      props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCompany({ ...company, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-md-12">


              <div className="form-group">
                <label className="control-label required"><font   ><font   >Name</font></font></label>
                <input className="form-control" value={company.name} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="name" placeholder="Name" />
                <div className="error text-danger">
                  {errors.name && companyValidation.name}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Email</font></font></label>
                <input className="form-control" value={company.email} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="email" placeholder="Email" />
                <div className="error text-danger">
                  {errors.email && companyValidation.email}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Category</font></font></label>
                <input className="form-control" value={company.category} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="category" placeholder="Category" />
                <div className="error text-danger">
                  {errors.category && companyValidation.category}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Telephone</font></font></label>
                <input className="form-control" value={company.telephone} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="telephone" placeholder="Telephone" />
                <div className="error text-danger">
                  {errors.telephone && companyValidation.telephone}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Address</font></font></label>
                <input className="form-control" value={company.address} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="address" placeholder="Address" />
                <div className="error text-danger">
                  {errors.address && companyValidation.address}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Website</font></font></label>
                <input className="form-control" value={company.website} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="website" placeholder="Website" />
                <div className="error text-danger">
                  {errors.website && companyValidation.website}
                </div>
              </div>

              <div className="form-group">
                <label className="control-label required"><font   ><font   >Size</font></font></label>
                <input className="form-control" value={company.size} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="size" placeholder="Size" />
                <div className="error text-danger">
                  {errors.size && companyValidation.size}
                </div>
              </div>



            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
      </form>
    </div>
  )

}


EditCompany.propTypes = {};

EditCompany.defaultProps = {};

export default EditCompany;
