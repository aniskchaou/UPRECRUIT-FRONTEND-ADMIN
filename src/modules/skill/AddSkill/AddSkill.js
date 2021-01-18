import React from 'react';
import PropTypes from 'prop-types';
import './AddSkill.css';

const AddSkill = () => (
    <div classNameName="AddSkill">
        <form className="ajax-form" method="POST" id="createForm">
            <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB" />
            <div className="row">
                <div className="col-md-9">

                    <div className="form-group">
                        <label for="address"><font   ><font   >Catégories d'emplois</font></font></label>
                        <select name="category_id" id="category_id" className="form-control select2 custom-select select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                            <option value="1">Design</option>
                            <option value="2">Développement</option>

                        </select>
                    </div>

                </div>
            </div>

            <div id="education_fields">
                <div className="row">
                    <div className="col-sm-9 nopadding">

                        <div className="form-group">
                            <div className="input-group">
                                <input type="text" name="name[]" className="form-control" placeholder="Nom des compétences" value="" />
                                <div className="input-group-append">
                                    <button className="btn btn-success" type="button" id="add-more"><i className="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font   ><font   > sauver</font></font></button>

        </form>
    </div>
);

AddSkill.propTypes = {};

AddSkill.defaultProps = {};

export default AddSkill;
