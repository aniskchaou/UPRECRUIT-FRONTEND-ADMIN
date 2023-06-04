import React, { useEffect, useState } from 'react';
import './EditTask.css';
import { useForm } from 'react-hook-form';
import TaskTestService from '../../../main/mocks/TaskTestService';
import showMessage from '../../../libraries/messages/messages';
import taskMessage from '../../../main/messages/taskMessage';
import taskValidation from '../../../main/validations/taskValidation';
import taskHTTPService from '../../../main/services/taskHTTPService';


const EditTask = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [task, setTask] = useState(props.task);

  useEffect(() => {
    setTask(props.task)
  }, [props.task]);


  const onSubmit = (data) => {

    /*  TaskTestService.update(props.task, data)
     showMessage('Confirmation', taskMessage.edit, 'success') */
    taskHTTPService.editTask(props.task.id, data).then(() => {
      props.closeModal()
    })
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
            <div class="col-md-12">
              <div class="form-group">
                <label>Task</label>
                <input onChange={handleInputChange}
                  value={task.task}
                  ref={register({ required: true })}
                  type="text" class="form-control" id="title" name="task" />
              </div>
              <div class="form-group">
                <label>Satus</label>
                <select onChange={handleInputChange}
                  value={task.status}
                  ref={register({ required: true })}
                  type="text" class="form-control" id="title" name="status" >
                  <option value="toDo">To do</option>
                  <option value="Doing" >Doing</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="error text-danger">
                {errors.status && taskValidation.status}
              </div>
            </div>
          </div>
        </div>


        <div class="form-actions">
          <button type="submit" id="create-todo-item" class="btn btn-success"><i className="fa fa-check"></i>
            <font ><font  > Save</font></font></button>
        </div>
      </form>
    </div>
  )
};

EditTask.propTypes = {};

EditTask.defaultProps = {};

export default EditTask;
