import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddCompany.css';
import { compose } from 'redux';
import companyHTTPService from '../../main/services/companyHTTPService';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
import categoryMessage from '../../main/messages/categoryMessage';
import companyValidation from '../../main/validations/companyValidation';
const AddCompany = (props) => {
  const initialState = {
    name: '',
    email: '',
    category: '',
    telephone: '',
    address: '',
    website: '',
    size: '',
    logo: '',
    file: null

  };
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [company, setCompany] = useState(initialState);

  useEffect(() => {
    setCompany({ 'file': null });
    //setService(initialState)
  }, []);



  const onSubmit = (data) => {
    //saveCategory(data)
    //CategoryTestService.create(data)

    /* companyHTTPService.createCompany(data).then(data => {
      setCompany(initialState)
      props.closeModal()
      // showMessage('Confirmation', categoryMessage.add, 'success')
    }) */


    const formData = new FormData(document.getElementById("addCompany"));

    // Update the formData object 
    /* formData.append(
      "file",
      service.file,
      'file'
    ); */


    //setService({ 'fileName': formData.get('file').name })

    console.log(formData.get('file').name)

    companyHTTPService.uploadFile(formData).then(data => { })
    companyHTTPService.createCompany(formData.get('file').name, data).then(data => {
      setCompany(initialState)
      // showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success')
      //props.closeModal()
    })




  }

  const saveCategory = (data) => {


  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setCompany({ ...company, [name]: value });
  };

  const handleFileChange = event => {

    setCompany({ 'file': event.target.files[0] });
    // setService({ 'fileName': event.target.files[0].name });
  };

  return (
    <div className="AddCompany">


      <form className="ajax-form" enctype="multipart/form-data" onSubmit={handleSubmit(onSubmit)} id="addCompany" >

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


              <div className="form-group">
                <label className="control-label required"><font   ><font   >Logo</font></font></label>
                <input className="form-control" value={company.logo} ref={register({ required: true })}
                  onChange={handleFileChange} type="file" name="file" placeholder="Size" />
                <div className="error text-danger">
                  {errors.logo && companyValidation.logo}
                </div>
              </div>



            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
      </form>
    </div>
  )
};

AddCompany.propTypes = {};

AddCompany.defaultProps = {};

export default AddCompany;
