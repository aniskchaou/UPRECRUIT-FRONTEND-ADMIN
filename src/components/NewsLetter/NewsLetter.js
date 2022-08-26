import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './NewsLetter.css';

const NewsLetter = () => {

  const [users, setUsers] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  // const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LoadJS()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    /*  setLoading(true);
     userHTTPService.getAllUser()
       .then(response => {
         setUsers(response.data);
         setLoading(false);
       })
       .catch(e => {
         showMessage('Confirmation', e, 'info')
       }); */
  };

  const removePatientAction = (e, data) => {
    /*  e.preventDefault();
     var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
     if (r) {
       showMessage('Confirmation', 'patientMessage.delete', 'success')
       userHTTPService.removeUser(data).then(data => {
         getAllPatient()
       }).catch(e => {
         showMessage('Confirmation', e, 'warning')
       });
     } */
  }

  const updatePatientAction = (e, data) => {
    /*   e.preventDefault();
      setUpdatedItem(data)
      //resfresh() */
  }



  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">NewsLetters</strong>
      </div>
      <div className="card-body">
        <table id="bootstrap-data-table" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr><td></td></tr>


          </tbody>
        </table>







      </div>
    </div>
  )
}

NewsLetter.propTypes = {};

NewsLetter.defaultProps = {};

export default NewsLetter;
