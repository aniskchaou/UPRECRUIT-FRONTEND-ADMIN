import React, { useState, useMemo } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Seed data ────────────────────────────────────────────────────────────────

const INTERNAL_JOBS_SEED = [
  { id: 'ij-1', title: 'Senior Frontend Engineer',  department: 'Engineering',  location: 'London',  type: 'Full-time', level: 'Senior',   postedDate: '2026-06-01', deadline: '2026-07-01', openSlots: 2, status: 'Open',   managerEmail: 'alice@abctech.io' },
  { id: 'ij-2', title: 'Data Analyst',              department: 'Finance',      location: 'Remote',  type: 'Full-time', level: 'Mid',      postedDate: '2026-06-05', deadline: '2026-07-05', openSlots: 1, status: 'Open',   managerEmail: 'carol@abcfinance.io' },
  { id: 'ij-3', title: 'Product Manager',           department: 'Product',      location: 'Paris',   type: 'Full-time', level: 'Senior',   postedDate: '2026-05-20', deadline: '2026-06-25', openSlots: 1, status: 'Closed', managerEmail: 'james@abctech.io' },
  { id: 'ij-4', title: 'HR Business Partner',       department: 'HR',           location: 'Berlin',  type: 'Full-time', level: 'Mid',      postedDate: '2026-06-10', deadline: '2026-07-10', openSlots: 1, status: 'Open',   managerEmail: 'fatima@abcgroup.io' },
  { id: 'ij-5', title: 'DevOps Specialist',         department: 'Engineering',  location: 'Hybrid',  type: 'Full-time', level: 'Senior',   postedDate: '2026-06-12', deadline: '2026-07-12', openSlots: 2, status: 'Open',   managerEmail: 'alice@abctech.io' },
];

const EMPLOYEES_SEED = [
  { id: 'emp-1', name: 'Lucas Martin',   department: 'Marketing',   role: 'Marketing Executive',  manager: 'Sarah K.',   email: 'lucas@abcgroup.io' },
  { id: 'emp-2', name: 'Nina Johansson', department: 'Engineering', role: 'Junior Developer',     manager: 'Alice M.',   email: 'nina@abctech.io' },
  { id: 'emp-3', name: 'Hassan Khalid',  department: 'Finance',     role: 'Financial Analyst',    manager: 'Carol D.',   email: 'hassan@abcfinance.io' },
];

const APPLICATIONS_SEED = [
  { id: 'app-1', jobId: 'ij-1', employeeId: 'emp-2', employeeName: 'Nina Johansson', fromDept: 'Engineering',  coverNote: 'Excited to grow in a senior role.',  appliedDate: '2026-06-10', currentManagerApproval: 'Approved', newManagerApproval: 'Pending', status: 'Under Review' },
  { id: 'app-2', jobId: 'ij-2', employeeId: 'emp-1', employeeName: 'Lucas Martin',   fromDept: 'Marketing',   coverNote: 'Strong interest in analytics.',       appliedDate: '2026-06-11', currentManagerApproval: 'Pending',  newManagerApproval: 'Pending', status: 'Awaiting Current Manager' },
  { id: 'app-3', jobId: 'ij-5', employeeId: 'emp-3', employeeName: 'Hassan Khalid',  fromDept: 'Finance',     coverNote: 'Want to move into technical roles.',  appliedDate: '2026-06-13', currentManagerApproval: 'Approved', newManagerApproval: 'Approved', status: 'Transfer Approved' },
];

const SECTIONS = [
  { id: 'board',       label: 'Internal Job Board',    icon: 'fa-briefcase' },
  { id: 'apply',       label: 'Apply Internally',      icon: 'fa-paper-plane-o' },
  { id: 'applications', label: 'Transfer Applications', icon: 'fa-exchange' },
  { id: 'approvals',   label: 'Manager Approvals',     icon: 'fa-check-circle-o' },
];

const APPROVAL_ORDER = ['Awaiting Current Manager', 'Under Review', 'Transfer Approved', 'Rejected'];
const STATUS_COLOR = { 'Transfer Approved': '#16a34a', 'Rejected': '#dc2626', 'Under Review': '#3b82f6', 'Awaiting Current Manager': '#f59e0b' };

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseInternalMobility = () => {
  const [activeSection, setActiveSection] = useState('board');
  const [internalJobs, setInternalJobs] = useState(INTERNAL_JOBS_SEED);
  const [applications, setApplications] = useState(APPLICATIONS_SEED);
  const [actionMessage, setActionMessage] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newJobForm, setNewJobForm] = useState({ title: '', department: '', location: '', level: 'Mid', openSlots: 1, deadline: '' });
  const [applyForm, setApplyForm] = useState({ jobId: '', employeeId: '', coverNote: '' });

  const flash = (msg) => { setActionMessage(msg); setTimeout(() => setActionMessage(''), 3500); };

  const departments = useMemo(() => [...new Set(internalJobs.map((j) => j.department))], [internalJobs]);

  // Internal Job Board handlers
  const handlePostJob = (event) => {
    event.preventDefault();
    if (!newJobForm.title.trim()) return;
    setInternalJobs((prev) => [...prev, {
      id: `ij-${Date.now()}`,
      ...newJobForm,
      openSlots: Number(newJobForm.openSlots),
      type: 'Full-time',
      postedDate: new Date().toISOString().slice(0, 10),
      status: 'Open',
      managerEmail: 'hr@abcgroup.io',
    }]);
    setNewJobForm({ title: '', department: '', location: '', level: 'Mid', openSlots: 1, deadline: '' });
    flash('Internal job posted.');
  };

  const handleCloseJob = (id) => {
    setInternalJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: 'Closed' } : j));
    flash('Job closed.');
  };

  // Internal Application handlers
  const handleApply = (event) => {
    event.preventDefault();
    if (!applyForm.jobId || !applyForm.employeeId) return;
    const employee = EMPLOYEES_SEED.find((e) => e.id === applyForm.employeeId);
    const job = internalJobs.find((j) => j.id === applyForm.jobId);
    if (!employee || !job) return;
    setApplications((prev) => [...prev, {
      id: `app-${Date.now()}`,
      jobId: applyForm.jobId,
      employeeId: applyForm.employeeId,
      employeeName: employee.name,
      fromDept: employee.department,
      coverNote: applyForm.coverNote,
      appliedDate: new Date().toISOString().slice(0, 10),
      currentManagerApproval: 'Pending',
      newManagerApproval: 'Pending',
      status: 'Awaiting Current Manager',
    }]);
    setApplyForm({ jobId: '', employeeId: '', coverNote: '' });
    flash(`${employee.name} applied to "${job.title}".`);
  };

  // Approval workflow handlers
  const handleCurrentManagerDecision = (appId, decision) => {
    setApplications((prev) => prev.map((a) => {
      if (a.id !== appId) return a;
      const nextStatus = decision === 'Approved' ? 'Under Review' : 'Rejected';
      return { ...a, currentManagerApproval: decision, status: nextStatus };
    }));
    flash(`Current manager decision recorded: ${decision}.`);
  };

  const handleNewManagerDecision = (appId, decision) => {
    setApplications((prev) => prev.map((a) => {
      if (a.id !== appId) return a;
      const nextStatus = decision === 'Approved' ? 'Transfer Approved' : 'Rejected';
      return { ...a, newManagerApproval: decision, status: nextStatus };
    }));
    flash(`New manager decision recorded: ${decision}.`);
  };

  const filteredJobs = useMemo(() => {
    return internalJobs.filter((j) => (filterDept === 'all' || j.department === filterDept) && j.status === 'Open');
  }, [internalJobs, filterDept]);

  const filteredApplications = useMemo(() => {
    return applications.filter((a) => filterStatus === 'all' || a.status === filterStatus);
  }, [applications, filterStatus]);

  const transferApproved = applications.filter((a) => a.status === 'Transfer Approved').length;
  const pendingApprovals = applications.filter((a) => a.currentManagerApproval === 'Pending' || (a.currentManagerApproval === 'Approved' && a.newManagerApproval === 'Pending')).length;

  return (
    <div className="user-management">
      {actionMessage && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{actionMessage}</div>}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-exchange" /><span>Internal Mobility</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="user-management__main">

        {/* ── Internal Job Board ── */}
        {activeSection === 'board' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-briefcase" /> Internal Job Board</h4>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{internalJobs.filter((j) => j.status === 'Open').length}</strong><span>Open Positions</span></div>
              <div className="user-management__kpi"><strong>{applications.length}</strong><span>Total Applications</span></div>
              <div className="user-management__kpi"><strong>{transferApproved}</strong><span>Transfers Approved</span></div>
              <div className="user-management__kpi"><strong>{pendingApprovals}</strong><span>Pending Approvals</span></div>
            </div>

            <div className="user-management__card-form" style={{ marginTop: '20px' }}>
              <h5>Post Internal Job</h5>
              <form style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} onSubmit={handlePostJob}>
                <input className="fo-input" placeholder="Job Title" value={newJobForm.title} onChange={(e) => setNewJobForm((p) => ({ ...p, title: e.target.value }))} required style={{ flex: '2 1 200px' }} />
                <input className="fo-input" placeholder="Department" value={newJobForm.department} onChange={(e) => setNewJobForm((p) => ({ ...p, department: e.target.value }))} style={{ flex: '1 1 130px' }} />
                <input className="fo-input" placeholder="Location" value={newJobForm.location} onChange={(e) => setNewJobForm((p) => ({ ...p, location: e.target.value }))} style={{ flex: '1 1 110px' }} />
                <select className="fo-input" value={newJobForm.level} onChange={(e) => setNewJobForm((p) => ({ ...p, level: e.target.value }))} style={{ flex: '1 1 100px' }}>
                  {['Junior', 'Mid', 'Senior', 'Lead', 'Manager'].map((l) => <option key={l}>{l}</option>)}
                </select>
                <input className="fo-input" type="number" min="1" placeholder="Slots" value={newJobForm.openSlots} onChange={(e) => setNewJobForm((p) => ({ ...p, openSlots: e.target.value }))} style={{ flex: '0 1 80px' }} />
                <input className="fo-input" type="date" value={newJobForm.deadline} onChange={(e) => setNewJobForm((p) => ({ ...p, deadline: e.target.value }))} style={{ flex: '1 1 140px' }} />
                <button type="submit" className="btn btn-primary btn-sm">Post Job</button>
              </form>
            </div>

            <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Filter by department:</span>
              <button type="button" className={`btn btn-sm ${filterDept === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterDept('all')}>All</button>
              {departments.map((d) => (
                <button key={d} type="button" className={`btn btn-sm ${filterDept === d ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterDept(d)}>{d}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              {filteredJobs.map((job) => (
                <div key={job.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', flex: '1 1 280px', minWidth: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '14px' }}>{job.title}</strong>
                    <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '10px' }}>{job.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', margin: '6px 0' }}>
                    {job.department} · {job.location} · {job.level}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <i className="fa fa-users" /> {job.openSlots} slot{job.openSlots !== 1 ? 's' : ''} &nbsp;·&nbsp;
                    <i className="fa fa-calendar" /> Deadline: {job.deadline || '—'}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setApplyForm((p) => ({ ...p, jobId: job.id })); setActiveSection('apply'); }}>
                      Apply
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleCloseJob(job.id)}>Close</button>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && <p style={{ color: '#94a3b8', fontSize: '13px' }}>No open internal positions match this filter.</p>}
            </div>
          </section>
        )}

        {/* ── Apply Internally ── */}
        {activeSection === 'apply' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-paper-plane-o" /> Apply Internally</h4>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Employees can apply to internal vacancies. The application enters the manager approval workflow automatically.</p>

            <div className="user-management__card-form">
              <h5>Submit Internal Application</h5>
              <form style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} onSubmit={handleApply}>
                <select className="fo-input" value={applyForm.employeeId} onChange={(e) => setApplyForm((p) => ({ ...p, employeeId: e.target.value }))} required style={{ flex: '1 1 200px' }}>
                  <option value="">-- Select Employee --</option>
                  {EMPLOYEES_SEED.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                </select>
                <select className="fo-input" value={applyForm.jobId} onChange={(e) => setApplyForm((p) => ({ ...p, jobId: e.target.value }))} required style={{ flex: '2 1 240px' }}>
                  <option value="">-- Select Internal Job --</option>
                  {internalJobs.filter((j) => j.status === 'Open').map((j) => <option key={j.id} value={j.id}>{j.title} — {j.department}</option>)}
                </select>
                <textarea className="fo-input" placeholder="Cover note (optional)" value={applyForm.coverNote} onChange={(e) => setApplyForm((p) => ({ ...p, coverNote: e.target.value }))} style={{ flex: '3 1 100%', minHeight: '70px', resize: 'vertical' }} />
                <button type="submit" className="btn btn-primary btn-sm">Submit Application</button>
              </form>
            </div>

            <div style={{ marginTop: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ marginBottom: '12px' }}>Approval Workflow</h5>
              <div style={{ display: 'flex', gap: '0', alignItems: 'center', flexWrap: 'wrap' }}>
                {['Employee Applies', 'Current Manager Approval', 'New Manager Approval', 'Transfer'].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <div style={{ background: '#3b82f6', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>{step}</div>
                    {i < arr.length - 1 && <div style={{ fontSize: '18px', color: '#94a3b8', padding: '0 6px' }}>→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Transfer Applications ── */}
        {activeSection === 'applications' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-exchange" /> Transfer Applications</h4>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button type="button" className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterStatus('all')}>All ({applications.length})</button>
              {APPROVAL_ORDER.map((s) => (
                <button key={s} type="button" className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline-secondary'}`} style={{ borderLeftColor: STATUS_COLOR[s], borderLeftWidth: '3px' }} onClick={() => setFilterStatus(s)}>
                  {s} ({applications.filter((a) => a.status === s).length})
                </button>
              ))}
            </div>

            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead>
                  <tr><th>Employee</th><th>From Dept</th><th>Applying For</th><th>Cover Note</th><th>Applied</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const job = internalJobs.find((j) => j.id === app.jobId);
                    return (
                      <tr key={app.id}>
                        <td><strong>{app.employeeName}</strong></td>
                        <td style={{ fontSize: '12px' }}>{app.fromDept}</td>
                        <td style={{ fontSize: '12px' }}>{job?.title || '—'}<br /><span style={{ color: '#64748b' }}>{job?.department}</span></td>
                        <td style={{ fontSize: '11px', color: '#64748b', maxWidth: '200px' }}>{app.coverNote || '—'}</td>
                        <td style={{ fontSize: '12px' }}>{app.appliedDate}</td>
                        <td><span style={{ background: (STATUS_COLOR[app.status] || '#94a3b8') + '22', color: STATUS_COLOR[app.status] || '#94a3b8', border: `1px solid ${STATUS_COLOR[app.status] || '#94a3b8'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{app.status}</span></td>
                      </tr>
                    );
                  })}
                  {filteredApplications.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No applications match this filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Manager Approvals ── */}
        {activeSection === 'approvals' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-check-circle-o" /> Manager Approvals</h4>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Process approval steps for each transfer application.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {applications.map((app) => {
                const job = internalJobs.find((j) => j.id === app.jobId);
                return (
                  <div key={app.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong>{app.employeeName}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>{app.fromDept} → {job?.department || '?'}</span>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Position: <strong>{job?.title}</strong></div>
                      </div>
                      <span style={{ background: (STATUS_COLOR[app.status] || '#94a3b8') + '22', color: STATUS_COLOR[app.status] || '#94a3b8', border: `1px solid ${STATUS_COLOR[app.status] || '#94a3b8'}`, borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{app.status}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
                      {/* Step 1 */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>STEP 1 — CURRENT MANAGER</div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '12px', color: app.currentManagerApproval === 'Approved' ? '#16a34a' : app.currentManagerApproval === 'Rejected' ? '#dc2626' : '#f59e0b' }}>
                            {app.currentManagerApproval}
                          </span>
                          {app.currentManagerApproval === 'Pending' && (
                            <>
                              <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleCurrentManagerDecision(app.id, 'Approved')}>Approve</button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleCurrentManagerDecision(app.id, 'Rejected')}>Reject</button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>STEP 2 — NEW MANAGER</div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '12px', color: app.newManagerApproval === 'Approved' ? '#16a34a' : app.newManagerApproval === 'Rejected' ? '#dc2626' : '#f59e0b' }}>
                            {app.newManagerApproval}
                          </span>
                          {app.currentManagerApproval === 'Approved' && app.newManagerApproval === 'Pending' && (
                            <>
                              <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleNewManagerDecision(app.id, 'Approved')}>Approve Transfer</button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleNewManagerDecision(app.id, 'Rejected')}>Reject</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseInternalMobility;
