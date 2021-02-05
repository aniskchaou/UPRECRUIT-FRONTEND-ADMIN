import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddTask.css';
import showMessage from '../../../libraries/messages/messages'
import taskMessage from '../../../main/messages/taskMessage'
import taskValidation from '../../../main/validations/taskValidation'
import TaskTestService from '../../../main/mocks/TaskTestService';
import HTTPService from '../../../main/services/HTTPService';
import { useForm } from 'react-hook-form';
const AddTask = () => {

    const initialState = {
        title: "",
    };

    const { register, handleSubmit, errors } = useForm()
    const [task, setTask] = useState(initialState);

    const onSubmit = (data) => {
        //saveTask(data)
        TaskTestService.create(data)
        setTask(initialState)
        showMessage('Confirmation', taskMessage.add, 'success')
    }

    const saveTzsk = (data) => {

        HTTPService.create(data)
            .then(response => {
                setTask(initialState)
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

AddTask.propTypes = {};

AddTask.defaultProps = {};

export default AddTask;
