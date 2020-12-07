import React from 'react';
import PropTypes from 'prop-types';
import './DashBoard.css';

const DashBoard = () => (
<div className="row">
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="stat-widget-five">
                                    <div className="stat-icon dib flat-color-1">
                                        <i className="pe-7s-cash"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="text-left dib">
                                            <div className="stat-text"><span className="count">12</span></div>
                                            <div className="stat-heading">Candidats</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="stat-widget-five">
                                    <div className="stat-icon dib flat-color-2">
                                        <i className="pe-7s-cart"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="text-left dib">
                                            <div className="stat-text"><span className="count">Entretien</span></div>
                                            <div className="stat-heading">5</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="stat-widget-five">
                                    <div className="stat-icon dib flat-color-3">
                                        <i className="pe-7s-browser"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="text-left dib">
                                            <div className="stat-text"><span className="count">21</span></div>
                                            <div className="stat-heading">Emplois</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="stat-widget-five">
                                    <div className="stat-icon dib flat-color-4">
                                        <i className="pe-7s-users"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="text-left dib">
                                            <div className="stat-text"><span className="count">2</span></div>
                                            <div className="stat-heading">Taches</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
</div>

);

DashBoard.propTypes = {};

DashBoard.defaultProps = {};

export default DashBoard;
