import React, { useEffect, useState } from 'react';
import './Category.css';
import { LoadJS } from '../../../libraries/datatables/datatables';
import EditCategory from '../EditCategory/EditCategory';
import AddCategory from '../AddCategory/AddCategory';
import useForceUpdate from 'use-force-update';
import showMessage from '../../../libraries/messages/messages';
import categoryMessage from '../../../main/messages/categoryMessage';
import CategoryTestService from '../../../main/mocks/CategoryTestService';
import HTTPService from '../../../main/services/HTTPService';





const Category = () => {




  const [categorys, setCategorys] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    LoadJS()
    retrieveCategorys()
  }, []);


  const getAll = () => {
    HTTPService.getAll()
      .then(response => {
        setCategorys(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeOne = (data) => {
    HTTPService.remove(data)
      .then(response => {

      })
      .catch(e => {

      });
  }



  const retrieveCategorys = () => {
    var categorys = CategoryTestService.getAll();
    setCategorys(categorys);
  };

  const resfresh = () => {
    retrieveCategorys()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', categoryMessage.delete, 'success')
      CategoryTestService.remove(data)
      //removeOne(data)
      resfresh()
    }

  }

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfresh()
  }



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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorys.map(item => (
              <tr>
                <td>{item.category}</td>
                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editCategory" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, categorys.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
              </tr>))}


          </tbody>
          <tfoot>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-success btn-sm"><i class="fas fa-plus"></i>
 Ajouter</button>

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
                <EditCategory category={updatedItem} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddCategory />
              </div>
              <div className="modal-footer">
                <button onClick={resfresh} type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Category;

