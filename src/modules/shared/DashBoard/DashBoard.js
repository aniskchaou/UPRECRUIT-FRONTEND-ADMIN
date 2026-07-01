
import './DashBoard.css';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css'; // a dependency of timegrid
import '@fullcalendar/timegrid/main.css';

//import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
} from 'chart.js';
import { chartBarOption, intialChartBarData } from '../../../main/config/chart.bar';
//import expenseHTTPService from '../../../main/services/expenseHTTPService';
//import showMessage from '../../../libraries/messages/messages';

/* import activityHTTPService from '../../../main/services/activityHTTPService';
import revenueHTTPService from '../../../main/services/revenueHTTPService';
import memberHTTPService from '../../../main/services/memberHTTPService';
import attendanceHTTPService from '../../../main/services/attendanceHTTPService';
import activityHTTPServiceCopy from '../../../main/services/activityHTTPService copy';
import staffHTTPService from '../../../main/services/staffHTTPService';
import groupeHTTPService from '../../../main/services/groupeHTTPService'; */
import settingsHTTPService from '../../../main/services/settingsHTTPService';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, ArcElement, BarElement
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    maintainAspectRatio: false,
};

const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export const data2 = {
    labels: chartLabels,
    datasets: [
        {
            label: 'Applications',
            data: [8, 11, 14, 16, 21, 18, 24],
            borderColor: '#2358d8',
            backgroundColor: 'rgba(35, 88, 216, 0.18)',
            borderRadius: 10,
            maxBarThickness: 28,
        }

    ],
};

export const data = {
    labels: ['LinkedIn', 'Website', 'Referral', 'Outbound'],
    datasets: [
        {
            label: 'Sources',
            data: [38, 27, 20, 15],
            backgroundColor: [
                '#2358d8',
                '#13a38a',
                '#8b5cf6',
                '#f59e0b',
            ],
            borderWidth: 1,
        },
    ],
};

const lineData = {
    labels: chartLabels,
    datasets: [
        {
            label: 'Candidate pipeline',
            data: [5, 8, 9, 14, 17, 19, 22],
            borderColor: '#13a38a',
            backgroundColor: 'rgba(19, 163, 138, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#13a38a',
        },
    ],
};

const barOptions = {
    ...chartBarOption,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
};

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                color: 'rgba(148, 163, 184, 0.12)',
            },
            ticks: {
                stepSize: 5,
            },
        },
    },
};

const DashBoard = () => {
    const [expenseChart] = useState(intialChartBarData);
    const [incomeChart] = useState(data2);
    const [memberLine] = useState(lineData);
    const [activityPie] = useState(data);
    const [dashboardSettings, setDashboardSettings] = useState([]);


    useEffect(() => {
        getDashboardSettings()
    }, []);

    const getDashboardSettings = () => {
        settingsHTTPService.getDashboardSettings().then(data => {
            setDashboardSettings(data.data[0])
        })
    }

    const overviewMetrics = [
        {
            label: 'Open Jobs',
            value: '16',
            delta: '4 urgent positions',
            icon: 'fa-briefcase',
            color: '#2358d8',
        },
        {
            label: 'Draft Jobs',
            value: '6',
            delta: '3 ready to publish',
            icon: 'fa-file-alt',
            color: '#8b5cf6',
        },
        {
            label: 'Closed Jobs',
            value: '11',
            delta: 'This quarter',
            icon: 'fa-archive',
            color: '#6b7280',
        },
        {
            label: 'Total Applicants',
            value: '342',
            delta: '+24 this week',
            icon: 'fa-users',
            color: '#13a38a',
        },
        {
            label: 'Interviews Scheduled',
            value: '24',
            delta: '+18% this month',
            icon: 'fa-comments',
            color: '#f59e0b',
        },
        {
            label: 'Offers Sent',
            value: '9',
            delta: '3 pending response',
            icon: 'fa-paper-plane',
            color: '#10b981',
        },
        {
            label: 'Hires',
            value: '5',
            delta: 'This month',
            icon: 'fa-user-check',
            color: '#2358d8',
        },
        {
            label: 'Avg. Time to Hire',
            value: '18d',
            delta: '-2d vs last month',
            icon: 'fa-clock',
            color: '#ef4444',
        },
    ];

    const pendingApprovals = [
        { title: 'Senior Backend Engineer', type: 'Job', step: 'Dept. Manager', priority: 'High', by: 'Omar Nasser' },
        { title: 'Offer Letter — Candidate #14', type: 'Offer', step: 'Finance', priority: 'Urgent', by: 'Sara Benali' },
        { title: 'Marketing Specialist', type: 'Job', step: 'Finance', priority: 'Medium', by: 'Sara Benali' },
        { title: 'DevOps Engineer', type: 'Job', step: 'HR Director', priority: 'High', by: 'Omar Nasser' },
    ];

    const recentActivities = [
        { icon: 'fa-check-circle', color: '#13a38a', text: 'Frontend Developer job published', time: '2 hours ago' },
        { icon: 'fa-user-plus', color: '#2358d8', text: 'Candidate Sara Benali moved to 2nd interview', time: '4 hours ago' },
        { icon: 'fa-paper-plane', color: '#f59e0b', text: 'Offer sent to Candidate #22', time: '5 hours ago' },
        { icon: 'fa-user-times', color: '#ef4444', text: 'Application #88 rejected', time: '1 day ago' },
        { icon: 'fa-calendar-check', color: '#8b5cf6', text: 'Interview scheduled for Engineering panel', time: '1 day ago' },
    ];

    const departmentHiring = [
        { dept: 'Engineering', open: 7, hired: 2 },
        { dept: 'Sales', open: 3, hired: 1 },
        { dept: 'Marketing', open: 2, hired: 1 },
        { dept: 'HR', open: 2, hired: 1 },
        { dept: 'Finance', open: 2, hired: 0 },
    ];

    const subscriptionUsage = {
        plan: 'Business',
        seats: { used: 8, total: 15 },
        jobs: { used: 16, total: 25 },
        renewsIn: '28 days',
    };

    const dashboardTitle = dashboardSettings?.title || 'Recruitment intelligence overview';
    const dashboardSubtitle = dashboardSettings?.description || 'Track hiring momentum, candidate quality, and interview capacity from a single command surface.';

    return (
        <div className="dashboard-page">
            {/* Hero */}
            <section className="dashboard-hero card">
                <div className="dashboard-hero__content">
                    <div>
                        <span className="dashboard-hero__eyebrow">Performance cockpit</span>
                        <h2 className="dashboard-hero__title">{dashboardTitle}</h2>
                        <p className="dashboard-hero__subtitle">{dashboardSubtitle}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => window.print()}>
                                <i className="fa fa-download mr-1"></i> Export Report
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="fa fa-sliders-h mr-1"></i> Customize Widgets
                            </button>
                        </div>
                    </div>
                    <div className="dashboard-hero__aside">
                        <div className="dashboard-hero__score">
                            <span className="dashboard-hero__score-label">Hiring health</span>
                            <strong>86%</strong>
                            <small>Healthy pipeline across active roles</small>
                        </div>
                        <div className="dashboard-hero__mini-grid">
                            <div>
                                <span>Conversion</span>
                                <strong>34%</strong>
                            </div>
                            <div>
                                <span>Offer acceptance</span>
                                <strong>78%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* KPI Cards — 8 metrics */}
            <section className="row dashboard-metrics-row">
                {overviewMetrics.map((metric) => (
                    <div className="col-xl-3 col-md-6" key={metric.label}>
                        <article className="dashboard-metric-card card">
                            <div className="dashboard-metric-card__icon" style={{ background: metric.color + '18', color: metric.color }}>
                                <i className={`fa ${metric.icon}`}></i>
                            </div>
                            <div className="dashboard-metric-card__body">
                                <span className="dashboard-metric-card__label">{metric.label}</span>
                                <strong className="dashboard-metric-card__value">{metric.value}</strong>
                                <small className="dashboard-metric-card__delta">{metric.delta}</small>
                            </div>
                        </article>
                    </div>
                ))}
            </section>

            {/* Pending Approvals + Recent Activity */}
            <section className="row">
                <div className="col-xl-6">
                    <article className="card dashboard-focus-card" style={{ height: '100%' }}>
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Action required</span>
                                    <h3>Pending Approvals</h3>
                                </div>
                                <a href="/approval-workflow" className="btn btn-sm btn-outline-primary">View All</a>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {pendingApprovals.map((a) => (
                                    <li key={a.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <div>
                                            <strong style={{ fontSize: 13 }}>{a.title}</strong>
                                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                                {a.type} · {a.step} · by {a.by}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                            background: a.priority === 'Urgent' ? '#fee2e2' : a.priority === 'High' ? '#fff7ed' : '#eff6ff',
                                            color: a.priority === 'Urgent' ? '#ef4444' : a.priority === 'High' ? '#f59e0b' : '#2358d8',
                                        }}>
                                            {a.priority}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                </div>
                <div className="col-xl-6">
                    <article className="card" style={{ height: '100%' }}>
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Activity feed</span>
                                    <h3>Recent Activities</h3>
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {recentActivities.map((a) => (
                                    <li key={a.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: a.color + '18', color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                            <i className={`fa ${a.icon}`} style={{ fontSize: 12 }}></i>
                                        </span>
                                        <div>
                                            <div style={{ fontSize: 13 }}>{a.text}</div>
                                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.time}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                </div>
            </section>

            {/* Charts */}
            <section className="row" style={{ marginTop: 24 }}>
                <div className="col-xl-8">
                    <article className="card dashboard-chart-card dashboard-chart-card--feature">
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Hiring funnel</span>
                                    <h3>Application volume by month</h3>
                                </div>
                                <span className="dashboard-pill">Updated today</span>
                            </div>
                            <div className="dashboard-chart-frame">
                                <Bar options={barOptions} data={incomeChart} />
                            </div>
                        </div>
                    </article>
                </div>
                <div className="col-xl-4">
                    <article className="card dashboard-chart-card">
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Channel quality</span>
                                    <h3>Candidate source mix</h3>
                                </div>
                            </div>
                            <div className="dashboard-chart-frame dashboard-chart-frame--pie">
                                <Pie data={activityPie} options={options} />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* Hiring by Department + Pipeline Trend */}
            <section className="row" style={{ marginTop: 24 }}>
                <div className="col-xl-5">
                    <article className="card" style={{ height: '100%' }}>
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Workforce</span>
                                    <h3>Hiring by Department</h3>
                                </div>
                            </div>
                            <table style={{ width: '100%', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ color: '#9ca3af', fontWeight: 600, fontSize: 11 }}>
                                        <th style={{ paddingBottom: 8 }}>DEPARTMENT</th>
                                        <th style={{ paddingBottom: 8, textAlign: 'center' }}>OPEN</th>
                                        <th style={{ paddingBottom: 8, textAlign: 'center' }}>HIRED</th>
                                        <th style={{ paddingBottom: 8 }}>PROGRESS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departmentHiring.map(d => (
                                        <tr key={d.dept} style={{ borderTop: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '10px 0', fontWeight: 500 }}>{d.dept}</td>
                                            <td style={{ textAlign: 'center', color: '#6b7280' }}>{d.open}</td>
                                            <td style={{ textAlign: 'center', color: '#13a38a', fontWeight: 600 }}>{d.hired}</td>
                                            <td style={{ paddingLeft: 8 }}>
                                                <div style={{ background: '#f3f4f6', borderRadius: 4, height: 6, width: 80 }}>
                                                    <div style={{ background: '#2358d8', height: 6, borderRadius: 4, width: `${Math.round(d.hired / d.open * 100)}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>
                <div className="col-xl-7">
                    <article className="card dashboard-chart-card">
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Recruiter performance</span>
                                    <h3>Pipeline trend</h3>
                                </div>
                            </div>
                            <div className="dashboard-chart-frame">
                                <Line data={memberLine} options={lineOptions} />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* Subscription Usage */}
            <section className="row" style={{ marginTop: 24 }}>
                <div className="col-xl-4">
                    <article className="card">
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Plan</span>
                                    <h3>Subscription Usage</h3>
                                </div>
                                <a href="/billing" className="btn btn-sm btn-outline-primary">Manage</a>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                                    <span>Recruiter Seats</span>
                                    <strong>{subscriptionUsage.seats.used} / {subscriptionUsage.seats.total}</strong>
                                </div>
                                <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8, marginBottom: 12 }}>
                                    <div style={{ background: '#2358d8', height: 8, borderRadius: 4, width: `${Math.round(subscriptionUsage.seats.used / subscriptionUsage.seats.total * 100)}%` }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                                    <span>Active Jobs</span>
                                    <strong>{subscriptionUsage.jobs.used} / {subscriptionUsage.jobs.total}</strong>
                                </div>
                                <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8, marginBottom: 12 }}>
                                    <div style={{ background: '#13a38a', height: 8, borderRadius: 4, width: `${Math.round(subscriptionUsage.jobs.used / subscriptionUsage.jobs.total * 100)}%` }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                                    <span>Plan: <strong style={{ color: '#374151' }}>{subscriptionUsage.plan}</strong></span>
                                    <span>Renews in <strong style={{ color: '#f59e0b' }}>{subscriptionUsage.renewsIn}</strong></span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
                <div className="col-xl-8">
                    <article className="card dashboard-calendar-card">
                        <div className="card-body">
                            <div className="dashboard-section-heading">
                                <div>
                                    <span className="dashboard-section-heading__eyebrow">Interview planning</span>
                                    <h3>Schedule and capacity</h3>
                                </div>
                                <span className="dashboard-pill dashboard-pill--success">12 events this month</span>
                            </div>
                        </div>
                        <div className="card-calendar">
                            <FullCalendar
                                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                weekends={true}
                                headerToolbar={{
                                    left: 'dayGridMonth,timeGridWeek,timeGridDay',
                                    center: 'title',
                                    right: 'prevYear,prev,next,nextYear'
                                }}
                                slotMinTime="07:00:00"
                                slotMaxTime="20:00:00"
                                editable={false}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={2}
                                events={[
                                    { title: 'Engineering panel', date: '2026-07-05' },
                                    { title: 'Growth interview', date: '2026-07-08' },
                                    { title: 'Final round', date: '2026-07-12' }
                                ]}
                            />
                        </div>
                    </article>
                </div>
            </section>
        </div>
    )
};

export default DashBoard;
