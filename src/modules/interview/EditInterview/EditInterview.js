import React from 'react';
import PropTypes from 'prop-types';
import './EditInterview.css';

const EditInterview = () => (
  <div className="EditInterview">
     <form id="createSchedule" class="ajax-form" method="post">
        <input type="hidden" name="_token" value="ug0YJ299TOGijR4yZQO6nUoZOEyvS3cko6NA1enG"/>
        <div class="form-body">
            <div class="row">
                <div class="col-md-6  col-xs-12">
                    <div class="form-group">
                        <label class="d-block"><font  ><font  >Candidat</font></font></label>
                        <select class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple="" data-placeholder="Choose Candidate" name="candidates[]" tabindex="-1" aria-hidden="true">
                                                            <option value="1">Lorenzo Hackett</option>
                                                            <option value="2">Rozella Mann PhD</option>

                                                    </select>
                    </div>
                </div>
                <div class="col-md-6 col-xs-12">
                    <div class="form-group">
                        <label class="d-block"><font  ><font  >Employé</font></font></label>
                        <select class="select2 m-b-10 form-control select2-multiple select2-hidden-accessible" multiple="" data-placeholder="Choose Employee" name="employees[]" tabindex="-1" aria-hidden="true">
                                                            <option value="2">Admin (VOUS)</option>
                                                           
                                                    </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-6 col-md-4 ">
                    <div class="form-group">
                        <label><font  ><font  >Date du programme</font></font></label>
                        <input type="date" name="scheduleDate" id="scheduleDate" value="" class="form-control" data-dtp="dtp_4DVc0"/>
                    </div>
                </div>

                <div class="col-xs-5 col-md-4">
                    <div class="form-group chooseCandidate bootstrap-timepicker timepicker">
                        <label><font  ><font  >Horaire</font></font></label>
                        <input type="time" name="scheduleTime" id="scheduleTime" class="form-control" data-dtp="dtp_ePweO"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-md-12 ">
                    <div class="form-group">
                        <label><font  ><font  >Commentaire</font></font></label>
                        <textarea type="text" name="comment" id="comment" placeholder="Commentaire" class="form-control"></textarea>
                    </div>
                </div>
            </div>

                <button className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Editer</font></font></button>
        </div>
    </form>
  </div>
);

EditInterview.propTypes = {};

EditInterview.defaultProps = {};

export default EditInterview;
