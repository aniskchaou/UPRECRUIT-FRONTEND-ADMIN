import React, { useState } from 'react';
import './AddSkill.css';
import showMessage from '../../../libraries/messages/messages'
import skillMessage from '../../../main/messages/skillMessage'
import skillValidation from '../../../main/validations/skillValidation'
import SkillTestService from '../../../main/mocks/SkillTestService';
import HTTPService from '../../../main/services/HTTPService';
import { useForm } from 'react-hook-form';


const AddSkill = () => {

    const initialState = {
        category_id: "",
        skills: "",
    };

    const { register, handleSubmit, errors } = useForm()
    const [skill, setSkill] = useState(initialState);

    const onSubmit = (data) => {
        //saveskill(data)
        SkillTestService.create(data)
        setSkill(initialState)
        showMessage('Confirmation', skillMessage.add, 'success')
    }

    const saveskill = (data) => {

        HTTPService.create(data)
            .then(response => {
                setSkill(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setSkill({ ...skill, [name]: value });
    };

    return (
        <div classNameName="AddSkill">
            <form className="ajax-form" id="createForm" onSubmit={handleSubmit(onSubmit)}>

                <div className="row">
                    <div className="col-md-9">

                        <div className="form-group">
                            <label for="address"><font   ><font   >Catégories d'emplois</font></font></label>
                            <select onChange={handleInputChange}
                                value={skill.category_id}
                                ref={register({ required: true })}
                                name="category_id" id="category_id"
                                className="form-control select2 custom-select select2-hidden-accessible"
                                tabindex="-1" aria-hidden="true">

                                <option value="1">Design</option>
                                <option value="2">Développement</option>

                            </select>
                            <div className="error text-danger">
                                {errors.category_id && skillValidation.category_id}
                            </div>
                        </div>

                    </div>
                </div>

                <div id="education_fields">
                    <div className="row">
                        <div className="col-sm-9 nopadding">

                            <div className="form-group">
                                <div className="input-group">
                                    <input onChange={handleInputChange}
                                        value={skill.skills}
                                        ref={register({ required: true })}
                                        type="text" name="skills" className="form-control"
                                        placeholder="Nom des compétences" />
                                    
                                </div>
                                <div className="error text-danger">
                                    {errors.skills && skillValidation.skills}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" id="save-form" className="btn btn-success">
                    <i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>

            </form>
        </div>
    )
};

AddSkill.propTypes = {};

AddSkill.defaultProps = {};

export default AddSkill;
