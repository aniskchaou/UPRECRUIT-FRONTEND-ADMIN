import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import { NavLink, useHistory } from 'react-router-dom';
import UserSettings from '../../config/user';
import TaskTestService from '../../mocks/TaskTestService';

const Header = (props) => {
    let history = useHistory()
    const [tasks, setTask] = useState([]);

    const logout = () => {
        props.rerender();
        UserSettings.CONNECTED_USER = false
        history.push("/login")
    }

    useEffect(() => {
        retrievetasks()
    }, []);

    const retrievetasks = () => {
        var tasks = TaskTestService.getAll();
        setTask(tasks);
    };


    return (
        <div style={{ display: (UserSettings.CONNECTED_USER ? 'block' : 'none') }} id="right-panel" className="right-panel">
            <header id="header" className="header">
                <div className="top-left">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="./"><img src="images/logo.png" alt="Logo" /></a>
                        <a className="navbar-brand hidden" href="./"><img src="images/logo2.png" alt="Logo" /></a>
                        <a id="menuToggle" className="menutoggle"><i className="fa fa-bars"></i></a>
                    </div>
                </div>
                <div className="top-right">
                    <div className="header-menu">
                        <div className="header-left">
                            <button className="search-trigger"><i className="fa fa-search"></i></button>
                            <div className="form-inline">
                                <form className="search-form">
                                    <input className="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search" />
                                    <button className="search-close" type="submit"><i className="fa fa-close"></i></button>
                                </form>
                            </div>

                            {/*     <div className="dropdown for-notification">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-puzzle-piece"></i>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="notification">
                                    <p className="red">Shortcuts</p>
                                    <NavLink to="/add-job" className="dropdown-item media" >
                                        <i class="fas fa-plus-circle"></i>
                                        <p>Add Offer</p>
                                    </NavLink>
                                    <NavLink to="/add-interview" className="dropdown-item media" >
                                        <i class="fas fa-plus-circle"></i>
                                        <p>Add interview</p>
                                    </NavLink>
                                    <NavLink to="/add-task" className="dropdown-item media">
                                        <i class="fas fa-plus-circle"></i>
                                        <p>Add task</p>
                                    </NavLink>
                                </div>
                            </div> */}

                            {/*                             <div className="dropdown for-message">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="message" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-tasks"></i>
                                    <span className="count bg-primary">4</span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="message">
                                    <p className="red">Tasks</p>

                                    {tasks.map(item =>
                                        <NavLink className="dropdown-item media" to="/task">

                                            <div className="message media-body">
                                                <span className="name float-left">{item.title}</span>
                                                <span className="time float-right">in progress</span>

                                            </div>
                                        </NavLink>
                                    )}



                                </div>
                            </div> */}
                        </div>

                        <div className="user-area dropdown float-right">
                            <a href="#" className="dropdown-toggle active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="user-avatar rounded-circle" src="images/admin.png" alt="User Avatar" />
                            </a>

                            <div className="user-menu dropdown-menu">
                                <NavLink className="nav-link" to="/profile"><i className="fa fa-user"></i>My Profil</NavLink>

                                <NavLink className="nav-link" to="/configuration"><i className="fa fa-cog"></i>Settings</NavLink>

                                <NavLink onClick={logout} className="nav-link" to="/"><i className="fa fa-power-off"></i>Log out</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
