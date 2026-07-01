import React from 'react';
import PropTypes from 'prop-types';
import './JobApplicationAnalytics.css';
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

const conversionOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const conversionData = {
  labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Accepted'],
  datasets: [
    {
      label: 'Current cycle',
      data: [1820, 1034, 412, 163, 98],
      backgroundColor: '#245adc',
      borderRadius: 8,
      maxBarThickness: 40,
    },
  ],
};

const volumeOptions = {
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

const volumeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Applications',
      data: [1260, 1352, 1415, 1587, 1724, 1820],
      borderColor: '#1f4fc9',
      backgroundColor: 'rgba(31, 79, 201, 0.2)',
      fill: true,
      tension: 0.3,
    },
    {
      label: 'Qualified',
      data: [650, 702, 741, 832, 936, 1034],
      borderColor: '#26a69a',
      backgroundColor: 'rgba(38, 166, 154, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
};

const qualityData = {
  labels: ['High fit', 'Medium fit', 'Low fit'],
  datasets: [
    {
      data: [36, 44, 20],
      backgroundColor: ['#2bb69e', '#2f8bf2', '#f4b85d'],
      borderWidth: 0,
    },
  ],
};

const KPI_CARDS = [
  { value: '1,820', label: 'Applications', trend: '+14.6% MoM' },
  { value: '56.8%', label: 'Screening Pass', trend: '+3.1% MoM' },
  { value: '24.7%', label: 'Interview Rate', trend: '+1.9% MoM' },
  { value: '6.6%', label: 'Offer Acceptance', trend: '+0.8% MoM' },
];

const JobApplicationAnalytics = () => (
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
            <strong className="card-title">Application Funnel</strong>
          </div>
          <div className="card-body">
            <Bar options={conversionOptions} data={conversionData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Candidate Fit Quality</strong>
          </div>
          <div className="card-body">
            <Doughnut data={qualityData} />
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-lg-8">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Monthly Volume Trend</strong>
          </div>
          <div className="card-body">
            <Line options={volumeOptions} data={volumeData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card analytics-insights">
          <div className="card-header">
            <strong className="card-title">Recommendations</strong>
          </div>
          <div className="card-body">
            <ul>
              <li>Double down on referral campaigns for high-fit candidates.</li>
              <li>Review screening criteria for high-volume but low-quality channels.</li>
              <li>Trigger auto-reminders to reduce interview no-show rates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

JobApplicationAnalytics.propTypes = {};

JobApplicationAnalytics.defaultProps = {};

export default JobApplicationAnalytics;
