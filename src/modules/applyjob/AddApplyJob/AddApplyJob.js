import React from 'react';
import PropTypes from 'prop-types';
import './AddApplyJob.css';

const AddApplyJob = () => (
  <div classNameName="AddApplyJob">
    <form className="ajax-form" method="POST" id="createForm">



      <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB" />
      <div className="row">



        <div className="col-md-8">


          <div className="form-group">
            <label className="control-label required"><font   ><font   >Nom</font></font></label>
            <input className="form-control" type="text" name="full_name" placeholder="Nom" />
          </div>

          <div className="form-group">
            <label className="control-label required"><font   ><font   >Email</font></font></label>
            <input className="form-control" type="email" name="email" placeholder="Email" />
          </div>

          <div className="form-group">
            <label className="control-label required"><font   ><font   >Téléphone</font></font></label>
            <input className="form-control" type="tel" name="phone" placeholder="Téléphone" />
          </div>

          <div id="show-columns"></div>
        </div>
      </div>


      <div id="show-sections"><div className="row b-b">
        <div className="col-md-8 offset-md-4">
          <div className="form-group">
            <h6>
              <strong><font   ><font   >
                Photo                    </font></font></strong>
            </h6>
            <input className="select-file" accept=".png,.jpg,.jpeg" type="file" name="photo" /><br />
            <span><font   ><font   >Nous acceptons les fichiers PNG, JPG et JPEG</font></font></span>
          </div>
        </div>
      </div>

        <div className="row b-b">
          <div className="col-md-4 pl-4 pr-4 pb-4 pt-4 b-b">
            <h5><font   ><font   >CV</font></font></h5>
          </div>


          <div className="col-md-8 pb-4 pt-4 b-b">
            <div className="form-group">
              <input className="select-file" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.rtf" type="file" name="resume" /><br />
              <span><font   ><font   >Nous acceptons les fichiers JPEG, JPG, PNG, DOC, DOCX, RTF, XLS, XLSX et PDF</font></font></span>
            </div>
          </div>


          <div className="col-md-4 pl-4 pr-4 pt-4 b-b">
            <h5><font   ><font   >Lettre de motivation</font></font></h5>
          </div>


          <div className="col-md-8 pt-4 b-b">

            <div className="form-group">
              <textarea className="form-control" name="cover_letter" rows="4"></textarea>
            </div>
          </div>
        </div></div>



      <br />
      <button type="button" id="save-form" className="btn btn-success"><i className="fa fa-check"></i>
      <font   ><font   > Sauvegarder</font></font></button>

    </form>
  </div>
);

AddApplyJob.propTypes = {};

AddApplyJob.defaultProps = {};

export default AddApplyJob;
