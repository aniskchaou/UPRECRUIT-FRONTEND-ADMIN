import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddToDo.css';
import { useForm } from 'react-hook-form';
import taskHTTPService from '../../main/services/taskHTTPService';
import taskValidation from '../../main/validations/taskValidation';
import showMessage from '../../libraries/messages/messages';

const AddToDo = () => {
  const initialState = {
    task: '',
    status: 'toDo',
  };
  const { register, handleSubmit, errors } = useForm();
  const [task, setTask] = useState(initialState);

  const onSubmit = (data) => {
    taskHTTPService.createTask(data).then(() => {
      setTask(initialState);
      showMessage('Success', 'Task created successfully.', 'success');
    }).catch(e => {
      console.log(e);
      showMessage('Error', 'Failed to create task. Please try again.', 'error');
    });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className="AddCategory">
      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm">
        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">
              <div className="form-group">
                <label className="control-label required">Task</label>
                <input className="form-control" value={task.task} ref={register({ required: true })}
                  onChange={handleInputChange} type="text" name="task" placeholder="Describe the task..." />
                <div className="error text-danger">
                  {errors.task && taskValidation.task}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label required">Status</label>
                <select className="form-control" value={task.status} ref={register({ required: true })}
                  onChange={handleInputChange} name="status">
                  <option value="toDo">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Done">Done</option>
                </select>
                <div className="error text-danger">
                  {errors.status && taskValidation.status}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" id="save-form" className="btn btn-success">
          <i className="fa fa-check"></i> Save Task
        </button>
      </form>
    </div>
  );
};

AddToDo.propTypes = {};

AddToDo.defaultProps = {};

export default AddToDo;
