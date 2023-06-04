import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddInterview.css';
import showMessage from '../../../libraries/messages/messages'
import interviewMessage from '../../../main/messages/interviewMessage'
import interviewValidation from '../../../main/validations/interviewValidation'
import InterviewTestService from '../../../main/mocks/InterviewTestService';
import HTTPService from '../../../main/services/HTTPService';
import { useForm } from 'react-hook-form';
import interviewHTTPService from '../../../main/services/interviewHTTPService';
import candidateHTTPService from '../../../main/services/candidateHTTPService';

const AddInterview = (props) => {
    const initialState = {
        candidates: "",
        employees: "",
        scheduleDate: "",
        scheduleTime: "",
        comment: "",
    };
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        candidateHTTPService.getAllCandidate().then(data => {
            setCandidates(data.data)
        })

    }, [])

    const { register, handleSubmit, errors } = useForm()
    const [interview, setInterview] = useState(initialState);

    const onSubmit = (data) => {
        //saveInterview(data)
        // InterviewTestService.create(data)
        interviewHTTPService.createInterview(data).then(data => {
            setInterview(initialState)
            showMessage('Confirmation', interviewMessage.add, 'success')
            props.closeModal()
        })

    }

    const saveInterview = (data) => {

        HTTPService.create(data)
            .then(response => {
                setInterview(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setInterview({ ...interview, [name]: value });
    };


    return (
        <div className="AddInterview">
            <form id="createSchedule" class="ajax-form" onSubmit={handleSubmit(onSubmit)}>

                <div class="form-body">
                    <div class="row">
                        <div class="col-md-6  col-xs-12">


                            <div class="form-group">
                                <label class="d-block"><font  ><font  >Candidate</font></font></label>
                                <select onChange={handleInputChange} value={interview.candidates}
                                    ref={register({ required: true })}
                                    class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple=""
                                    data-placeholder="Choose Candidate" name="candidates" tabindex="-1" aria-hidden="true">
                                    {candidates.map(item =>
                                        <option value={item.firstName + ' ' + item.lastName}>{item.firstName + ' ' + item.lastName}</option>
                                    )}

                                </select>
                                <div className="error text-danger">
                                    {errors.candidates && interviewValidation.candidates}
                                </div>
                            </div>


                        </div>
                        <div class="col-md-6 col-xs-12">


                            <div class="form-group">
                                <label class="d-block"><font  ><font  >Interviewer</font></font></label>
                                <select onChange={handleInputChange} value={interview.employees} ref={register({ required: true })}
                                    class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple=""
                                    data-placeholder="Choose Employee" name="employees[]" tabindex="-1" aria-hidden="true">
                                    <option value="Admin">Admin</option>

                                </select>
                                <div className="error text-danger">
                                    {errors.employees && interviewValidation.employees}
                                </div>
                            </div>


                        </div>
                    </div>

                    <div class="row">

                        <div class="col-xs-6 col-md-4 ">
                            <div class="form-group">
                                <label><font  ><font  >Date</font></font></label>
                                <input onChange={handleInputChange} value={interview.scheduleDate}
                                    ref={register({ required: true })}
                                    type="date" name="scheduleDate" id="scheduleDate" class="form-control"

                                />
                                <div className="error text-danger">
                                    {errors.scheduleDate && interviewValidation.scheduleDate}
                                </div>
                            </div>
                        </div>

                        <div class="col-xs-5 col-md-4">
                            <div class="form-group chooseCandidate bootstrap-timepicker timepicker">
                                <label><font  ><font  >Hour</font></font></label>
                                <input onChange={handleInputChange} value={interview.scheduleTime} ref={register({ required: true })}
                                    type="time" name="scheduleTime" id="scheduleTime" class="form-control" />
                            </div>
                            <div className="error text-danger">
                                {errors.scheduleTime && interviewValidation.scheduleTime}
                            </div>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-xs-12 col-md-12 ">
                            <div class="form-group">
                                <label><font  ><font  >Comment</font></font></label>
                                <textarea onChange={handleInputChange} value={interview.comment} ref={register({ required: false })}
                                    type="text" name="comment" id="comment" placeholder="Commentaire" class="form-control">
                                </textarea>
                            </div>
                            <div className="error text-danger">
                                {errors.comment && interviewValidation.comment}
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Save</font></font></button>
                </div>
            </form>
        </div>
    )
};

AddInterview.propTypes = {};

AddInterview.defaultProps = {};

export default AddInterview;
