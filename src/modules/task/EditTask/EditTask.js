import React, { useEffect, useState } from 'react';
import './EditTask.css';
import { useForm } from 'react-hook-form';
import TaskTestService from '../../../main/mocks/TaskTestService';
import showMessage from '../../../libraries/messages/messages';
import taskMessage from '../../../main/messages/taskMessage';
import taskValidation from '../../../main/validations/taskValidation';


const EditTask = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [task, setTask] = useState(props.task);

  useEffect(() => {
    setTask(props.task)
  }, [props.task]);


  const onSubmit = (data) => {

    TaskTestService.update(props.task, data)
    showMessage('Confirmation', taskMessage.edit, 'success')
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className="EditTask">
      <form id="createTodoItem" class="ajax-form" onSubmit={handleSubmit(onSubmit)}>

        <div class="form-body">
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label>Titre de Tache</label>
                <input onChange={handleInputChange}
                  value={task.title}
                  ref={register({ required: true })}
                  type="text" class="form-control form-control-lg" id="title" name="title" />
              </div>
              <div className="error text-danger">
                {errors.title && taskValidation.title}
              </div>
            </div>
          </div>
        </div>


        <div class="form-actions">
          <button type="submit" id="create-todo-item" class="btn btn-success"><i className="fa fa-check"></i>
            <font ><font  > Sauvegarder</font></font></button>
        </div>
      </form>
    </div>
  )
};

EditTask.propTypes = {};

EditTask.defaultProps = {};

export default EditTask;
