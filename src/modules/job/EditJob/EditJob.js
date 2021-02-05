import React, { useEffect, useState } from 'react';
import './EditJob.css';
import { useForm } from 'react-hook-form';
import JobTestService from '../../../main/mocks/JobTestService';
import showMessage from '../../../libraries/messages/messages';
import jobMessage from '../../../main/messages/jobMessage';

const EditJob = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [job, setJob] = useState(props.job);

  useEffect(() => {
    setJob(props.job)
  }, [props.job]);


  const onSubmit = (data) => {

    JobTestService.update(props.job, data)
    showMessage('Confirmation', jobMessage.edit, 'success')
  }

  return (
    <div className="EditJob">
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
              <input onChange={e => setJob({ post: e.target.value })} value={job.post} id="text" name="post"
                type="text" class="form-control" ref={register({ required: true })} />
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea" class="col-4 col-form-label">Description</label>
          <div class="col-8">
            <textarea id="textarea" onChange={e => setJob({ description: e.target.value })} value={job.description} name="description" cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
        </div>

        <div class="form-group row">
          <label for="textarea1" class="col-4 col-form-label">Exigence</label>
          <div class="col-8">
            <textarea id="textarea1" name="requirement" onChange={e => setJob({ requirement: e.target.value })} value={job.requirement} cols="40" rows="5" class="form-control" ref={register({ required: true })} ></textarea>
          </div>
        </div>

        <div class="form-group row">
          <label for="text2" class="col-4 col-form-label">Lieu</label>
          <div class="col-8">
            <input id="text2" name="location" type="text" class="form-control" onChange={e => setJob({ location: e.target.value })} value={job.location} ref={register({ required: true })} />
          </div>
        </div>

        <div class="form-group row">
          <label for="select1" class="col-4 col-form-label">Catégorie</label>
          <div class="col-8">
            <select id="select1" name="category" onChange={e => setJob({ category: e.target.value })} value={job.category} ref={register({ required: true })} class="custom-select">
              <option value="Développement">Développement</option>
              <option value="Devops">Devops</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="select3" class="col-4 col-form-label">Compétences</label>
          <div class="col-8">
            <select multiple="multiple" id="select3" onChange={e => setJob({ skill: e.target.value })} value={job.skill} name="skill" class="custom-select" ref={register({ required: true })}>
              <option value="PHP">PHP</option>
              <option value="Java">Java</option>
            </select>
          </div>
        </div>


        <div class="form-group row">
          <label for="text4" class="col-4 col-form-label">Date Début</label>
          <div class="col-8">
            <input id="text4" name="start" onChange={e => setJob({ start: e.target.value })} value={job.start} type="date" class="form-control" ref={register({ required: true })} />
          </div>
        </div>

        <div class="form-group row">
          <label for="text3" class="col-4 col-form-label">Date fin</label>
          <div class="col-8">
            <input id="text3" name="end" type="date" class="form-control" onChange={e => setJob({ end: e.target.value })} value={job.end} ref={register({ required: true })} />
          </div>
        </div>


        <div class="form-group row">
          <label for="select4" class="col-4 col-form-label">Statut</label>
          <div class="col-8">
            <select id="select4" name="state" class="custom-select" onChange={e => setJob({ state: e.target.value })} value={job.state} ref={register({ required: true })}>
              <option value="rabbit">Actif</option>
              <option value="fish">Inacr=tive</option>
            </select>
          </div>
        </div>

        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit"
              class="btn btn-primary"><i className="fa fa-check"></i><font ><font  > Editer</font></font></button>
          </div>
        </div>
      </form>
    </div>
  )
};

EditJob.propTypes = {};

EditJob.defaultProps = {};

export default EditJob;
