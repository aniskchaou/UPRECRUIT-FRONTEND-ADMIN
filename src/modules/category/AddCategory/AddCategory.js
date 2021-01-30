import React from 'react';
import './AddCategory.css';
import { useForm } from 'react-hook-form'
import axios from 'axios';
import  { Redirect } from 'react-router-dom'
import Category from './../Category/Category';
import AlertMsgs from '../../../libraries/messages/messages';
const AddCategory = (props) => {
    const { register, handleSubmit, errors } = useForm() // initialise the hook
    var msg='hhj';
    
   
    const onSubmit = (data) => { console.log(data) 
       
          const myNotification = window.createNotification({
           
      });
      myNotification({ 
        title: 'Title',
        message: 'Notification Message',
         // close on click
  closeOnClick: true,

  // displays close button
  displayCloseButton: false,

  // nfc-top-left
  // nfc-bottom-right
  // nfc-bottom-left
  positionClass: 'nfc-top-right',

  // callback
  onclick: false,

  // timeout in milliseconds
  

  // success, info, warning, error, and none
  theme: 'success'
      });
        axios.post('http://localhost:8080/category/create', data)
        .then(res => {
         
        }).catch(err=>{
            
        });
        msg="jfcfc"
       
        //window.alert("fjjg")
    } // callback when validation pass

    return (
        <div className="AddCategory">
        
        
            <form className="ajax-form" onSubmit={handleSubmit(onSubmit)} id="createForm" >

                <div id="education_fields">
                    <div className="row">
                        <div className="col-sm-9 nopadding">
                            <div className="form-group">
                                <div className="input-group">
                                    <input type="text" name="name" className="form-control" ref={register({ required: true })} placeholder="Nom des catégories d'emplois" />
                                </div>
                                <div className="error text-danger">
                                    {errors.name && 'Last name is required.'}
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

AddCategory.propTypes = {};

AddCategory.defaultProps = {};

export default AddCategory;


