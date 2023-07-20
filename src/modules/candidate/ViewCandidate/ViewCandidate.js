import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ViewCandidate.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import BASE_URL from '../../../main/urls/urls';

const ViewCandidate = (props) => {
    useEffect(() => {
        document.getElementById("home-tab").click()
        //getAllPatient()
    }, []);
    return (
        <div className="ViewCandidate">

            <div className="slimscrollright" id="right-sidebar-content">

                <div className="r-panel-body p-3">
                    <ul class="nav nav-tabs">
                        <li class="active"><a id="home-tab" data-toggle="tab" href="#home">Info</a></li>
                        <li><a data-toggle="tab" href="#menu1">CV</a></li>
                    </ul>
                    <div className="row font-12">


                        <br />

                        <div class="tab-content">
                            <div id="home" class="tab-pane fade in active">

                                <div className="col-4 text-center">
                                    <img src="/images/admin.png" className="img-circle img-fluid" />


                                    {/* <p className="text-muted resume-button" id="resume-1">
                                <a href="javascript:;" id="view-application-details" data-application-id="1" className="btn btn-sm btn-primary"><i class="fas fa-eye"></i> View Details</a>
                            </p> */}

                                    {/*  <div className="stars stars-example-fontawesome text-center">
                                <div className="br-wrapper br-theme-fontawesome-stars"><select id="example-fontawesome" name="rating" autocomplete="off" >
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select><div className="br-widget"><a href="#" data-rating-value="1" data-rating-text="1"></a><a href="#" data-rating-value="2" data-rating-text="2"></a><a href="#" data-rating-value="3" data-rating-text="3"></a><a href="#" data-rating-value="4" data-rating-text="4"></a><a href="#" data-rating-value="5" data-rating-text="5"></a></div></div>
                            </div>

                            <div className="text-muted resume-button">
                                <a href="javascript:archiveApplication(1)" className="btn btn-sm btn-info">
                                    <i class="fas fa-save"></i> Archiver la demande                    </a>
                            </div>
                            <div className="text-muted resume-button">
                                <a href="javascript:deleteApplication(1)" className="btn btn-sm btn-danger">
                                    <i class="fas fa-trash"></i> Supprimer la demande                    </a>
                            </div> */}
                                </div>

                                <div className="col-8 right-panel-box">

                                    <div className="col-sm-12">
                                        <strong>FullName</strong><br />
                                        <p className="text-muted">{props.candidate?.firstName + ' ' + props.candidate?.lastName}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Gender</strong><br />
                                        <p className="text-muted">{props.candidate?.gender}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Email</strong><br />
                                        <p className="text-muted">{props.candidate?.email}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Telephone</strong><br />
                                        <p className="text-muted" id="email-1">{props.candidate?.phone}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Address</strong><br />
                                        <p className="text-muted" id="email-1">{props.candidate?.address}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Experience</strong><br />
                                        <p className="text-muted" id="email-1">{props.candidate?.experience}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Date Of Birth</strong><br />
                                        <p className="text-muted" id="phone-1">{props.candidate?.dateOfBirth}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>Language</strong><br />
                                        <p className="text-muted" id="phone-1">{props.candidate?.language}</p>
                                    </div>

                                    <div className="col-sm-12">
                                        <strong>City</strong><br />
                                        <p className="text-muted" id="phone-1">{props.candidate?.city}</p>
                                    </div>




                                    <div className="col-sm-12">
                                        <strong>Salary </strong><br />
                                        <p className="text-muted">
                                            {props.candidate?.salary}
                                        </p>
                                    </div>
                                    {/*  <div className="col-sm-12">
                                <h4>Details</h4>
                            </div>

                            <div className="col-sm-12">
                                <p className="text-muted">
                                </p>
                            </div> */}
                                    {/*  <div className="row">
                                <div className="col-sm-6">
                                
                                    <a className="btn btn-sm btn-primary"><i class="fas fa-calendar"></i> planifier un entretien</a>
                                
                                </div>
                            </div> */}
                                </div>
                            </div>
                            <div id="menu1" class="tab-pane fade">
                                <embed src={`${BASE_URL}/uploads/` + props.candidate?.cv} type="application/pdf" height="700" width="720" />

                            </div>

                        </div>




                        {/*     <div className="col-12" id="skills-container">
                            <hr />
                            <div className="col-sm-12 mb-3">
                                <h5>Compétences</h5>
                            </div>
                            <div className="form-group mb-2">
                                <select multiple name="skills[]" id="skills" className="form-control select2 custom-select select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                                    <option value="1">Angular JS</option>
                                    <option value="2">Vue.JS</option>
                                    <option value="3">Laravel 5.4</option>
                                    <option value="4">English</option>
                                    <option value="5">Blogging</option>
                                </select>
                            </div>
                            <a id="add-skills" className="btn btn-sm btn-success">
                                <i class="fas fa-plus"></i> Add Skills                                    </a>
                        </div> */}
                        {/*   <div className="col-12">
                            <hr />
                            <div className="col-sm-12 mb-3">
                                <h5> Notes</h5>
                            </div>

                            <div id="applicant-notes" className="col-sm-12">
                                <ul className="list-unstyled">
                                </ul>
                            </div>

                            <div className="col-sm-12">
                                <div className="form-group mb-2">
                                    <textarea name="note" id="note_text" cols="30" rows="2" className="form-control"></textarea>
                                </div>
                                <a id="add-note" className="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Ajouter Note</a>
                            </div>

                        </div> */}

                    </div>

                </div>

            </div>
        </div>
    )
};

ViewCandidate.propTypes = {};

ViewCandidate.defaultProps = {};

export default ViewCandidate;
