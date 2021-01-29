import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddJob.css';
import { useForm } from 'react-hook-form';
import create from '../../../main/mocks/CategoryTestService';
import CategoryTestService from '../../../main/mocks/CategoryTestService';
const AddJob = () => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [message, setMessage] = useState('');


  const onSubmit = (data) => {

    console.log(data)
    setMessage('hgvhgvjhcghcfcfhf')
    CategoryTestService.create(data)

    const myNotification = window.createNotification({});
    myNotification({
      title: 'Title',
      message: 'Notification Message',
      closeOnClick: true,
      displayCloseButton: false,
      positionClass: 'nfc-top-right',
      onclick: false,
      theme: 'success'
    });

  }

  return (
    <div className="AddJob">
      <h2>{message}</h2>
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
              <input id="text" name="post" type="text" class="form-control" ref={register({ required: true })} />
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea" class="col-4 col-form-label">Description</label>
          <div class="col-8">
            <textarea id="textarea" name="description" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea1" class="col-4 col-form-label">Exigence</label>
          <div class="col-8">
            <textarea id="textarea1" name="required" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
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
            <select id="select1" name="category" ref={register({ required: true })} class="custom-select">
              <option value="Développement">Développement</option>
              <option value="Devops">Devops</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="select3" class="col-4 col-form-label">Compétences</label>
          <div class="col-8">
            <select multiple="multiple" id="select3" name="skill" class="custom-select" ref={register({ required: true })}>
              <option value="PHP">PHP</option>
              <option value="Java">Java</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="text4" class="col-4 col-form-label">Date Début</label>
          <div class="col-8">
            <input id="text4" name="start" type="date" class="form-control" ref={register({ required: true })} />
          </div>
        </div>

        <div class="form-group row">
          <label for="text3" class="col-4 col-form-label">Date fin</label>
          <div class="col-8">
            <input id="text3" name="end" type="date" class="form-control" ref={register({ required: true })} />
          </div>
        </div>


        <div class="form-group row">
          <label for="select4" class="col-4 col-form-label">Statut</label>
          <div class="col-8">
            <select id="select4" name="state" class="custom-select" ref={register({ required: true })}>
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
  )
};

AddJob.propTypes = {};

AddJob.defaultProps = {};

export default AddJob;
