import React, { useEffect, useState } from 'react';
import './EditCategory.css';
import { useForm } from 'react-hook-form';
import CategoryTestService from '../../../main/mocks/CategoryTestService';
import showMessage from '../../../libraries/messages/messages';
import categoryMessage from '../../../main/messages/categoryMessage';
import categoryValidation from '../../../main/validations/categoryValidation';
import categoryHTTPService from '../../../main/services/categoryHTTPService';
const EditCategory = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [category, setCategory] = useState(props.category);

  useEffect(() => {
    setCategory(props.category)
  }, [props.category]);


  const onSubmit = (data) => {

    // CategoryTestService.update(props.category, data)
    categoryHTTPService.editCategory(props.category.id, data).then(data => {
      showMessage('Confirmation', categoryMessage.edit, 'success')
    })

  }
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCategory({ ...category, [name]: value });
  };


  return (
    <div className="EditCategory">
      <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

        <div id="education_fields">
          <div className="row">
            <div className="col-sm-9 nopadding">
              <div className="form-group">

                <div className="input-group">
                  <input type="text" onChange={handleInputChange} value={category.category} name="category" className="form-control" ref={register({ required: true })} placeholder="Nom des catégories d'emplois" />
                </div>



              </div>
            </div>
          </div>
        </div>

        <button type="submit" id="save-form" className="btn btn-success"><i className="fa fa-check"></i><font ><font  > Sauvegarder</font></font></button>
      </form>
    </div>
  )
};

EditCategory.propTypes = {};

EditCategory.defaultProps = {};

export default EditCategory;
