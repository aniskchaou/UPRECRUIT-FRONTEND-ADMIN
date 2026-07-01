import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import { NavLink, useHistory } from 'react-router-dom';
import UserSettings from '../../config/user';
import TaskTestService from '../../mocks/TaskTestService';
import memberMessageHTTPService from '../../services/memberMessageHTTPService';

const Header = ({ connected, handleClick }) => {
    let history = useHistory()
    const [tasks, setTask] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msgOpen, setMsgOpen] = useState(false);
    const msgRef = useRef(null);
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    const logout = () => {
        handleClick(false)
        localStorage.removeItem('adminConnected')
        localStorage.clear()
        history.push("/login")
    }

    useEffect(() => {
        retrievetasks();
        memberMessageHTTPService.getAll()
            .then(res => setMessages(res.data || []))
            .catch(() => setMessages([]));
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (msgRef.current && !msgRef.current.contains(e.target)) {
                setMsgOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const retrievetasks = () => {
        var tasks = TaskTestService.getAll();
        setTask(tasks);
    };

    const unreadCount = messages.filter(m => m.unread === 'true' || m.unread === true).length;


    return (
        <div id="right-panel" className="right-panel">
            <header id="header" className="header">
                <div className="top-left">
                    <div className="brand-block">
                        <div className="brand-mark">
                            <i className="fa fa-briefcase"></i>
                        </div>
                        <div className="brand-meta">
                            <h1 className="brand-title">UPRECRUIT Admin</h1>
                            <p className="brand-subtitle">{greeting}. {formattedDate} recruitment briefing.</p>
                        </div>
                    </div>
                </div>
                <div className="top-right">
                    <div className="header-menu">
                        <div className="header-search">
                            <i className="fa fa-search search-icon"></i>
                            <input type="text" placeholder="Search candidates, jobs, companies..." aria-label="Search" />
                        </div>

                        <div className="msg-bell" ref={msgRef}>
                            <button className="msg-bell__btn" onClick={() => setMsgOpen(o => !o)} aria-label="Messages">
                                <i className="fa fa-comments"></i>
                                {unreadCount > 0 && (
                                    <span className="msg-bell__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                                )}
                            </button>
                            {msgOpen && (
                                <div className="msg-bell__dropdown">
                                    <div className="msg-bell__header">
                                        <span>Messages</span>
                                        <span className="msg-bell__count">{messages.length} total</span>
                                    </div>
                                    <div className="msg-bell__list">
                                        {messages.length === 0 ? (
                                            <div className="msg-bell__empty">No messages yet</div>
                                        ) : (
                                            messages.slice().reverse().map((msg, i) => (
                                                <div key={msg.id || i} className={`msg-bell__item${msg.unread === 'true' || msg.unread === true ? ' msg-bell__item--unread' : ''}`}>
                                                    <div className="msg-bell__avatar">
                                                        <i className="fa fa-user-circle"></i>
                                                    </div>
                                                    <div className="msg-bell__body">
                                                        <div className="msg-bell__name">{msg.recruiter || 'Anonymous'}</div>
                                                        <div className="msg-bell__preview">{msg.preview || '(no message)'}</div>
                                                    </div>
                                                    {(msg.unread === 'true' || msg.unread === true) && (
                                                        <span className="msg-bell__dot"></span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <NavLink to="/add-job" className="header-cta">
                            <i className="fa fa-plus-circle"></i>&nbsp;Create Job
                        </NavLink>

                        <NavLink to="/add-interview" className="header-cta">
                            <i className="fa fa-calendar-plus"></i>&nbsp;Schedule
                        </NavLink>

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

                        <div className="user-area dropdown float-right">
                            <a href="#" className="dropdown-toggle active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="user-avatar rounded-circle" src="images/admin.png" alt="User Avatar" />
                                <span className="header-profile-copy">
                                    <span className="header-profile-name">Admin User</span>
                                    <span className="header-profile-role">Workspace owner</span>
                                </span>
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
