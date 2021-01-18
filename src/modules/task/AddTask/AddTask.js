import React from 'react';
import PropTypes from 'prop-types';
import './AddTask.css';

const AddTask = () => (
    <div className="AddTask">
        <form id="createTodoItem" class="ajax-form" method="POST" autocomplete="off">
            <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB"/>
                <div class="form-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label>Title</label>

                                <input type="text" class="form-control form-control-lg" id="title" name="title"/>
                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="create-todo-item" class="btn btn-success">Create <i class="fa fa-arrow-right"></i></button>
                    </div>
    </form>
  </div>
);

AddTask.propTypes = { };

AddTask.defaultProps = { };

export default AddTask;
