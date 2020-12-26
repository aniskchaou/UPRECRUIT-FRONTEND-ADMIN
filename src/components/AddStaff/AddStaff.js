import React from 'react';
import PropTypes from 'prop-types';
import './AddStaff.css';

const AddStaff = () => (
    <div classNameName="AddStaff">
        <form id="editSettings" className="ajax-form">
            <input type="hidden" name="_token" value="GFhIBXJaQlJA2etgCbg2afSudq4Ocos9cALIdMhB" />
            <div className="form-group">
                <label for="name"><font  ><font  >Nom</font></font></label>
                <input type="text" className="form-control" id="name" name="name" />
            </div>
            <div className="form-group">
                <label for="email"><font  ><font  >Email</font></font></label>
                <input type="email" className="form-control" id="email" name="email" />
            </div>
            <div className="form-group">
                <label for="company_phone"><font  ><font  >Mot de passe</font></font></label>
                <input type="password" className="form-control" id="password" name="password" />
            </div>
            <div className="form-group">
                <label><font  ><font  >Mobile</font></font></label>
                <div className="form-row">
                    <div className="col-sm-3">
                        <div className="dropdown bootstrap-select form-control"><select name="calling_code" id="calling_code" className="form-control selectpicker" data-live-search="true" data-width="100%" tabindex="-98">
                            <option value="+93"><font  ><font  >+93 - Afghanistan</font></font></option>
                            <option value="+358"><font  ><font  >+358 - Iles Aland</font></font></option>
                            <option value="+355"><font  ><font  >+355 - Albanie</font></font></option>
                            <option value="+213"><font  ><font  >+213 - Algérie</font></font></option>
                            <option value="+1684"><font  ><font  >+1684 - Samoa américaines</font></font></option>
                            <option value="+376"><font  ><font  >+376 - Andorre</font></font></option>
                            <option value="+244"><font  ><font  >+244 - Angola</font></font></option>
                            <option value="+1264"><font  ><font  >+1264 - Anguilla</font></font></option>
                            <option value="+672"><font  ><font  >+672 - Antarctique</font></font></option>
                            <option value="+1268"><font  ><font  >+1268 - Antigua et Barbuda</font></font></option>
                            <option value="+54"><font  ><font  >+54 - Argentine</font></font></option>
                            <option value="+374"><font  ><font  >+374 - Arménie</font></font></option>
                            <option value="+297"><font  ><font  >+297 - Aruba</font></font></option>
                            <option value="+61"><font  ><font  >+61 - Australie</font></font></option>
                            <option value="+43"><font  ><font  >+43 - Autriche</font></font></option>
                            <option value="+994"><font  ><font  >+994 - Azerbaïdjan</font></font></option>
                            <option value="+1242"><font  ><font  >+1242 - Bahamas</font></font></option>
                            <option value="+973"><font  ><font  >+973 - Bahreïn</font></font></option>
                            <option value="+880"><font  ><font  >+880 - Bangladesh</font></font></option>
                            <option value="+1246"><font  ><font  >+1246 - Barbade</font></font></option>
                            <option value="+375"><font  ><font  >+375 - Biélorussie</font></font></option>
                            <option value="+32"><font  ><font  >+32 - Belgique</font></font></option>
                            <option value="+501"><font  ><font  >+501 - Belize</font></font></option>
                            <option value="+229"><font  ><font  >+229 - Bénin</font></font></option>
                            <option value="+1441"><font  ><font  >+1441 - Bermudes</font></font></option>
                            <option value="+975"><font  ><font  >+975 - Bhoutan</font></font></option>
                            <option value="+591"><font  ><font  >+591 - Bolivie, État plurinational de</font></font></option>
                            <option value="+387">+387 - Bosnia and Herzegovina</option>
                            <option value="+267">+267 - Botswana</option>
                            <option value="+55">+55 - Brazil</option>
                            <option value="+246">+246 - British Indian Ocean Territory</option>
                            <option value="+673">+673 - Brunei Darussalam</option>
                            <option value="+359">+359 - Bulgaria</option>
                            <option value="+226">+226 - Burkina Faso</option>
                            <option value="+257">+257 - Burundi</option>
                            <option value="+855">+855 - Cambodia</option>
                            <option value="+237">+237 - Cameroon</option>
                            <option value="+1">+1 - Canada</option>
                            <option value="+238">+238 - Cape Verde</option>
                            <option value="+1345">+1345 - Cayman Islands</option>
                            <option value="+236">+236 - Central African Republic</option>
                            <option value="+235">+235 - Chad</option>
                            <option value="+56">+56 - Chile</option>
                            <option value="+86">+86 - China</option>
                            <option value="+61">+61 - Christmas Island</option>
                            <option value="+61">+61 - Cocos (Keeling) Islands</option>
                            <option value="+57">+57 - Colombia</option>
                            <option value="+269">+269 - Comoros</option>
                            <option value="+242">+242 - Congo</option>
                            <option value="+243">+243 - Congo, The Democratic Republic of the Congo</option>
                            <option value="+682">+682 - Cook Islands</option>
                            <option value="+506">+506 - Costa Rica</option>
                            <option value="+225">+225 - Cote d'Ivoire</option>
                            <option value="+385">+385 - Croatia</option>
                            <option value="+53">+53 - Cuba</option>
                            <option value="+357">+357 - Cyprus</option>
                            <option value="+420">+420 - Czech Republic</option>
                            <option value="+45">+45 - Denmark</option>
                            <option value="+253">+253 - Djibouti</option>
                            <option value="+1767">+1767 - Dominica</option>
                            <option value="+1849">+1849 - Dominican Republic</option>
                            <option value="+593">+593 - Ecuador</option>
                            <option value="+20">+20 - Egypt</option>
                            <option value="+503">+503 - El Salvador</option>
                            <option value="+240">+240 - Equatorial Guinea</option>
                            <option value="+291">+291 - Eritrea</option>
                            <option value="+372">+372 - Estonia</option>
                            <option value="+251">+251 - Ethiopia</option>
                            <option value="+500">+500 - Falkland Islands (Malvinas)</option>
                            <option value="+298">+298 - Faroe Islands</option>
                            <option value="+679">+679 - Fiji</option>
                            <option value="+358">+358 - Finland</option>
                            <option value="+33">+33 - France</option>
                            <option value="+594">+594 - French Guiana</option>
                            <option value="+689">+689 - French Polynesia</option>
                            <option value="+241">+241 - Gabon</option>
                            <option value="+220">+220 - Gambia</option>
                            <option value="+995">+995 - Georgia</option>
                            <option value="+49">+49 - Germany</option>
                            <option value="+233">+233 - Ghana</option>
                            <option value="+350">+350 - Gibraltar</option>
                            <option value="+30">+30 - Greece</option>
                            <option value="+299">+299 - Greenland</option>
                            <option value="+1473">+1473 - Grenada</option>
                            <option value="+590">+590 - Guadeloupe</option>
                            <option value="+1671">+1671 - Guam</option>
                            <option value="+502">+502 - Guatemala</option>
                            <option value="+44">+44 - Guernsey</option>
                            <option value="+224">+224 - Guinea</option>
                            <option value="+245">+245 - Guinea-Bissau</option>
                            <option value="+595">+595 - Guyana</option>
                            <option value="+509">+509 - Haiti</option>
                            <option value="+379">+379 - Holy See (Vatican City State)</option>
                            <option value="+504">+504 - Honduras</option>
                            <option value="+852">+852 - Hong Kong</option>
                            <option value="+36">+36 - Hungary</option>
                            <option value="+354">+354 - Iceland</option>
                            <option value="+91">+91 - India</option>
                            <option value="+62">+62 - Indonesia</option>
                            <option value="+98">+98 - Iran, Islamic Republic of Persian Gulf</option>
                            <option value="+964">+964 - Iraq</option>
                            <option value="+353">+353 - Ireland</option>
                            <option value="+44">+44 - Isle of Man</option>
                            <option value="+972">+972 - Israel</option>
                            <option value="+39">+39 - Italy</option>
                            <option value="+1876">+1876 - Jamaica</option>
                            <option value="+81">+81 - Japan</option>
                            <option value="+44">+44 - Jersey</option>
                            <option value="+962">+962 - Jordan</option>
                            <option value="+77">+77 - Kazakhstan</option>
                            <option value="+254">+254 - Kenya</option>
                            <option value="+686">+686 - Kiribati</option>
                            <option value="+850">+850 - Korea, Democratic People's Republic of Korea</option>
                            <option value="+82">+82 - Korea, Republic of South Korea</option>
                            <option value="+965">+965 - Kuwait</option>
                            <option value="+996">+996 - Kyrgyzstan</option>
                            <option value="+856">+856 - Laos</option>
                            <option value="+371">+371 - Latvia</option>
                            <option value="+961">+961 - Lebanon</option>
                            <option value="+266">+266 - Lesotho</option>
                            <option value="+231">+231 - Liberia</option>
                            <option value="+218">+218 - Libyan Arab Jamahiriya</option>
                            <option value="+423">+423 - Liechtenstein</option>
                            <option value="+370">+370 - Lithuania</option>
                            <option value="+352">+352 - Luxembourg</option>
                            <option value="+853">+853 - Macao</option>
                            <option value="+389">+389 - Macedonia</option>
                            <option value="+261">+261 - Madagascar</option>
                            <option value="+265">+265 - Malawi</option>
                            <option value="+60">+60 - Malaysia</option>
                            <option value="+960">+960 - Maldives</option>
                            <option value="+223">+223 - Mali</option>
                            <option value="+356">+356 - Malta</option>
                            <option value="+692">+692 - Marshall Islands</option>
                            <option value="+596">+596 - Martinique</option>
                            <option value="+222">+222 - Mauritania</option>
                            <option value="+230">+230 - Mauritius</option>
                            <option value="+262">+262 - Mayotte</option>
                            <option value="+52">+52 - Mexico</option>
                            <option value="+691">+691 - Micronesia, Federated States of Micronesia</option>
                            <option value="+373">+373 - Moldova</option>
                            <option value="+377">+377 - Monaco</option>
                            <option value="+976">+976 - Mongolia</option>
                            <option value="+382">+382 - Montenegro</option>
                            <option value="+1664">+1664 - Montserrat</option>
                            <option value="+212">+212 - Morocco</option>
                            <option value="+258">+258 - Mozambique</option>
                            <option value="+95">+95 - Myanmar</option>
                            <option value="+264">+264 - Namibia</option>
                            <option value="+674">+674 - Nauru</option>
                            <option value="+977">+977 - Nepal</option>
                            <option value="+31">+31 - Netherlands</option>
                            <option value="+599">+599 - Netherlands Antilles</option>
                            <option value="+687">+687 - New Caledonia</option>
                            <option value="+64">+64 - New Zealand</option>
                            <option value="+505">+505 - Nicaragua</option>
                            <option value="+227">+227 - Niger</option>
                            <option value="+234">+234 - Nigeria</option>
                            <option value="+683">+683 - Niue</option>
                            <option value="+672">+672 - Norfolk Island</option>
                            <option value="+1670">+1670 - Northern Mariana Islands</option>
                            <option value="+47">+47 - Norway</option>
                            <option value="+968">+968 - Oman</option>
                            <option value="+92">+92 - Pakistan</option>
                            <option value="+680">+680 - Palau</option>
                            <option value="+970">+970 - Palestinian Territory, Occupied</option>
                            <option value="+507">+507 - Panama</option>
                            <option value="+675">+675 - Papua New Guinea</option>
                            <option value="+595">+595 - Paraguay</option>
                            <option value="+51">+51 - Peru</option>
                            <option value="+63">+63 - Philippines</option>
                            <option value="+872">+872 - Pitcairn</option>
                            <option value="+48">+48 - Poland</option>
                            <option value="+351">+351 - Portugal</option>
                            <option value="+1939">+1939 - Puerto Rico</option>
                            <option value="+974">+974 - Qatar</option>
                            <option value="+40">+40 - Romania</option>
                            <option value="+7">+7 - Russia</option>
                            <option value="+250">+250 - Rwanda</option>
                            <option value="+262">+262 - Reunion</option>
                            <option value="+590">+590 - Saint Barthelemy</option>
                            <option value="+290">+290 - Saint Helena, Ascension and Tristan Da Cunha</option>
                            <option value="+1869">+1869 - Saint Kitts and Nevis</option>
                            <option value="+1758">+1758 - Saint Lucia</option>
                            <option value="+590">+590 - Saint Martin</option>
                            <option value="+508">+508 - Saint Pierre and Miquelon</option>
                            <option value="+1784">+1784 - Saint Vincent and the Grenadines</option>
                            <option value="+685">+685 - Samoa</option>
                            <option value="+378">+378 - San Marino</option>
                            <option value="+239">+239 - Sao Tome and Principe</option>
                            <option value="+966">+966 - Saudi Arabia</option>
                            <option value="+221">+221 - Senegal</option>
                            <option value="+381">+381 - Serbia</option>
                            <option value="+248">+248 - Seychelles</option>
                            <option value="+232">+232 - Sierra Leone</option>
                            <option value="+65">+65 - Singapore</option>
                            <option value="+421">+421 - Slovakia</option>
                            <option value="+386">+386 - Slovenia</option>
                            <option value="+677">+677 - Solomon Islands</option>
                            <option value="+252">+252 - Somalia</option>
                            <option value="+27">+27 - South Africa</option>
                            <option value="+211">+211 - South Sudan</option>
                            <option value="+500">+500 - South Georgia and the South Sandwich Islands</option>
                            <option value="+34">+34 - Spain</option>
                            <option value="+94">+94 - Sri Lanka</option>
                            <option value="+249">+249 - Sudan</option>
                            <option value="+597">+597 - Suriname</option>
                            <option value="+47">+47 - Svalbard and Jan Mayen</option>
                            <option value="+268">+268 - Swaziland</option>
                            <option value="+46">+46 - Sweden</option>
                            <option value="+41">+41 - Switzerland</option>
                            <option value="+963">+963 - Syrian Arab Republic</option>
                            <option value="+886">+886 - Taiwan</option>
                            <option value="+992">+992 - Tajikistan</option>
                            <option value="+255">+255 - Tanzania, United Republic of Tanzania</option>
                            <option value="+66">+66 - Thailand</option>
                            <option value="+670">+670 - Timor-Leste</option>
                            <option value="+228">+228 - Togo</option>
                            <option value="+690">+690 - Tokelau</option>
                            <option value="+676">+676 - Tonga</option>
                            <option value="+1868"><font  ><font  >+1868 - Trinité-et-Tobago</font></font></option>
                            <option value="+216"><font  ><font  >+216 - Tunisie</font></font></option>
                            <option value="+90"><font  ><font  >+90 - Turquie</font></font></option>
                            <option value="+993"><font  ><font  >+993 - Turkménistan</font></font></option>
                            <option value="+1649"><font  ><font  >+1649 - Iles Turques et Caïques</font></font></option>
                            <option value="+688"><font  ><font  >+688 - Tuvalu</font></font></option>
                            <option value="+256"><font  ><font  >+256 - Ouganda</font></font></option>
                            <option value="+380"><font  ><font  >+380 - Ukraine</font></font></option>
                            <option value="+971"><font  ><font  >+971 - Emirats Arabes Unis</font></font></option>
                            <option value="+44"><font  ><font  >+44 - Royaume-Uni</font></font></option>
                            <option value="+1"><font  ><font  >+1 - États-Unis</font></font></option>
                            <option value="+598"><font  ><font  >+598 - Uruguay</font></font></option>
                            <option value="+998"><font  ><font  >+998 - Ouzbékistan</font></font></option>
                            <option value="+678"><font  ><font  >+678 - Vanuatu</font></font></option>
                            <option value="+58"><font  ><font  >+58 - Venezuela, République bolivarienne du Venezuela</font></font></option>
                            <option value="+84"><font  ><font  >+84 - Vietnam</font></font></option>
                            <option value="+1284"><font  ><font  >+1284 - Iles Vierges britanniques</font></font></option>
                            <option value="+1340"><font  ><font  >+1340 - Iles Vierges Américaines</font></font></option>
                            <option value="+681"><font  ><font  >+681 - Wallis et Futuna</font></font></option>
                            <option value="+967"><font  ><font  >+967 - Yémen</font></font></option>
                            <option value="+260"><font  ><font  >+260 - Zambie</font></font></option>
                            <option value="+263"><font  ><font  >+263 - Zimbabwe</font></font></option>
                        </select><button type="button" className="btn dropdown-toggle btn-info" data-toggle="dropdown" role="button" data-id="calling_code" title="+93 - Afghanistan"><div className="filter-option"><div className="filter-option-inner"><div className="filter-option-inner-inner"><font  ><font  >+93 - Afghanistan</font></font></div></div> </div></button><div className="dropdown-menu " role="combobox"><div className="bs-searchbox"><input type="text" className="form-control" autocomplete="off" role="textbox" aria-label="Search" /></div><div className="inner show" role="listbox" aria-expanded="false" tabindex="-1"><ul className="dropdown-menu inner show"></ul></div></div></div>
                    </div>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" name="mobile" />
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label for="exampleInputPassword1"><font  ><font  >Image</font></font></label>
                <div className="card">
                    <div className="card-body">
                        <div className="dropify-wrapper has-preview"><div className="dropify-message"><span className="file-icon"></span> <p><font  ><font  >Faites glisser et déposez un fichier ici ou cliquez sur</font></font></p><p className="dropify-error">Sorry, the file is too large</p></div><div className="dropify-loader" ></div><div className="dropify-errors-container"><ul></ul></div><input type="file" id="input-file-now" name="image" accept=".png,.jpg,.jpeg" className="dropify" data-default-file="https://recruit-saas.froid.works/avatar.png" /><button type="button" className="dropify-clear"><font  ><font  >Retirer</font></font></button><div className="dropify-preview" ><span className="dropify-render"><img src="https://recruit-saas.froid.works/avatar.png"/></span><div className="dropify-infos"><div className="dropify-infos-inner"><p className="dropify-filename"><span className="file-icon"></span> <span className="dropify-filename-inner"><font  ><font  >avatar.png</font></font></span></p><p className="dropify-infos-message"><font  ><font  >Faites glisser et déposez un fichier ou cliquez pour le remplacer</font></font></p></div></div></div></div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label for="company_phone"><font  ><font  >Nom de rôle</font></font></label>
                    <select className="form-control" name="role_id" id="role_id">
                        <option value="1"><font  ><font  >Administrateur d'applications</font></font></option>
                        <option value="2"><font  ><font  >Directeur</font></font></option>
                    </select>
                </div>

                <button type="button" id="save-form" className="btn btn-success waves-effect waves-light m-r-10"><font  ><font  >
                    sauver                        </font></font></button>
                <button type="reset" className="btn btn-inverse waves-effect waves-light"><font  ><font  >Réinitialiser</font></font></button>
        
            
            </form>
  </div>
);

AddStaff.propTypes = {};

AddStaff.defaultProps = {};

export default AddStaff;
