import React from 'react';
import PropTypes from 'prop-types';
import './ViewCandidate.css';

const ViewCandidate = () => (
  <div className="ViewCandidate">
    <div className="slimscrollright" id="right-sidebar-content">
<div className="rpanel-title"> Job Applications <span>
  <i className="ti-close right-side-toggle"></i></span> </div>
<div className="r-panel-body p-3">

    <div className="row font-12">
        <div className="col-4 text-center">
            <img src="https://recruit-saas.froid.works/avatar.png" className="img-circle img-fluid"/>
            
            
                <p className="text-muted resume-button" id="resume-1">
                                            <a href="javascript:;" id="view-application-details" data-application-id="1" className="btn btn-sm btn-primary">View Details</a>
                                    </p>
            
                            <div className="stars stars-example-fontawesome text-center">
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
                        Archive Application                    </a>
                </div>
                <div className="text-muted resume-button">
                    <a href="javascript:deleteApplication(1)" className="btn btn-sm btn-danger">
                        Delete Application                    </a>
                </div>
                    </div>

        <div className="col-8 right-panel-box">
            <div className="col-sm-12">
                <strong>Name</strong><br/>
                <p className="text-muted">Issac Fahey</p>
            </div>

            <div className="col-sm-12">
                <strong>Applied For</strong><br/>
                <p className="text-muted">Manager- Revenue &amp; Analytics (Delhi)</p>
            </div>

            <div className="col-sm-12">
                <strong>Email</strong><br/>
                <p className="text-muted" id="email-1">xxxxxxxxxxxxx</p>
            </div>

            <div className="col-sm-12">
                <strong>Phone</strong><br/>
                <p className="text-muted" id="phone-1">xxxxxxxxxxxxx</p>
            </div>

            <div className="col-sm-12">
                <div className="row">
                                                        </div>
            </div>

            
            <div className="col-sm-12">
                <strong>Applied at</strong><br/>
                <p className="text-muted">
                                            26 Dec, 2020 18:30
                                    </p>
            </div>
            <div className="col-sm-12">
                <h4>Additional Details</h4>
                                            </div>
            
                        <div className="col-sm-12">
                <p className="text-muted">
                                    </p>
            </div>
            <div className="row">
                                    <div className="col-sm-6">
                        <p className="text-muted">
                            <a  className="btn btn-sm btn-info">Schedule Interview</a>
                        </p>
                    </div>
                            </div>
        </div>
                    <div className="col-12" id="skills-container">
                <hr/>
                <div className="col-sm-12 mb-3">
                    <h5>Skills</h5>
                </div>
                <div className="form-group mb-2">
                    <select name="skills[]" id="skills" className="form-control select2 custom-select select2-hidden-accessible" multiple="" tabindex="-1" aria-hidden="true">
                                                    <option value="1">Angular JS</option>
                                                    <option value="2">Vue.JS</option>
                                                    <option value="3">Laravel 5.4</option>
                                                    <option value="4">English</option>
                                                    <option value="5">Blogging</option>
                                            </select><span className="select2 select2-container select2-container--default" dir="ltr" ><span className="selection"><span className="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1"><ul className="select2-selection__rendered"><li className="select2-search select2-search--inline"><input className="select2-search__field" type="search" tabIndex="0" autoComplete="off" autocorrect="off" autoCapitalize="off" spellCheck="false" role="textbox"  /></li></ul></span></span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <a  id="add-skills" className="btn btn-sm btn-outline-success">
                                            Add Skills                                    </a>
            </div>
                <div className="col-12">
            <hr/>
            <div className="col-sm-12 mb-3">
                <h5>Applicant Notes</h5>
            </div>

            <div id="applicant-notes" className="col-sm-12">
                <ul className="list-unstyled">
                                </ul>
            </div>

                            <div className="col-sm-12">
                    <div className="form-group mb-2">
                        <textarea name="note" id="note_text" cols="30" rows="2" className="form-control"></textarea>
                    </div>
                    <a  id="add-note" className="btn btn-sm btn-outline-primary">Add Note</a>
                </div>
                
        </div>

    </div>

</div>

</div>
  </div>
);

ViewCandidate.propTypes = {};

ViewCandidate.defaultProps = {};

export default ViewCandidate;
