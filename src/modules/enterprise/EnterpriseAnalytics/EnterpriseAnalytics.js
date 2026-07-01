import React, { useState, useMemo } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const KPI_DATA = {
  timeToHire:         { value: 28, unit: 'days', trend: -3, label: 'Time to Hire', icon: 'fa-clock-o',        color: '#3b82f6', description: 'Average calendar days from job post to offer accepted' },
  costPerHire:        { value: 4200, unit: 'USD', trend: -320, label: 'Cost per Hire', icon: 'fa-money',       color: '#16a34a', description: 'Total recruiting spend divided by number of hires' },
  offerAcceptance:    { value: 78, unit: '%', trend: +4, label: 'Offer Acceptance Rate', icon: 'fa-handshake-o', color: '#8b5cf6', description: 'Offers signed ÷ offers sent × 100' },
  sourceQuality:      { value: 42, unit: '%', label: 'Top Source Quality', icon: 'fa-bullseye',                 color: '#f59e0b', description: 'Hires from best-performing source channel' },
  recruiterLoad:      { value: 14, unit: 'reqs', trend: +2, label: 'Avg Recruiter Load', icon: 'fa-user-o',    color: '#ec4899', description: 'Open requisitions per recruiter this month' },
  diversityRate:      { value: 47, unit: '%', trend: +3, label: 'Diverse Hires', icon: 'fa-users',             color: '#64748b', description: '% of hires from underrepresented groups (self-declared)' },
};

const MONTHLY_HIRES = [12, 19, 15, 24, 22, 28];
const MONTHLY_COST  = [4800, 4600, 4500, 4300, 4250, 4200];
const MONTHLY_OAR   = [70, 72, 74, 75, 76, 78];

const SOURCE_DATA = [
  { source: 'LinkedIn',        hires: 38, cost: 3800, color: '#0077b5' },
  { source: 'Referral',        hires: 27, cost: 1200, color: '#16a34a' },
  { source: 'Company Website', hires: 18, cost: 900,  color: '#3b82f6' },
  { source: 'Indeed',          hires: 10, cost: 4200, color: '#f59e0b' },
  { source: 'Agency',          hires: 7,  cost: 8500, color: '#ec4899' },
];
const totalSourceHires = SOURCE_DATA.reduce((s, r) => s + r.hires, 0);

const DEPT_REPORT = [
  { dept: 'Engineering',  openings: 15, hires: 12, avgDays: 32, costPerHire: 5200, color: '#3b82f6' },
  { dept: 'Sales',        openings: 10, hires: 9,  avgDays: 21, costPerHire: 3800, color: '#16a34a' },
  { dept: 'HR',           openings: 4,  hires: 3,  avgDays: 18, costPerHire: 2900, color: '#f59e0b' },
  { dept: 'Marketing',    openings: 5,  hires: 4,  avgDays: 24, costPerHire: 3500, color: '#ec4899' },
  { dept: 'Finance',      openings: 3,  hires: 3,  avgDays: 20, costPerHire: 3100, color: '#8b5cf6' },
  { dept: 'Operations',   openings: 6,  hires: 4,  avgDays: 26, costPerHire: 4100, color: '#64748b' },
];

const RECRUITER_REPORT = [
  { name: 'Diana Walsh',    openReqs: 18, hiresMTD: 7, avgDays: 26, oar: 82, satisfactionScore: 4.6 },
  { name: 'Priya Kapoor',   openReqs: 12, hiresMTD: 5, avgDays: 30, oar: 75, satisfactionScore: 4.2 },
  { name: 'James Clifford', openReqs: 14, hiresMTD: 6, avgDays: 28, oar: 79, satisfactionScore: 4.4 },
  { name: 'Mark Osei',      openReqs: 11, hiresMTD: 4, avgDays: 33, oar: 71, satisfactionScore: 4.0 },
];

const FUNNEL_STAGES = [
  { stage: 'Applications',    count: 1240 },
  { stage: 'Screened',        count: 620  },
  { stage: 'Phone Interview', count: 310  },
  { stage: 'Technical Test',  count: 180  },
  { stage: 'Final Interview', count: 95   },
  { stage: 'Offer Made',      count: 52   },
  { stage: 'Offer Accepted',  count: 41   },
  { stage: 'Hired',           count: 38   },
];

const CONVERSION_DATA = [
  { stage: 'Applications → Screened',         rate: 50 },
  { stage: 'Screened → Phone Interview',       rate: 50 },
  { stage: 'Phone → Technical Test',           rate: 58 },
  { stage: 'Technical Test → Final Interview', rate: 53 },
  { stage: 'Final Interview → Offer',          rate: 55 },
  { stage: 'Offer → Signed',                   rate: 79 },
  { stage: 'Signed → Hired',                   rate: 93 },
];

const PREDICT_DEMAND = [
  { dept: 'Engineering',  current: 25, predicted: 34, growth: '+36%', confidence: 88, driver: 'Product roadmap expansion' },
  { dept: 'Sales',        current: 15, predicted: 22, growth: '+47%', confidence: 82, driver: 'New market entry (APAC)' },
  { dept: 'Marketing',    current: 5,  predicted: 7,  growth: '+40%', confidence: 75, driver: 'Brand growth initiative' },
  { dept: 'HR',           current: 3,  predicted: 4,  growth: '+33%', confidence: 70, driver: 'Headcount scaling rules' },
];

const PREDICT_DROPOFF = [
  { stage: 'Application form', risk: 'Low',    pct: 8,  fix: 'Simplify form fields — aim for <5 minutes to complete' },
  { stage: 'Technical Test',   risk: 'High',   pct: 42, fix: 'Reduce test duration; send prep guide 48h before' },
  { stage: 'Offer → Sign',     risk: 'Medium', pct: 22, fix: 'Close within 5 days of verbal; counter-offer support' },
  { stage: 'Preboarding',      risk: 'Low',    pct: 6,  fix: 'Automated welcome email sequence in place' },
];

const PREDICT_OAR = [
  { candidate: 'Sophia Lee',   role: 'Senior Engineer', probability: 91, factors: ['Competitive salary (+8% above median)', 'Remote-first policy', 'Strong technical team match'] },
  { candidate: 'Luis Gomez',   role: 'Data Analyst',    probability: 74, factors: ['Salary at market median', 'Competing offer likely (2 active processes)'] },
  { candidate: 'Aisha Patel',  role: 'Marketing Lead',  probability: 83, factors: ['Equity component resonated', 'Fast process — 3-week cycle'] },
  { candidate: 'Tom Fischer',  role: 'Sales Manager',   probability: 68, factors: ['Commission structure needs clarification', 'Long commute concern noted'] },
];

const SECTIONS = [
  { id: 'dashboard',   label: 'Executive Dashboard', icon: 'fa-tachometer' },
  { id: 'source',      label: 'Source of Hire',      icon: 'fa-bullseye' },
  { id: 'reports',     label: 'Reports',             icon: 'fa-bar-chart' },
  { id: 'funnel',      label: 'Funnel Analytics',    icon: 'fa-filter' },
  { id: 'predictive',  label: 'Predictive Analytics', icon: 'fa-magic' },
];

// ─── Mini chart helpers ───────────────────────────────────────────────────────

const Sparkline = ({ data, color, height = 48 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={height} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="3" fill={color} />
    </svg>
  );
};

const Bar = ({ value, max, color, label }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <span style={{ width: '130px', fontSize: '12px', color: '#475569', flexShrink: 0, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ width: '36px', fontSize: '12px', fontWeight: 700, color: '#1e293b', textAlign: 'right' }}>{value}</span>
    </div>
  );
};

const RISK_COLOR = { Low: '#16a34a', Medium: '#f59e0b', High: '#dc2626' };
const RISK_BG    = { Low: '#d1fae5', Medium: '#fef3c7', High: '#fee2e2' };

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseAnalytics = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [reportTab, setReportTab] = useState('dept');
  const [predictTab, setPredictTab] = useState('demand');
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredDept = deptFilter === 'All' ? DEPT_REPORT : DEPT_REPORT.filter((d) => d.dept === deptFilter);

  return (
    <div className="user-management">
      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-bar-chart" /><span>Analytics & BI</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button"
            className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`}
            onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="user-management__main">

        {/* ── Executive Dashboard ── */}
        {activeSection === 'dashboard' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-tachometer" /> Executive Dashboard</h4>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Real-time recruiting KPIs across all departments and channels — updated daily.</p>

            {/* KPI cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
              {Object.values(KPI_DATA).map((kpi) => (
                <div key={kpi.label} style={{ flex: '1 1 210px', background: '#fff', border: `1px solid ${kpi.color}33`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: kpi.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</span>
                    <i className={`fa ${kpi.icon}`} style={{ color: kpi.color, opacity: 0.6 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                      {kpi.unit === 'USD' ? `$${kpi.value.toLocaleString()}` : kpi.value}
                    </span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{kpi.unit !== 'USD' ? kpi.unit : ''}</span>
                  </div>
                  {kpi.trend != null && (
                    <div style={{ fontSize: '11px', color: kpi.trend < 0 ? (kpi.label.includes('Cost') || kpi.label.includes('Time') || kpi.label.includes('Load') ? '#16a34a' : '#dc2626') : '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <i className={`fa ${kpi.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`} />
                      {kpi.trend > 0 ? '+' : ''}{kpi.unit === 'USD' ? `$${Math.abs(kpi.trend).toLocaleString()}` : Math.abs(kpi.trend)}{kpi.unit !== 'USD' ? kpi.unit : ''} vs last month
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{kpi.description}</p>
                </div>
              ))}
            </div>

            {/* Trend charts row */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {[
                { title: 'Monthly Hires',         data: MONTHLY_HIRES, color: '#3b82f6', suffix: '' },
                { title: 'Cost per Hire (USD)',    data: MONTHLY_COST,  color: '#16a34a', suffix: '' },
                { title: 'Offer Acceptance Rate',  data: MONTHLY_OAR,   color: '#8b5cf6', suffix: '%' },
              ].map((chart) => (
                <div key={chart.title} style={{ flex: '1 1 220px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>{chart.title}</div>
                  <Sparkline data={chart.data} color={chart.color} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    {MONTHS.map((m, i) => (
                      <span key={m} style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>
                        {m}<br />
                        <span style={{ fontWeight: 700, color: '#475569' }}>{chart.suffix}{chart.data[i].toLocaleString()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Diversity metrics */}
            <div style={{ marginTop: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ marginBottom: '12px' }}><i className="fa fa-users" style={{ color: '#64748b' }} /> Diversity Metrics (self-declared, last 6 months)</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {[
                  { label: 'Gender — Women',   value: 47, color: '#ec4899' },
                  { label: 'Underrepresented Minorities', value: 31, color: '#8b5cf6' },
                  { label: 'Disability Disclosure', value: 12, color: '#3b82f6' },
                  { label: 'Veterans',          value: 8,  color: '#f59e0b' },
                ].map((m) => (
                  <div key={m.label} style={{ flex: '1 1 200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{m.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: m.color }}>{m.value}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Source of Hire ── */}
        {activeSection === 'source' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-bullseye" /> Source of Hire</h4>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{totalSourceHires}</strong><span>Total Hires</span></div>
              <div className="user-management__kpi"><strong>{SOURCE_DATA[0].source}</strong><span>Top Volume Source</span></div>
              <div className="user-management__kpi"><strong>{SOURCE_DATA[1].source}</strong><span>Lowest Cost Source</span></div>
              <div className="user-management__kpi"><strong>USD {Math.min(...SOURCE_DATA.map((s) => s.cost)).toLocaleString()}</strong><span>Best Cost per Hire</span></div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              {/* Hires by source */}
              <div style={{ flex: '2 1 280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h5 style={{ marginBottom: '14px' }}>Hires by Source</h5>
                {SOURCE_DATA.map((s) => (
                  <Bar key={s.source} label={s.source} value={s.hires} max={totalSourceHires} color={s.color} />
                ))}
                {/* Stacked bar */}
                <div style={{ display: 'flex', height: '18px', borderRadius: '6px', overflow: 'hidden', marginTop: '12px', gap: '1px' }}>
                  {SOURCE_DATA.map((s) => (
                    <div key={s.source} title={`${s.source}: ${s.hires}`}
                      style={{ flex: s.hires, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.hires >= 15 && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>{Math.round((s.hires / totalSourceHires) * 100)}%</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost per hire by source */}
              <div style={{ flex: '2 1 280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h5 style={{ marginBottom: '14px' }}>Cost per Hire by Source</h5>
                {SOURCE_DATA.map((s) => (
                  <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ width: '130px', fontSize: '12px', color: '#475569', flexShrink: 0, textAlign: 'right' }}>{s.source}</span>
                    <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((s.cost / Math.max(...SOURCE_DATA.map((d) => d.cost))) * 100)}%`, height: '100%', background: s.cost <= 2000 ? '#16a34a' : s.cost <= 4500 ? '#f59e0b' : '#ef4444', borderRadius: '4px' }} />
                    </div>
                    <span style={{ width: '60px', fontSize: '12px', fontWeight: 700, color: '#1e293b', textAlign: 'right' }}>USD {s.cost.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop: '10px', padding: '8px 10px', background: '#f0fdf4', borderRadius: '6px', fontSize: '11px', color: '#15803d' }}>
                  <i className="fa fa-lightbulb-o" /> Referrals cost <strong>USD 1,200</strong> per hire — 7× cheaper than Agency hires.
                </div>
              </div>
            </div>

            {/* Source quality table */}
            <div className="user-management__table-wrapper" style={{ marginTop: '20px' }}>
              <table className="user-management__table">
                <thead>
                  <tr><th>Source</th><th>Hires</th><th>Share</th><th>Cost / Hire</th><th>Quality Score</th></tr>
                </thead>
                <tbody>
                  {SOURCE_DATA.map((s) => {
                    const share = Math.round((s.hires / totalSourceHires) * 100);
                    const quality = s.source === 'Referral' ? 94 : s.source === 'Company Website' ? 88 : s.source === 'LinkedIn' ? 81 : s.source === 'Indeed' ? 73 : 65;
                    return (
                      <tr key={s.source}>
                        <td><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} /><strong>{s.source}</strong></span></td>
                        <td style={{ fontWeight: 700 }}>{s.hires}</td>
                        <td><span style={{ fontWeight: 600, color: '#3b82f6' }}>{share}%</span></td>
                        <td>USD {s.cost.toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${quality}%`, height: '100%', background: quality >= 85 ? '#16a34a' : quality >= 75 ? '#f59e0b' : '#ef4444' }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>{quality}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Reports ── */}
        {activeSection === 'reports' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-bar-chart" /> Reports</h4>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[['dept', 'fa-building', 'Department Hiring'], ['recruiter', 'fa-user', 'Recruiter Performance'], ['conversion', 'fa-exchange', 'Candidate Conversion']].map(([id, icon, label]) => (
                <button key={id} type="button"
                  className={`btn btn-sm ${reportTab === id ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setReportTab(id)}>
                  <i className={`fa ${icon}`} /> {label}
                </button>
              ))}
            </div>

            {/* Department Hiring Report */}
            {reportTab === 'dept' && (
              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <button type="button" className={`btn btn-sm ${deptFilter === 'All' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setDeptFilter('All')}>All</button>
                  {DEPT_REPORT.map((d) => <button key={d.dept} type="button" className={`btn btn-sm ${deptFilter === d.dept ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setDeptFilter(d.dept)}>{d.dept}</button>)}
                </div>
                <div className="user-management__table-wrapper">
                  <table className="user-management__table">
                    <thead>
                      <tr><th>Department</th><th>Open Roles</th><th>Hires MTD</th><th>Fill Rate</th><th>Avg Time to Hire</th><th>Cost / Hire</th></tr>
                    </thead>
                    <tbody>
                      {filteredDept.map((d) => {
                        const fillRate = Math.round((d.hires / d.openings) * 100);
                        return (
                          <tr key={d.dept}>
                            <td><span style={{ color: d.color, fontWeight: 700, fontSize: '12px' }}>{d.dept}</span></td>
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{d.openings}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>{d.hires}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${fillRate}%`, height: '100%', background: fillRate >= 80 ? '#16a34a' : '#f59e0b', borderRadius: '3px' }} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{fillRate}%</span>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>{d.avgDays}d</td>
                            <td>USD {d.costPerHire.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                        <td>Totals / Avg</td>
                        <td style={{ textAlign: 'center' }}>{filteredDept.reduce((s, d) => s + d.openings, 0)}</td>
                        <td style={{ textAlign: 'center', color: '#16a34a' }}>{filteredDept.reduce((s, d) => s + d.hires, 0)}</td>
                        <td>{Math.round((filteredDept.reduce((s, d) => s + d.hires, 0) / Math.max(filteredDept.reduce((s, d) => s + d.openings, 0), 1)) * 100)}%</td>
                        <td style={{ textAlign: 'center' }}>{Math.round(filteredDept.reduce((s, d) => s + d.avgDays, 0) / Math.max(filteredDept.length, 1))}d avg</td>
                        <td>USD {Math.round(filteredDept.reduce((s, d) => s + d.costPerHire, 0) / Math.max(filteredDept.length, 1)).toLocaleString()} avg</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Recruiter Performance */}
            {reportTab === 'recruiter' && (
              <div>
                <div className="user-management__kpi-row" style={{ marginBottom: '16px' }}>
                  <div className="user-management__kpi"><strong>{RECRUITER_REPORT.reduce((s, r) => s + r.hiresMTD, 0)}</strong><span>Team Hires MTD</span></div>
                  <div className="user-management__kpi"><strong>{Math.round(RECRUITER_REPORT.reduce((s, r) => s + r.avgDays, 0) / RECRUITER_REPORT.length)}d</strong><span>Avg Time to Hire</span></div>
                  <div className="user-management__kpi"><strong>{Math.round(RECRUITER_REPORT.reduce((s, r) => s + r.oar, 0) / RECRUITER_REPORT.length)}%</strong><span>Avg Offer Acceptance</span></div>
                  <div className="user-management__kpi"><strong>{(RECRUITER_REPORT.reduce((s, r) => s + r.satisfactionScore, 0) / RECRUITER_REPORT.length).toFixed(1)}</strong><span>Avg Satisfaction Score</span></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {RECRUITER_REPORT.sort((a, b) => b.hiresMTD - a.hiresMTD).map((r, i) => (
                    <div key={r.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: ['#f59e0b', '#94a3b8', '#cd7c3a', '#475569'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px' }}>
                            {['🥇', '🥈', '🥉', '4'][i]}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px' }}>{r.name}</strong>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.openReqs} open requisitions</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{r.hiresMTD}</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>Hires MTD</div></div>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6' }}>{r.avgDays}d</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>Avg TtH</div></div>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#8b5cf6' }}>{r.oar}%</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>OAR</div></div>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b' }}>★ {r.satisfactionScore}</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>CSAT</div></div>
                        </div>
                      </div>
                      {/* Performance bars */}
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[['Hires', r.hiresMTD, 10, '#16a34a'], ['OAR', r.oar, 100, '#8b5cf6']].map(([label, val, max, color]) => (
                          <div key={label} style={{ flex: '1 1 120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '3px' }}><span>{label}</span><span style={{ fontWeight: 700, color: '#475569' }}>{val}{label === 'OAR' ? '%' : ''}</span></div>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min((val / max) * 100, 100)}%`, height: '100%', background: color, borderRadius: '3px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Conversion */}
            {reportTab === 'conversion' && (
              <div>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Stage-to-stage conversion rates across the full recruiting pipeline (YTD).</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONVERSION_DATA.map((c) => (
                    <div key={c.stage} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{c.stage}</span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: c.rate >= 70 ? '#16a34a' : c.rate >= 50 ? '#f59e0b' : '#dc2626' }}>{c.rate}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                        <div style={{ width: `${c.rate}%`, height: '100%', background: c.rate >= 70 ? '#16a34a' : c.rate >= 50 ? '#f59e0b' : '#dc2626', borderRadius: '4px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#475569' }}>
                  <strong>Overall Funnel:</strong> 1,240 applications → 38 hires — <strong style={{ color: '#3b82f6' }}>3.1% end-to-end conversion</strong>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Funnel Analytics ── */}
        {activeSection === 'funnel' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-filter" /> Funnel Analytics</h4>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {/* Funnel diagram */}
              <div style={{ flex: '1 1 280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h5 style={{ marginBottom: '14px' }}>Recruiting Pipeline Funnel</h5>
                {FUNNEL_STAGES.map((stage, i) => {
                  const widthPct = Math.round((stage.count / FUNNEL_STAGES[0].count) * 100);
                  const dropFrom = i > 0 ? FUNNEL_STAGES[i - 1].count : stage.count;
                  const dropped  = dropFrom - stage.count;
                  return (
                    <div key={stage.stage} style={{ marginBottom: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                        <span>{stage.stage}</span>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{stage.count.toLocaleString()}</span>
                      </div>
                      <div style={{ position: 'relative', height: '24px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '1px' }}>
                        <div style={{ position: 'absolute', left: `${(100 - widthPct) / 2}%`, width: `${widthPct}%`, height: '100%', background: `hsl(${220 - i * 14}, 70%, ${55 + i * 2}%)`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>{widthPct}%</span>
                        </div>
                      </div>
                      {i > 0 && dropped > 0 && (
                        <div style={{ fontSize: '9px', color: '#ef4444', textAlign: 'right', marginBottom: '3px' }}>▼ {dropped.toLocaleString()} dropped ({Math.round((dropped / dropFrom) * 100)}%)</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drop-off insights */}
              <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                  <h5 style={{ marginBottom: '12px' }}>Top Bottlenecks</h5>
                  {[
                    { stage: 'Application → Screened', loss: 620, pct: 50, note: 'High volume screened out — refine JD qualification criteria' },
                    { stage: 'Technical Test → Final',  loss: 85,  pct: 47, note: 'High drop at technical stage — review test difficulty calibration' },
                    { stage: 'Offer → Signed',           loss: 11,  pct: 21, note: 'Late-stage loss — accelerate decision timeline' },
                  ].map((b) => (
                    <div key={b.stage} style={{ marginBottom: '10px', padding: '8px 10px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '12px' }}>{b.stage}</strong>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>-{b.pct}%</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#92400e', margin: 0 }}>{b.note}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                  <h5 style={{ marginBottom: '10px' }}>Funnel KPIs</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    {[
                      ['Total Applicants', '1,240'],
                      ['Screened',         '620 (50%)'],
                      ['Interviewed',      '310 (25%)'],
                      ['Offers Made',      '52 (4.2%)'],
                      ['Offer Accepted',   '41 (3.3%)'],
                      ['Hired (Started)',  '38 (3.1%)'],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>{label}</span>
                        <strong style={{ color: '#1e293b' }}>{val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Predictive Analytics ── */}
        {activeSection === 'predictive' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-magic" /> Predictive Analytics</h4>
            <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '13px' }}>AI-powered predictions based on historical trends, pipeline velocity and external market signals.</p>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[['demand', 'fa-line-chart', 'Hiring Demand'], ['dropoff', 'fa-exclamation-triangle', 'Candidate Drop-off'], ['oar', 'fa-handshake-o', 'Offer Acceptance Probability']].map(([id, icon, label]) => (
                <button key={id} type="button"
                  className={`btn btn-sm ${predictTab === id ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPredictTab(id)}>
                  <i className={`fa ${icon}`} /> {label}
                </button>
              ))}
            </div>

            {/* Hiring Demand Forecast */}
            {predictTab === 'demand' && (
              <div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#1d4ed8', marginBottom: '16px' }}>
                  <i className="fa fa-info-circle" /> Predictions for next 12 months based on growth trajectory, budget approvals and product roadmap signals.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PREDICT_DEMAND.map((d) => (
                    <div key={d.dept} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '14px' }}>{d.dept}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}><i className="fa fa-lightbulb-o" /> {d.driver}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#94a3b8' }}>Current</div><div style={{ fontSize: '20px', fontWeight: 700, color: '#475569' }}>{d.current}</div></div>
                          <i className="fa fa-arrow-right" style={{ color: '#94a3b8', fontSize: '16px' }} />
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#94a3b8' }}>Predicted</div><div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6' }}>{d.predicted}</div></div>
                          <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '6px', padding: '3px 8px', fontSize: '13px', fontWeight: 800 }}>{d.growth}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>AI Confidence</span>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.confidence}%`, height: '100%', background: d.confidence >= 80 ? '#16a34a' : '#f59e0b', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{d.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Drop-off Risk */}
            {predictTab === 'dropoff' && (
              <div>
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#c2410c', marginBottom: '16px' }}>
                  <i className="fa fa-exclamation-triangle" /> Drop-off risk is computed from historical exit rates, time-in-stage delays and candidate engagement signals.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PREDICT_DROPOFF.map((d) => (
                    <div key={d.stage} style={{ background: '#fff', border: `1px solid ${RISK_COLOR[d.risk]}44`, borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '14px' }}>{d.stage}</strong>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ background: RISK_BG[d.risk], color: RISK_COLOR[d.risk], borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>{d.risk} Risk</span>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: RISK_COLOR[d.risk] }}>{d.pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${d.pct}%`, height: '100%', background: RISK_COLOR[d.risk], borderRadius: '4px' }} />
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', borderRadius: '6px', padding: '7px 10px' }}>
                        <i className="fa fa-wrench" style={{ color: '#3b82f6' }} /> <strong>Recommended action:</strong> {d.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offer Acceptance Probability */}
            {predictTab === 'oar' && (
              <div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#15803d', marginBottom: '16px' }}>
                  <i className="fa fa-magic" /> Probability scores are computed from salary competitiveness, process length, competing offer signals and candidate engagement patterns.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PREDICT_OAR.map((c) => {
                    const p = c.probability;
                    const color = p >= 85 ? '#16a34a' : p >= 70 ? '#f59e0b' : '#dc2626';
                    return (
                      <div key={c.candidate} style={{ background: '#fff', border: `1px solid ${color}44`, borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          <div>
                            <strong style={{ fontSize: '14px' }}>{c.candidate}</strong>
                            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>— {c.role}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(${color} ${p * 3.6}deg, #f1f5f9 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color }}>
                                {p}%
                              </div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Acceptance<br />Probability</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {c.factors.map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#475569' }}>
                              <i className={`fa ${f.startsWith('Competing') || f.includes('Long') || f.includes('needs') ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}
                                style={{ color: f.startsWith('Competing') || f.includes('Long') || f.includes('needs') ? '#f59e0b' : '#16a34a', marginTop: '1px', flexShrink: 0 }} />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseAnalytics;
