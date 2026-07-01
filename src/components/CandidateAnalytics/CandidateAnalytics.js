import React from 'react';
import PropTypes from 'prop-types';
import './CandidateAnalytics.css';
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

const stageOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const stageData = {
  labels: ['Applied', 'Qualified', 'Interviewed', 'Accepted'],
  datasets: [
    {
      label: 'Engineering',
      data: [640, 312, 180, 74],
      backgroundColor: '#255cdc',
      borderRadius: 8,
      maxBarThickness: 34,
    },
    {
      label: 'Business',
      data: [420, 221, 131, 58],
      backgroundColor: '#90b0f6',
      borderRadius: 8,
      maxBarThickness: 34,
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
      label: 'Avg. days in pipeline',
      data: [14, 13, 12, 12, 11, 11],
      borderColor: '#1f4ec8',
      backgroundColor: 'rgba(31, 78, 200, 0.2)',
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Avg. interview score',
      data: [72, 74, 73, 76, 79, 81],
      borderColor: '#27a58f',
      backgroundColor: 'rgba(39, 165, 143, 0.2)',
      tension: 0.3,
      fill: true,
    },
  ],
};

const profileData = {
  labels: ['Senior', 'Mid', 'Junior'],
  datasets: [
    {
      data: [32, 46, 22],
      backgroundColor: ['#285fe0', '#30a0f0', '#f3b35a'],
      borderWidth: 0,
    },
  ],
};

const KPI_CARDS = [
  { value: '1,060', label: 'Active candidates', trend: '+9.4% MoM' },
  { value: '73%', label: 'Qualified ratio', trend: '+4.1% MoM' },
  { value: '11 days', label: 'Avg. progression', trend: '-3 days QoQ' },
  { value: '81/100', label: 'Avg. interview score', trend: '+5 pts MoM' },
];

const CandidateAnalytics = () => (
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
            <strong className="card-title">Candidate Progress by Department</strong>
          </div>
          <div className="card-body">
            <Bar options={stageOptions} data={stageData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Seniority Mix</strong>
          </div>
          <div className="card-body">
            <Doughnut data={profileData} />
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-lg-8">
        <div className="card analytics-card">
          <div className="card-header">
            <strong className="card-title">Progression Speed and Quality</strong>
          </div>
          <div className="card-body">
            <Line options={trendOptions} data={trendData} />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card analytics-card analytics-insights">
          <div className="card-header">
            <strong className="card-title">Focus Areas</strong>
          </div>
          <div className="card-body">
            <ul>
              <li>Pipeline speed improved after interview scheduling automation.</li>
              <li>Junior candidate drop-off is higher after first interview stage.</li>
              <li>Prioritize profile enrichment for business-role applicants.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CandidateAnalytics.propTypes = {};

CandidateAnalytics.defaultProps = {};

export default CandidateAnalytics;
