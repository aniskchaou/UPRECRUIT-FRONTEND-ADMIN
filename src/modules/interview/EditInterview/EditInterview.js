
import React, { useEffect, useState } from 'react';
import './EditInterview.css';
import { useForm } from 'react-hook-form';
import InterviewTestService from '../../../main/mocks/InterviewTestService';
import showMessage from '../../../libraries/messages/messages';
import interviewMessage from '../../../main/messages/interviewMessage';
import interviewValidation from '../../../main/validations/interviewValidation';
import interviewHTTPService from '../../../main/services/interviewHTTPService'
const EditInterview = (props) => {

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [interview, setInterview] = useState(props.interview);

    useEffect(() => {
        setInterview(props.interview)
    }, [props.interview]);


    const onSubmit = (data) => {

        // InterviewTestService.update(props.interview, data)
        interviewHTTPService.editInterview(props.interview.id, data).then(data => {
            showMessage('Confirmation', interviewMessage.edit, 'success')
        })

    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setInterview({ ...interview, [name]: value });
    };

    return (
        <div className="EditInterview">
            <form id="createSchedule" class="ajax-form" onSubmit={handleSubmit(onSubmit)}>

                <div class="form-body">
                    <div class="row">
                        <div class="col-md-6  col-xs-12">


                            <div class="form-group">
                                <label class="d-block"><font  ><font  >Candidat</font></font></label>
                                <select onChange={handleInputChange} value={interview.candidates}
                                    ref={register({ required: true })}
                                    class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple=""
                                    data-placeholder="Choose Candidate" name="candidates[]" tabindex="-1" aria-hidden="true">
                                    <option value="1">Lorenzo Hackett</option>
                                    <option value="2">Rozella Mann PhD</option>

                                </select>

                            </div>


                        </div>
                        <div class="col-md-6 col-xs-12">


                            <div class="form-group">
                                <label class="d-block"><font  ><font  >Employé</font></font></label>
                                <select onChange={handleInputChange} value={interview.employees} ref={register({ required: true })}
                                    class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple=""
                                    data-placeholder="Choose Employee" name="employees[]" tabindex="-1" aria-hidden="true">
                                    <option value="2">Admin (VOUS)</option>

                                </select>

                            </div>


                        </div>
                    </div>

                    <div class="row">

                        <div class="col-xs-6 col-md-4 ">
                            <div class="form-group">
                                <label><font  ><font  >Date du programme</font></font></label>
                                <input onChange={handleInputChange} value={interview.scheduleDate}
                                    ref={register({ required: true })}
                                    type="date" name="scheduleDate" id="scheduleDate" class="form-control"

                                />

                            </div>
                        </div>

                        <div class="col-xs-5 col-md-4">
                            <div class="form-group chooseCandidate bootstrap-timepicker timepicker">
                                <label><font  ><font  >Horaire</font></font></label>
                                <input onChange={handleInputChange} value={interview.scheduleTime} ref={register({ required: true })}
                                    type="time" name="scheduleTime" id="scheduleTime" class="form-control" />
                            </div>

                        </div>

                    </div>

                    <div class="row">
                        <div class="col-xs-12 col-md-12 ">
                            <div class="form-group">
                                <label><font  ><font  >Commentaire</font></font></label>
                                <textarea onChange={handleInputChange} value={interview.comment} ref={register({ required: true })}
                                    type="text" name="comment" id="comment" placeholder="Commentaire" class="form-control">
                                </textarea>
                            </div>

                        </div>
                    </div>

                    <button className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>
                </div>
            </form>
        </div>
    )
};

EditInterview.propTypes = {};

EditInterview.defaultProps = {};

export default EditInterview;
