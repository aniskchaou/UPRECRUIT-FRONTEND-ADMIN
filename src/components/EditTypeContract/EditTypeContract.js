import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditTypeContract.css';

import typeContractHTTPService from '../../main/services/typecontractHTTPService'
const EditTypeContract = () => (
  <div className="AddCategory">


    <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

      <div id="education_fields">
        <div className="row">
          <div className="col-sm-9 nopadding">


            <div className="form-group">
              <label className="control-label required"><font   ><font   >name</font></font></label>
              <input className="form-control" value={company?.name} ref={register({ required: true })}
                onChange={handleInputChange} type="text" name="name" placeholder="Email" />
              <div className="error text-danger">
                {errors.name && companyValidation.name}
              </div>
            </div>



          </div>
        </div>
      </div>

      <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
    </form>
  </div>
);

EditTypeContract.propTypes = {};

EditTypeContract.defaultProps = {};

export default EditTypeContract;
