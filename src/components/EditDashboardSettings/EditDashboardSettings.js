import PropTypes from 'prop-types';
import './EditDashboardSettings.css';
import { useForm } from 'react-hook-form';


import React, { useEffect, useState } from 'react';

import settingsHTTPService from '../../main/services/settingsHTTPService';
import showMessage from '../../libraries/messages/messages';
const EditDashboardSettings = () => {
    const { register, handleSubmit, errors } = useForm()
    const [dashboardSettings, setDashboardSettings] = useState();

    useEffect(() => {
        getDashboardSettings()
    }, [])
    const handleInputChange = event => {
        const { name, value } = event.target;
        setDashboardSettings({ ...dashboardSettings, [name]: value });
    };

    const getDashboardSettings = () => {
        settingsHTTPService.getDashboardSettings().then(data => {
            console.log(data.data[0])
            setDashboardSettings(data.data[0])

        })
    }

    const onSubmit = (data) => {
        settingsHTTPService.editDashboardSettings(dashboardSettings.id, data).then(data => {
            console.log(data)
            showMessage('Confirmation', 'CurrentUser.UPDATE_MSG', 'success')
        })
    }
    return (
        <div className="EditDashboardSettings">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group row">
                    <label htmlFor="select2" className="col-4 col-form-label">Show Summary</label>
                    <div className="col-8">
                        <select onChange={handleInputChange} value={dashboardSettings?.showSummary || ""} ref={register({ required: true })}
                            id="select2" name="showSummary" className="custom-select">

                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="select2" className="col-4 col-form-label">Show Calendar</label>
                    <div className="col-8">
                        <select onChange={handleInputChange} value={dashboardSettings?.showCalendar || ""} ref={register({ required: true })}
                            id="select2" name="showCalendar" className="custom-select">

                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="select2" className="col-4 col-form-label">Show Charts</label>
                    <div className="col-8">
                        <select onChange={handleInputChange} value={dashboardSettings?.showExpenseIncomeCharts || ""} ref={register({ required: true })}
                            id="select2" name="showExpenseIncomeCharts" className="custom-select">

                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="offset-4 col-8">
                        <button name="submit" type="submit" className="btn btn-primary"><i className="far fa-save"></i>
                            Save</button>
                    </div>
                </div>


            </form>
        </div>
    )
};

EditDashboardSettings.propTypes = {};

EditDashboardSettings.defaultProps = {};

export default EditDashboardSettings;

