import React, { useState } from 'react';
import './AddSkill.css';
import showMessage from '../../../libraries/messages/messages'
import skillMessage from '../../../main/messages/skillMessage'
import skillValidation from '../../../main/validations/skillValidation'
import SkillTestService from '../../../main/mocks/SkillTestService';
import HTTPService from '../../../main/services/HTTPService';
import { useForm } from 'react-hook-form';
import skillHTTPService from '../../../main/services/skillHTTPService';


const AddSkill = (props) => {

    const initialState = {
        name: "",

    };

    const { register, handleSubmit, errors } = useForm()
    const [skill, setSkill] = useState(initialState);

    const onSubmit = (data) => {
        //saveskill(data)
        skillHTTPService.createSkill(data).then(data => {
            setSkill(initialState)
            showMessage('Confirmation', skillMessage.add, 'success')
            props.closeModal()
        })

    }


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
                            <label for="address"><font   ><font   >Skill</font></font></label>
                            <input onChange={handleInputChange}
                                value={skill.name}
                                ref={register({ required: true })}
                                name="name" id="name"
                                className="form-control"
                            />
                            <div className="error text-danger">
                                {errors.name && skillValidation.name}
                            </div>
                        </div>

                    </div>
                </div>



                <button type="submit" id="save-form" className="btn btn-success">
                    <i className="fa fa-check"></i><font ><font  > Save</font></font></button>

            </form>
        </div>
    )
};

AddSkill.propTypes = {};

AddSkill.defaultProps = {};

export default AddSkill;
