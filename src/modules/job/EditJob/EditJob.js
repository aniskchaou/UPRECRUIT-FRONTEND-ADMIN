import React from 'react';
import PropTypes from 'prop-types';
import './EditJob.css';

const EditJob = () => (
  <div className="EditJob">
        <form>
  <div class="form-group row">
    <label for="text" class="col-4 col-form-label">Poste</label> 
    <div class="col-8">
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <i class="fa fa-address-card"></i>
          </div>
        </div> 
        <input id="text" name="text" type="text" class="form-control"/>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="textarea" class="col-4 col-form-label">Description</label> 
    <div class="col-8">
      <textarea id="textarea" name="textarea" cols="40" rows="5" class="form-control"></textarea>
    </div>
  </div>
  <div class="form-group row">
    <label for="textarea1" class="col-4 col-form-label">Exigence</label> 
    <div class="col-8">
      <textarea id="textarea1" name="textarea1" cols="40" rows="5" class="form-control"></textarea>
    </div>
  </div>
  <div class="form-group row">
    <label for="text2" class="col-4 col-form-label">Lieu</label> 
    <div class="col-8">
      <input id="text2" name="text2" type="text" class="form-control"/>
    </div>
  </div>
  <div class="form-group row">
    <label for="select1" class="col-4 col-form-label">Catégorie</label> 
    <div class="col-8">
      <select id="select1" name="select1" class="custom-select">
        <option value="Développement">Développement</option>
        <option value="Devops">Devops</option>
      </select>
    </div>
  </div>
  <div class="form-group row">
    <label for="select3" class="col-4 col-form-label">Compétences</label> 
    <div class="col-8">
      <select multiple="multiple" id="select3" name="select3" class="custom-select">
        <option value="PHP">PHP</option>
        <option value="Java">Java</option>
      </select>
    </div>
  </div>
  <div class="form-group row">
    <label for="text4" class="col-4 col-form-label">Date Début</label> 
    <div class="col-8">
      <input id="text4" name="text4" type="text" class="form-control"/>
    </div>
  </div>
  <div class="form-group row">
    <label for="text3" class="col-4 col-form-label">Date fin</label> 
    <div class="col-8">
      <input id="text3" name="text3" type="text" class="form-control"/>
    </div>
  </div>
  <div class="form-group row">
    <label for="select4" class="col-4 col-form-label">staut</label> 
    <div class="col-8">
      <select id="select4" name="select4" class="custom-select">
        <option value="rabbit">Actif</option>
        <option value="fish">Inacr=tive</option>
      </select>
    </div>
  </div> 
  <div class="form-group row">
    <div class="offset-4 col-8">
      <button name="submit" type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</form>
  </div>
);

EditJob.propTypes = {};

EditJob.defaultProps = {};

export default EditJob;
