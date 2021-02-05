import React, { useEffect, useState } from 'react';
import './EditStaff.css';
import { useForm } from 'react-hook-form';
import StaffTestService from '../../../main/mocks/StaffTestService';
import showMessage from '../../../libraries/messages/messages';
import staffMessage from '../../../main/messages/staffMessage';
import staffValidation from '../../../main/validations/staffValidation';
const EditStaff = (props) => {
    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [staff, setStaff] = useState(props.staff);

    useEffect(() => {
        setStaff(props.staff)
    }, [props.staff]);


    const onSubmit = (data) => {

        StaffTestService.update(props.staff, data)
        showMessage('Confirmation', staffMessage.edit, 'success')
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setStaff({ ...staff, [name]: value });
    };

    return (
        <div className="EditStaff">
            <form id="editSettings" className="ajax-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group">
                    <label for="name">  Nom  </label>
                    <input onChange={handleInputChange} value={staff.full_name}
                        ref={register({ required: true })} type="text" className="form-control" id="name" name="full_name" />

                    <div className="error text-danger">
                        {errors.full_name && staffValidation.full_name}
                    </div>
                </div>

                <div className="form-group">
                    <label for="email">  Email  </label>
                    <input onChange={handleInputChange} value={staff.email}
                        ref={register({ required: true })} type="email" className="form-control" id="email" name="email" />
                    <div className="error text-danger">
                        {errors.email && staffValidation.email}
                    </div>

                </div>

                <div className="form-group">
                    <label for="company_phone">  Mot de passe  </label>
                    <input onChange={handleInputChange} value={staff.password}
                        ref={register({ required: true })} type="password" className="form-control" id="password" name="password" />
                    <div className="error text-danger">
                        {errors.password && staffValidation.password}
                    </div>
                </div>

                <div className="form-group">
                    <label>Mobile</label>
                    <div className="form-row">
                        <div className="col-sm-3">
                            <div >
                                <select onChange={handleInputChange} value={staff.calling_code}
                                    ref={register({ required: true })}
                                    name="calling_code" id="calling_code" className="form-control"
                                    data-live-search="true" data-width="100%" tabindex="-98">
                                    <option value="+93">  +93 - Afghanistan  </option>
                                    <option value="+358">  +358 - Iles Aland  </option>
                                    <option value="+355">  +355 - Albanie  </option>
                                    <option value="+213">  +213 - Algérie  </option>
                                    <option value="+1684">  +1684 - Samoa américaines  </option>
                                    <option value="+376">  +376 - Andorre  </option>
                                    <option value="+244">  +244 - Angola  </option>
                                    <option value="+1264">  +1264 - Anguilla  </option>
                                    <option value="+672">  +672 - Antarctique  </option>
                                    <option value="+1268">  +1268 - Antigua et Barbuda  </option>
                                    <option value="+54">  +54 - Argentine  </option>
                                    <option value="+374">  +374 - Arménie  </option>
                                    <option value="+297">  +297 - Aruba  </option>
                                    <option value="+61">  +61 - Australie  </option>
                                    <option value="+43">  +43 - Autriche  </option>
                                    <option value="+994">  +994 - Azerbaïdjan  </option>
                                    <option value="+1242">  +1242 - Bahamas  </option>
                                    <option value="+973">  +973 - Bahreïn  </option>
                                    <option value="+880">  +880 - Bangladesh  </option>
                                    <option value="+1246">  +1246 - Barbade  </option>
                                    <option value="+375">  +375 - Biélorussie  </option>
                                    <option value="+32">  +32 - Belgique  </option>
                                    <option value="+501">  +501 - Belize  </option>
                                    <option value="+229">  +229 - Bénin  </option>
                                    <option value="+1441">  +1441 - Bermudes  </option>
                                    <option value="+975">  +975 - Bhoutan  </option>
                                    <option value="+591">  +591 - Bolivie, État plurinational de  </option>
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
                                    <option value="+1868">  +1868 - Trinité-et-Tobago  </option>
                                    <option value="+216">  +216 - Tunisie  </option>
                                    <option value="+90">  +90 - Turquie  </option>
                                    <option value="+993">  +993 - Turkménistan  </option>
                                    <option value="+1649">  +1649 - Iles Turques et Caïques  </option>
                                    <option value="+688">  +688 - Tuvalu  </option>
                                    <option value="+256">  +256 - Ouganda  </option>
                                    <option value="+380">  +380 - Ukraine  </option>
                                    <option value="+971">  +971 - Emirats Arabes Unis  </option>
                                    <option value="+44">  +44 - Royaume-Uni  </option>
                                    <option value="+1">  +1 - États-Unis  </option>
                                    <option value="+598">  +598 - Uruguay  </option>
                                    <option value="+998">  +998 - Ouzbékistan  </option>
                                    <option value="+678">  +678 - Vanuatu  </option>
                                    <option value="+58">  +58 - Venezuela, République bolivarienne du Venezuela  </option>
                                    <option value="+84">  +84 - Vietnam  </option>
                                    <option value="+1284">  +1284 - Iles Vierges britanniques  </option>
                                    <option value="+1340">  +1340 - Iles Vierges Américaines  </option>
                                    <option value="+681">  +681 - Wallis et Futuna  </option>
                                    <option value="+967">  +967 - Yémen  </option>
                                    <option value="+260">  +260 - Zambie  </option>
                                    <option value="+263">  +263 - Zimbabwe  </option>
                                </select></div>
                            <div className="error text-danger">
                                {errors.calling_code && staffValidation.calling_code}
                            </div>
                        </div>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" name="mobile" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">  Image  </label>
                    <div className="card">
                        <div className="card-body">
                            <div className="dropify-wrapper has-preview"><div className="dropify-message">
                                <span className="file-icon"></span>
                                <p>  Faites glisser et déposez un fichier ici ou cliquez sur  </p>
                            </div>
                                <div className="dropify-loader" ></div>
                                <div className="dropify-errors-container"><ul></ul></div>

                                <input type="file" id="input-file-now" name="image" accept=".png,.jpg,.jpeg"
                                    className="dropify" data-default-file="/images/admin.png" />


                                <button type="button" className="btn">  Retirer  </button>
                                <div className="dropify-preview" ><span className="dropify-render">
                                    <img height="100" width="100" src="/images/admin.png" /></span>
                                    <div className="dropify-infos"><div className="dropify-infos-inner">
                                        <p className="dropify-filename"><span className="file-icon"></span>
                                            <span className="dropify-filename-inner">  avatar.png  </span></p>
                                        <p className="dropify-infos-message">  Faites glisser et déposez un fichier ou cliquez pour le remplacer  </p>
                                    </div></div></div></div>
                        </div>
                    </div>
                </div>



                <div className="form-group">
                    <label for="role">  Nom de rôle  </label>
                    <select onChange={handleInputChange} value={staff.role_id}
                        ref={register({ required: true })}
                        className="form-control" name="role_id" id="role_id">
                        <option value="1">  Administrateur   </option>
                        <option value="2">  Directeur  </option>
                    </select>
                    <div className="error text-danger">
                        {errors.role_id && staffValidation.role_id}
                    </div>
                </div>

                <button type="submit" id="save-form" className="btn btn-success waves-effect waves-light m-r-10">
                    <i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font>
                </button>



            </form>
        </div>
    )
};

EditStaff.propTypes = {};

EditStaff.defaultProps = {};

export default EditStaff;
