import React from 'react';
import PropTypes from 'prop-types';
import './JobAnalytics.css';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const hiringStages = ['Sourcing', 'Screening', 'Interview', 'Offer', 'Filled'];

const pipelineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
};

const pipelineData = {
  labels: hiringStages,
  datasets: [
    {
      label: 'Current Month',
      data: [92, 66, 44, 18, 13],
      backgroundColor: '#2256d7',
      borderRadius: 8,
      maxBarThickness: 36,
    },
    {
      label: 'Last Month',
      data: [81, 59, 36, 15, 11],
      backgroundColor: '#91b0f8',
      borderRadius: 8,
      maxBarThickness: 36,
    },
  ],
};

const trendOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const trendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Open roles',
      data: [18, 21, 20, 25, 24, 27],
      borderColor: '#1f4ec8',
      backgroundColor: 'rgba(31, 78, 200, 0.2)',
      tension: 0.32,
      fill: true,
    },
    {
      label: 'Filled roles',
      data: [8, 9, 11, 12, 14, 15],
      borderColor: '#26a69a',
      backgroundColor: 'rgba(38, 166, 154, 0.2)',
      tension: 0.32,
      fill: true,
    },
  ],
};

const sourceData = {
  labels: ['LinkedIn', 'Career Site', 'Referral', 'Agency'],
  datasets: [
    {
      label: 'Applicants share',
      data: [41, 27, 19, 13],
      backgroundColor: ['#265de0', '#31a7f0', '#28b498', '#ffb45b'],
      borderWidth: 0,
    },
  ],
};

const KPI_CARDS = [
  { value: '27', label: 'Open Jobs', trend: '+3 this week' },
  { value: '15', label: 'Jobs Filled', trend: '+2 this week' },
  { value: '19 days', label: 'Avg. Fill Time', trend: '-2 days vs last month' },
  { value: '58%', label: 'Offer Acceptance', trend: '+6% MoM' },
];

const JobAnalytics = () => (
  <div className="analytics-page">
    <section className="analytics-kpis">
      {KPI_CARDS.map((item) => (
        <article className="analytics-kpi-card" key={item.label}>
          <h4>{item.value}</h4>
          <p>{item.label}</p>
          <span>{item.trend}</span>
        </article>
      ))}
    </section>

    <div className="row">
      <div className="col-lg-8">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Pipeline Stage Performance</strong>
          </div>
          <div className="card-body">
            <Bar options={pipelineOptions} data={pipelineData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Applicant Sources</strong>
          </div>
          <div className="card-body">
            <Doughnut data={sourceData} />
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-lg-8">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Open vs Filled Jobs Trend</strong>
          </div>
          <div className="card-body">
            <Line options={trendOptions} data={trendData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card analytics-insights">
          <div className="card-header">
            <strong className="card-title">Insights</strong>
          </div>
          <div className="card-body">
            <ul>
              <li>Interview to offer conversion is strongest for referral candidates.</li>
              <li>Agency channel has lower volume but higher acceptance rate this month.</li>
              <li>Senior frontend roles currently have the longest time-to-fill.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

JobAnalytics.propTypes = {};

JobAnalytics.defaultProps = {};

export default JobAnalytics;
