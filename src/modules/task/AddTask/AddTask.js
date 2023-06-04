import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddTask.css';
import showMessage from '../../../libraries/messages/messages'
import taskMessage from '../../../main/messages/taskMessage'
import taskValidation from '../../../main/validations/taskValidation'
import TaskTestService from '../../../main/mocks/TaskTestService';
import HTTPService from '../../../main/services/HTTPService';
import { useForm } from 'react-hook-form';
import taskHTTPService from '../../../main/services/taskHTTPService';
const AddTask = (props) => {

    const initialState = {
        task: "",
        status: ""
    };

    const { register, handleSubmit, errors } = useForm()
    const [task, setTask] = useState(initialState);

    const onSubmit = (data) => {
        saveTask(data)
        /*  TaskTestService.create(data)
         setTask(initialState)
         showMessage('Confirmation', taskMessage.add, 'success') */
    }

    const saveTask = (data) => {

        taskHTTPService.createTask(data)
            .then(response => {
                setTask(initialState)
                props.closeModal()
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setTask({ ...task, [name]: value });
    };

    return (
        <div className="AddTask">
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

AddTask.propTypes = {};

AddTask.defaultProps = {};

export default AddTask;
