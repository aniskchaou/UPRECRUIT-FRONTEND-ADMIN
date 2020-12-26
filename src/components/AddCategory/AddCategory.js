import React from 'react';
import './AddCategory.css';
import { useForm } from 'react-hook-form'



const AddCategory = () => {
    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const onSubmit = (data) => { console.log(data) } // callback when validation pass

    return (
        <div className="AddCategory">
            <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

                <div id="education_fields">
                    <div className="row">
                        <div className="col-sm-9 nopadding">
                            <div className="form-group">
                                <div className="input-group">
                                    <input type="text" name="name" className="form-control" ref={register({ required: true })} placeholder="Nom des catégories d'emplois" />
                                </div>
                                <div className="error text-danger">
                                    {errors.name && 'Last name is required.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > sauver</font></font></button>
            </form>
        </div>
    )
};

AddCategory.propTypes = {};

AddCategory.defaultProps = {};

export default AddCategory;
