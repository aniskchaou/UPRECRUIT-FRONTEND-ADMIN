import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddJob.css';
import { useForm } from 'react-hook-form';
import create from '../../../main/mocks/CategoryTestService';
import CategoryTestService from '../../../main/mocks/CategoryTestService';
import showMessage from '../../../libraries/messages/messages'
import jobMessage from '../../../main/messages/messages'
import jobValidation from '../../../main/validations/validations'

const AddJob = () => {



  const initialState = {
    post: ""
  };

  const { register, handleSubmit, errors } = useForm()
  const [job, setJob] = useState(initialState);

  const onSubmit = (data) => {
    CategoryTestService.create(data)
    setJob(initialState)
    showMessage('Confirmation', jobMessage.add, 'success')
  }

  const saveJob = (data) => {

    ApplyJobService.create(data)
      .then(response => {
        setJob(initialState)
      })
      .catch(e => {
        console.log(e);
      });

  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setJob({ ...job, [name]: value });
  };

  return (
    <div className="AddJob">


      <form onSubmit={handleSubmit(onSubmit)}>


        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Poste</label>
          <div class="col-8">
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="fa fa-address-card"></i>
                </div>
              </div>
              <input onChange={handleInputChange} value={job.post} id="text" name="post" type="text" class="form-control" ref={register({ required: true })} />
            </div>
            <div className="error text-danger">
              {errors.post && jobValidation.post}
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea" class="col-4 col-form-label">Description</label>
          <div class="col-8">
            <textarea onChange={handleInputChange} id="textarea" name="description" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea1" class="col-4 col-form-label">Exigence</label>
          <div class="col-8">
            <textarea onChange={handleInputChange} id="textarea1" name="required" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
        </div>

        <div class="form-group row">
          <label for="text2" class="col-4 col-form-label">Lieu</label>
          <div class="col-8">
            <input id="text2" name="location" type="text" class="form-control" ref={register({ required: true })} />
          </div>
        </div>

        <div class="form-group row">
          <label for="select1" class="col-4 col-form-label">Catégorie</label>
          <div class="col-8">
            <select class="custom-select" name="category" ref={register({ required: true })}>
              <option value="Développement">Développement</option>
              <option value="Devops">Devops</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="select3" class="col-4 col-form-label">Compétences</label>
          <div class="col-8">
            <select multiple name="skill" class="custom-select" ref={register({ required: true })}>
              <option value="PHP">PHP</option>
              <option value="Java">Java</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="text4" class="col-4 col-form-label">Date Début</label>
          <div class="col-8">
            <input onChange={handleInputChange} id="text4" name="start" type="date" class="form-control" ref={register({ required: true })} />
          </div>
        </div>

        <div class="form-group row">
          <label for="text3" class="col-4 col-form-label">Date fin</label>
          <div class="col-8">
            <input onChange={handleInputChange} id="text3" name="end" type="date" class="form-control" ref={register({ required: true })} />
          </div>
        </div>


        <div class="form-group row">
          <label for="select4" class="col-4 col-form-label">Statut</label>
          <div class="col-8">
            <select id="select4" name="state" class="custom-select" ref={register({ required: true })}>
              <option value="rabbit">Actif</option>
              <option value="fish">Inactive</option>
            </select>
          </div>
        </div>

        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="fas fa-plus"></i>  Ajouter</button>
          </div>
        </div>


      </form>

    </div>
  )
};

AddJob.propTypes = {};

AddJob.defaultProps = {};

export default AddJob;
