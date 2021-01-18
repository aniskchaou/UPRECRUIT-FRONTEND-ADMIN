import React from 'react';
import PropTypes from 'prop-types';
import './AddJob.css';

const AddJob = () => (
  <div classNameName="AddJob">
    <form className="ajax-form" method="POST" id="createForm">
                        <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB"/>
                        <div className="row">
                            
                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address" className="required"><font  ><font  >Profession</font></font></label>
                                    <input type="text" className="form-control" name="title"/>
                                </div>

                            </div>
                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address" className="required"><font  ><font  >Description de l'emploi</font></font></label>
                                    <ul className="wysihtml5-toolbar" style=""><li className="dropdown"><a className="btn dropdown-toggle" data-toggle="dropdown" href="#"><i className="fa fa-font"></i>&nbsp;<span className="current-font"><font  ><font  >Texte normal</font></font></span>&nbsp;<b className="caret"></b></a><ul className="dropdown-menu"><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="div" href="javascript:;" unselectable="on"><font  ><font  >Texte normal</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" href="javascript:;" unselectable="on"><font  ><font  >Titre 1</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" href="javascript:;" unselectable="on"><font  ><font  >Titre 2</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" href="javascript:;" unselectable="on"><font  ><font  >Titre 3</font></font></a></li></ul></li><li className="dropdown"><a className="btn dropdown-toggle" data-toggle="dropdown" href="#"><span className="current-color"><font  ><font  >Noir</font></font></span>&nbsp;<b className="caret"></b></a><ul className="dropdown-menu"><li><div className="wysihtml5-colors" data-wysihtml5-command-value="black"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="black" href="javascript:;" unselectable="on"><font  ><font  >Noir</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="silver"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="silver" href="javascript:;" unselectable="on"><font  ><font  >argent</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="gray"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="gray" href="javascript:;" unselectable="on"><font  ><font  >Gris</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="maroon"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="maroon" href="javascript:;" unselectable="on"><font  ><font  >Bordeaux</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="red"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" href="javascript:;" unselectable="on"><font  ><font  >rouge</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="purple"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="purple" href="javascript:;" unselectable="on"><font  ><font  >Violet</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="green"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" href="javascript:;" unselectable="on"><font  ><font  >vert</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="olive"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="olive" href="javascript:;" unselectable="on"><font  ><font  >olive</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="navy"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="navy" href="javascript:;" unselectable="on"><font  ><font  >Marine</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="blue"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" href="javascript:;" unselectable="on"><font  ><font  >Bleu</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="orange"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="orange" href="javascript:;" unselectable="on"><font  ><font  >Orange</font></font></a></li></ul></li><li><div className="btn-group"><a className="btn" data-wysihtml5-command="bold" title="CTRL + B" href="javascript:;" unselectable="on"><font  ><font  >Audacieux</font></font></a><a className="btn" data-wysihtml5-command="italic" title="CTRL + I" href="javascript:;" unselectable="on"><font  ><font  >Italique</font></font></a><a className="btn" data-wysihtml5-command="underline" title="CTRL + U" href="javascript:;" unselectable="on"><font  ><font  >Souligner</font></font></a></div></li><li><div className="btn-group"><a className="btn" data-wysihtml5-command="insertUnorderedList" title="Liste non ordonnée" href="javascript:;" unselectable="on"><i className="fa fa-list"></i></a><a className="btn" data-wysihtml5-command="insertOrderedList" title="Liste ordonnée" href="javascript:;" unselectable="on"><i className="fa fa-th-list"></i></a><a className="btn" data-wysihtml5-command="Outdent" title="Outdent" href="javascript:;" unselectable="on"><i className="fa fa-outdent"></i></a><a className="btn" data-wysihtml5-command="Indent" title="Retrait" href="javascript:;" unselectable="on"><i className="fa fa-indent"></i></a></div></li><li><div className="btn-group"><a className="btn" data-wysihtml5-action="change_view" title="Modifier le HTML" href="javascript:;" unselectable="on"><i className="fa fa-pencil"></i></a></div></li><li><div className="bootstrap-wysihtml5-insert-link-modal modal fade bs-example-modal-lg"><div className="modal-dialog modal-lg"><div className="modal-content"><div className="modal-header"><a className="close" data-dismiss="modal"></a><h3><font  ><font  >Insérer un lien</font></font></h3></div><div className="modal-body"><div className="form-group"><input value="http://" className="bootstrap-wysihtml5-insert-link-url form-control" type="text"></div></div><div className="modal-footer"><a href="#" className="btn btn-inverse" data-dismiss="modal"><font  ><font  >Annuler</font></font></a><a href="#" className="btn btn-primary" data-dismiss="modal"><font  ><font  >Insérer un lien</font></font></a></div></div></div></div><a className="btn" data-wysihtml5-command="createLink" title="Insérer un lien" href="javascript:;" unselectable="on"><i className="fa fa-link"></i></a></li><li><div className="bootstrap-wysihtml5-insert-image-modal modal fade bs-example-modal-lg"><div className="modal-dialog modal-lg"><div className="modal-content"><div className="modal-header"><a className="close" data-dismiss="modal"></a><h3><font  ><font  >Insérer une image</font></font></h3></div><div className="modal-body"><div className="form-group"><input value="http://" className="bootstrap-wysihtml5-insert-image-url  m-wrap large form-control" type="text"></div></div><div className="modal-footer"><a href="#" className="btn" data-dismiss="modal"><font  ><font  >Annuler</font></font></a><a href="#" className="btn  green btn-primary" data-dismiss="modal"><font  ><font  >Insérer une image</font></font></a></div></div></div></div><a className="btn" data-wysihtml5-command="insertImage" title="Insérer une image" href="javascript:;" unselectable="on"><i className="fa fa-image "></i></a></li></ul><textarea className="form-control" id="job_description" name="job_description" rows="15" placeholder="Entrez du texte ..." style="display: none;"></textarea><input type="hidden" name="_wysihtml5_mode" value="1"><iframe className="wysihtml5-sandbox" security="restricted" allowtransparency="true" frameborder="0" width="0" height="0" marginwidth="0" marginheight="0" style="background-color: rgb(255, 255, 255); border-collapse: separate; border-color: rgb(206, 212, 218); border-style: solid; border-width: 1px; clear: none; display: block; float: none; margin: 0px; outline: rgb(73, 80, 87) none 0px; outline-offset: 0px; padding: 6px 12px; position: static; z-index: auto; vertical-align: baseline; text-align: start; box-sizing: border-box; box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px inset; border-radius: 4px; width: 955px; height: 299px; inset: auto;"></iframe>
                                </div>

                            </div>
                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address" className="required"><font  ><font  >Exigence de l'emploi</font></font></label>
                                    <ul className="wysihtml5-toolbar" style=""><li className="dropdown"><a className="btn dropdown-toggle" data-toggle="dropdown" href="#"><i className="fa fa-font"></i>&nbsp;<span className="current-font"><font  ><font  >Texte normal</font></font></span>&nbsp;<b className="caret"></b></a><ul className="dropdown-menu"><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="div" href="javascript:;" unselectable="on"><font  ><font  >Texte normal</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" href="javascript:;" unselectable="on"><font  ><font  >Titre 1</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" href="javascript:;" unselectable="on"><font  ><font  >Titre 2</font></font></a></li><li><a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" href="javascript:;" unselectable="on"><font  ><font  >Titre 3</font></font></a></li></ul></li><li className="dropdown"><a className="btn dropdown-toggle" data-toggle="dropdown" href="#"><span className="current-color"><font  ><font  >Noir</font></font></span>&nbsp;<b className="caret"></b></a><ul className="dropdown-menu"><li><div className="wysihtml5-colors" data-wysihtml5-command-value="black"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="black" href="javascript:;" unselectable="on"><font  ><font  >Noir</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="silver"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="silver" href="javascript:;" unselectable="on"><font  ><font  >argent</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="gray"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="gray" href="javascript:;" unselectable="on"><font  ><font  >Gris</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="maroon"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="maroon" href="javascript:;" unselectable="on"><font  ><font  >Bordeaux</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="red"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" href="javascript:;" unselectable="on"><font  ><font  >rouge</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="purple"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="purple" href="javascript:;" unselectable="on"><font  ><font  >Violet</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="green"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" href="javascript:;" unselectable="on"><font  ><font  >vert</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="olive"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="olive" href="javascript:;" unselectable="on"><font  ><font  >olive</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="navy"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="navy" href="javascript:;" unselectable="on"><font  ><font  >Marine</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="blue"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" href="javascript:;" unselectable="on"><font  ><font  >Bleu</font></font></a></li><li><div className="wysihtml5-colors" data-wysihtml5-command-value="orange"></div><a className="wysihtml5-colors-title" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="orange" href="javascript:;" unselectable="on"><font  ><font  >Orange</font></font></a></li></ul></li><li><div className="btn-group"><a className="btn" data-wysihtml5-command="bold" title="CTRL + B" href="javascript:;" unselectable="on"><font  ><font  >Audacieux</font></font></a><a className="btn" data-wysihtml5-command="italic" title="CTRL + I" href="javascript:;" unselectable="on"><font  ><font  >Italique</font></font></a><a className="btn" data-wysihtml5-command="underline" title="CTRL + U" href="javascript:;" unselectable="on"><font  ><font  >Souligner</font></font></a></div></li><li><div className="btn-group"><a className="btn" data-wysihtml5-command="insertUnorderedList" title="Liste non ordonnée" href="javascript:;" unselectable="on"><i className="fa fa-list"></i></a><a className="btn" data-wysihtml5-command="insertOrderedList" title="Liste ordonnée" href="javascript:;" unselectable="on"><i className="fa fa-th-list"></i></a><a className="btn" data-wysihtml5-command="Outdent" title="Outdent" href="javascript:;" unselectable="on"><i className="fa fa-outdent"></i></a><a className="btn" data-wysihtml5-command="Indent" title="Retrait" href="javascript:;" unselectable="on"><i className="fa fa-indent"></i></a></div></li><li><div className="btn-group"><a className="btn" data-wysihtml5-action="change_view" title="Modifier le HTML" href="javascript:;" unselectable="on"><i className="fa fa-pencil"></i></a></div></li><li><div className="bootstrap-wysihtml5-insert-link-modal modal fade bs-example-modal-lg"><div className="modal-dialog modal-lg"><div className="modal-content"><div className="modal-header"><a className="close" data-dismiss="modal"></a><h3><font  ><font  >Insérer un lien</font></font></h3></div><div className="modal-body"><div className="form-group"><input value="http://" className="bootstrap-wysihtml5-insert-link-url form-control" type="text"></div></div><div className="modal-footer"><a href="#" className="btn btn-inverse" data-dismiss="modal"><font  ><font  >Annuler</font></font></a><a href="#" className="btn btn-primary" data-dismiss="modal"><font  ><font  >Insérer un lien</font></font></a></div></div></div></div><a className="btn" data-wysihtml5-command="createLink" title="Insérer un lien" href="javascript:;" unselectable="on"><i className="fa fa-link"></i></a></li><li><div className="bootstrap-wysihtml5-insert-image-modal modal fade bs-example-modal-lg"><div className="modal-dialog modal-lg"><div className="modal-content"><div className="modal-header"><a className="close" data-dismiss="modal"></a><h3><font  ><font  >Insérer une image</font></font></h3></div><div className="modal-body"><div className="form-group"><input value="http://" className="bootstrap-wysihtml5-insert-image-url  m-wrap large form-control" type="text"></div></div><div className="modal-footer"><a href="#" className="btn" data-dismiss="modal"><font  ><font  >Annuler</font></font></a><a href="#" className="btn  green btn-primary" data-dismiss="modal"><font  ><font  >Insérer une image</font></font></a></div></div></div></div><a className="btn" data-wysihtml5-command="insertImage" title="Insérer une image" href="javascript:;" unselectable="on"><i className="fa fa-image "></i></a></li></ul><textarea className="form-control" id="job_requirement" name="job_requirement" rows="15" placeholder="Entrez du texte ..." style="display: none;"></textarea><input type="hidden" name="_wysihtml5_mode" value="1"><iframe className="wysihtml5-sandbox" security="restricted" allowtransparency="true" frameborder="0" width="0" height="0" marginwidth="0" marginheight="0" style="background-color: rgb(255, 255, 255); border-collapse: separate; border-color: rgb(206, 212, 218); border-style: solid; border-width: 1px; clear: none; display: block; float: none; margin: 0px; outline: rgb(73, 80, 87) none 0px; outline-offset: 0px; padding: 6px 12px; position: static; z-index: auto; vertical-align: baseline; text-align: start; box-sizing: border-box; box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px inset; border-radius: 4px; width: 955px; height: 299px; inset: auto;"></iframe>
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address"><font  ><font  >Lieux de travail</font></font></label>
                                    <select name="location_id" id="location_id" className="form-control select2 custom-select select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                                                                                    <option value="1"><font  ><font  >Jaipur (IN)</font></font></option>
                                                                                    <option value="2"><font  ><font  >Delhi (IN)</font></font></option>
                                                                                    <option value="3"><font  ><font  >Bangalore (IN)</font></font></option>
                                                                            </select><span className="select2 select2-container select2-container--default" dir="ltr" style="width: 955px;"><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-labelledby="select2-location_id-container"><span className="select2-selection__rendered" id="select2-location_id-container" title="Jaipur (IN)"><font  ><font  >Jaipur (IN)</font></font></span><span className="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address" className="required"><font  ><font  >Catégories d'emplois</font></font></label>
                                    <select name="category_id" id="category_id" className="form-control">
                                        <option value=""><font  ><font  >Choisissez les catégories d'emplois</font></font></option>
                                                                                    <option value="1"><font  ><font  >Ventes</font></font></option>
                                                                                    <option value="2"><font  ><font  >Contenu</font></font></option>
                                                                                    <option value="3"><font  ><font  >Ingénierie</font></font></option>
                                                                            </select>
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label><font  ><font  >Compétences</font></font></label>
                                    <select className="select2 m-b-10 select2-multiple select2-hidden-accessible" id="job_skills" style="width: 100%; " multiple="" data-placeholder="Add Skills" name="skill_id[]" tabindex="-1" aria-hidden="true">
                                    </select><span className="select2 select2-container select2-container--default" dir="ltr" style="width: 100%;"><span className="selection"><span className="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1"><ul className="select2-selection__rendered"><li className="select2-search select2-search--inline"><input className="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" placeholder="Ajouter des compétences" style="width: 953px;"></li></ul></span></span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
                                </div>


                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address" className="required"><font  ><font  >Total des postes</font></font></label>
                                    <input type="number" className="form-control" name="total_positions" id="total_positions">
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address"><font  ><font  >Date de début</font></font></label>
                                    <input type="text" className="form-control" id="date-start" value="2020-12-18" name="start_date" data-dtp="dtp_jdgwS">
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address"><font  ><font  >Date de fin</font></font></label>
                                    <input type="text" className="form-control" id="date-end" name="end_date" value="2021-01-18" data-dtp="dtp_Ytw2L">
                                </div>

                            </div>

                            <div className="col-md-12">

                                <div className="form-group">
                                    <label for="address"><font  ><font  >Statut</font></font></label>
                                    <select name="status" id="status" className="form-control">
                                        <option value="active"><font  ><font  >actif</font></font></option>
                                        <option value="inactive"><font  ><font  >Inactif</font></font></option>
                                    </select>
                                </div>

                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label for="meta-title"><font  ><font  >Meta Title</font></font></label>
                                    <input type="text" id="meta-title" className="form-control" name="meta_title">
                                </div>
                            </div>
                            
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label for="meta-description"><font  ><font  >Meta Description</font></font></label>
                                    <textarea id="meta-description" className="form-control" name="meta_description" rows="3"></textarea>
                                </div>
                            </div>

                            <hr>

                            <div className="col-md-12">
                                                                                                                            </div>

                            <div className="col-md-12">
                                <div id="columns">
                                    <label><font  ><font  >Demander aux candidats</font></font></label>
                                    <div className="form-group form-group-inline">
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" value="gender" name="gender" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Le sexe
                                            </font></font></label>
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" value="dob" name="dob" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Date de naissance
                                            </font></font></label>
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" value="country" name="country" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Pays
                                            </font></font></label>
                                                                            </div>
                                </div>        
                            </div>

                            <div className="col-md-12">
                                <div id="columns">
                                    <label><font  ><font  >Visibilité de la section</font></font></label>
                                    <div className="form-group form-group-inline">
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue checked" aria-checked="false" aria-disabled="false" style="position: relative;"><input checked="" type="checkbox" value="yes" name="profile_image" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Image de profil
                                            </font></font></label>
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue checked" aria-checked="false" aria-disabled="false" style="position: relative;"><input checked="" type="checkbox" value="yes" name="resume" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                CV
                                            </font></font></label>
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue checked" aria-checked="false" aria-disabled="false" style="position: relative;"><input checked="" type="checkbox" value="yes" name="cover_letter" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Lettre de motivation
                                            </font></font></label>
                                                                                    <label className="mr-4">
                                                <div className="icheckbox_flat-green" aria-checked="false" aria-disabled="false" style="position: relative;">
                                                    <div className="icheckbox_flat-blue checked" aria-checked="false" aria-disabled="false" style="position: relative;"><input checked="" type="checkbox" value="yes" name="terms_and_conditions" className="flat-red" style="position: absolute; opacity: 0;"><ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                                    <ins className="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                                                </div><font  ><font  >
                                                Termes et conditions
                                            </font></font></label>
                                                                            </div>
                                </div>        
                            </div>
                        </div>

                        <button type="button" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font  ><font  > sauver</font></font></button>

                    </form>
  </div>
);

AddJob.propTypes = {};

AddJob.defaultProps = {};

export default AddJob;
