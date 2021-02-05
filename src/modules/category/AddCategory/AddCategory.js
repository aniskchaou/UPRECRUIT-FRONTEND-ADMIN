import React, { useState } from 'react';
import './AddCategory.css';
import { useForm } from 'react-hook-form'
import axios from 'axios';
import showMessage from '../../../libraries/messages/messages'
import categoryMessage from '../../../main/messages/categoryMessage'
import categoryValidation from '../../../main/validations/categoryValidation'
import CategoryTestService from '../../../main/mocks/CategoryTestService';
import HTTPService from '../../../main/services/HTTPService';


const AddCategory = () => {

    const initialState = {
        category: "",
   
    };
    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [category, setCategory] = useState(initialState);



    const onSubmit = (data) => {
        //saveCategory(data)
        CategoryTestService.create(data)
        setCategory(initialState)
        showMessage('Confirmation', categoryMessage.add, 'success')
    }

    const saveCategory = (data) => {

        HTTPService.create(data)
            .then(response => {
                setCategory(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setCategory({ ...category, [name]: value });
    };

    return (
        <div className="AddCategory">
        
        
            <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

                <div id="education_fields">
                    <div className="row">
                        <div className="col-sm-9 nopadding">
                            <div className="form-group">

                                <div className="input-group">
                                    <input type="text" onChange={handleInputChange} value={category.category} name="category" className="form-control" ref={register({ required: true })} placeholder="Nom des catégories d'emplois" />
                                </div>
                                <div className="error text-danger">
                                    {errors.category && categoryValidation.category}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>
            </form>
        </div>
    )
};

AddCategory.propTypes = {};

AddCategory.defaultProps = {};

export default AddCategory;


