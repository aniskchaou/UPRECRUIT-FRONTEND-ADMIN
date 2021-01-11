import React, { useState, useEffect,forceUpdate } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Category.css';
import AddCategory from './../AddCategory/AddCategory';
import EditCategory from './../EditCategory/EditCategory';
import { LoadJS } from './../init';





export default class PersonList extends React.Component {





  state = {
    categories: [],
    id:''
  }

   refresh= (e)=>{
    e.preventDefault();
    axios.get(`http://localhost:8080/categories`)
    .then(res => {
      const categories = res.data._embedded.categories;
      this.setState({ categories });
    })
   }


   deleteCategory = (e,id) => {
    // return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
    e.preventDefault();
     
   
     axios(`http://localhost:8080/category/delete/${id}`)
       .then(res => {
        this.setState(previousState => {
          return {
            categories: previousState.categories.filter(m => m.id !==id)
          };
        });
       })
   
   }

  componentDidMount() {
    LoadJS()
    axios.get(`http://localhost:8080/categories`)
      .then(res => {
        const categories = res.data._embedded.categories;
        this.setState({ categories });
      })
  }

  render() {

    return (
       
  <div className="card">
    
  <div className="card-header">
    <strong className="card-title">Catégories d'emplois</strong>
  </div>
  <div className="card-body">

    <table id="example1" className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Remarque</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {this.state.categories.map(item => (
        <tr>
          <td>{item.name}</td>
          <td>{item.name}</td>
          <td>
            <button type="button" data-toggle="modal" data-target="#editCategory" className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
            <button type="button" className="btn btn-danger btn-sm" onClick={e =>this.deleteCategory(e,item.id)}><i className="fas fa-trash-alt"></i></button></td>


        </tr>))}</tbody>
    </table>
    <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-success btn-sm">Ajouter</button>

    <div className="modal fade" id="editCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <EditCategory />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <div   className="modal fade" id="addCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
             <AddCategory/>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={e =>this.refresh(e)} data-dismiss="modal">Close</button>
           
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
    )
  }
}


