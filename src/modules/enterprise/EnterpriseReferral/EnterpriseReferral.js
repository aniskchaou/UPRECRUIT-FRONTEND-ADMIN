import React, { useState, useMemo } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Seed data ────────────────────────────────────────────────────────────────

const REFERRALS_SEED = [
  { id: 'ref-1', referrerId: 'emp-1', referrerName: 'Lucas Martin',   candidateName: 'Ethan Brooks',   candidateEmail: 'ethan@email.com',   role: 'Senior Frontend Engineer', status: 'Hired',       referralDate: '2026-04-10', bonusAmount: 2000, bonusStatus: 'Paid',     bonusPaidDate: '2026-06-01' },
  { id: 'ref-2', referrerId: 'emp-2', referrerName: 'Nina Johansson',  candidateName: 'Laura Petit',    candidateEmail: 'laura@email.com',   role: 'Data Analyst',             status: 'Interviewing', referralDate: '2026-05-20', bonusAmount: 1500, bonusStatus: 'Pending',  bonusPaidDate: null },
  { id: 'ref-3', referrerId: 'emp-1', referrerName: 'Lucas Martin',   candidateName: 'Marco Rossi',    candidateEmail: 'marco@email.com',   role: 'DevOps Specialist',        status: 'Applied',      referralDate: '2026-06-02', bonusAmount: 1800, bonusStatus: 'Pending',  bonusPaidDate: null },
  { id: 'ref-4', referrerId: 'emp-3', referrerName: 'Hassan Khalid',   candidateName: 'Yuna Park',      candidateEmail: 'yuna@email.com',    role: 'HR Business Partner',      status: 'Rejected',     referralDate: '2026-05-05', bonusAmount: 1200, bonusStatus: 'N/A',      bonusPaidDate: null },
  { id: 'ref-5', referrerId: 'emp-2', referrerName: 'Nina Johansson',  candidateName: 'Andre Dupont',   candidateEmail: 'andre@email.com',   role: 'Product Manager',          status: 'Hired',        referralDate: '2026-03-15', bonusAmount: 2500, bonusStatus: 'Approved', bonusPaidDate: null },
];

const BONUS_RULES_SEED = [
  { id: 'rule-1', role: 'Engineering',  level: 'Senior',  bonus: 2000, currency: 'USD', requireTenure: '90 days', active: true },
  { id: 'rule-2', role: 'Engineering',  level: 'Mid',     bonus: 1500, currency: 'USD', requireTenure: '90 days', active: true },
  { id: 'rule-3', role: 'Product',      level: 'Senior',  bonus: 2500, currency: 'USD', requireTenure: '90 days', active: true },
  { id: 'rule-4', role: 'Sales',        level: 'Any',     bonus: 1200, currency: 'USD', requireTenure: '60 days', active: true },
  { id: 'rule-5', role: 'HR',           level: 'Any',     bonus: 1000, currency: 'USD', requireTenure: '60 days', active: false },
];

const EMPLOYEES_SEED = [
  { id: 'emp-1', name: 'Lucas Martin',   department: 'Marketing',   email: 'lucas@abcgroup.io' },
  { id: 'emp-2', name: 'Nina Johansson', department: 'Engineering', email: 'nina@abctech.io' },
  { id: 'emp-3', name: 'Hassan Khalid',  department: 'Finance',     email: 'hassan@abcfinance.io' },
];

const OPEN_ROLES = ['Senior Frontend Engineer', 'Data Analyst', 'DevOps Specialist', 'HR Business Partner', 'Product Manager', 'Senior Backend Engineer', 'Data Scientist'];

const REFERRAL_STATUSES = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];
const BONUS_STATUSES = ['Pending', 'Approved', 'Paid', 'N/A'];

const STATUS_COLOR = {
  Hired: '#16a34a', Interviewing: '#3b82f6', Applied: '#94a3b8',
  Screening: '#8b5cf6', Offered: '#f59e0b', Rejected: '#dc2626',
};

const BONUS_COLOR = { Paid: '#16a34a', Approved: '#3b82f6', Pending: '#f59e0b', 'N/A': '#94a3b8' };

const SECTIONS = [
  { id: 'myReferrals', label: 'My Referrals',        icon: 'fa-users' },
  { id: 'refer',       label: 'Refer a Friend',      icon: 'fa-user-plus' },
  { id: 'rules',       label: 'Referral Rules',      icon: 'fa-gavel' },
  { id: 'bonuses',     label: 'Bonus Management',    icon: 'fa-money' },
  { id: 'analytics',   label: 'Referral Analytics',  icon: 'fa-bar-chart' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseReferral = () => {
  const [activeSection, setActiveSection] = useState('myReferrals');
  const [referrals, setReferrals] = useState(REFERRALS_SEED);
  const [bonusRules, setBonusRules] = useState(BONUS_RULES_SEED);
  const [actionMessage, setActionMessage] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [referForm, setReferForm] = useState({ referrerId: '', candidateName: '', candidateEmail: '', role: OPEN_ROLES[0], notes: '' });
  const [newRuleForm, setNewRuleForm] = useState({ role: '', level: 'Mid', bonus: '', currency: 'USD', requireTenure: '90 days' });

  const flash = (msg) => { setActionMessage(msg); setTimeout(() => setActionMessage(''), 3500); };

  // Referral handlers
  const handleSubmitReferral = (event) => {
    event.preventDefault();
    if (!referForm.referrerId || !referForm.candidateName.trim() || !referForm.candidateEmail.trim()) return;
    const referrer = EMPLOYEES_SEED.find((e) => e.id === referForm.referrerId);
    const matchingRule = bonusRules.find((r) => r.active && (referForm.role.toLowerCase().includes(r.role.toLowerCase()) || r.role === 'Any'));
    setReferrals((prev) => [...prev, {
      id: `ref-${Date.now()}`,
      referrerId: referForm.referrerId,
      referrerName: referrer?.name || '—',
      candidateName: referForm.candidateName,
      candidateEmail: referForm.candidateEmail,
      role: referForm.role,
      status: 'Applied',
      referralDate: new Date().toISOString().slice(0, 10),
      bonusAmount: matchingRule ? matchingRule.bonus : 1000,
      bonusStatus: 'Pending',
      bonusPaidDate: null,
    }]);
    setReferForm({ referrerId: '', candidateName: '', candidateEmail: '', role: OPEN_ROLES[0], notes: '' });
    flash('Referral submitted successfully.');
  };

  const handleUpdateCandidateStatus = (refId, status) => {
    setReferrals((prev) => prev.map((r) => {
      if (r.id !== refId) return r;
      const bonusStatus = status === 'Hired' ? 'Approved' : status === 'Rejected' ? 'N/A' : r.bonusStatus;
      return { ...r, status, bonusStatus };
    }));
    flash(`Referral status updated to "${status}".`);
  };

  // Bonus handlers
  const handleApproveBonusPayment = (refId) => {
    setReferrals((prev) => prev.map((r) => r.id === refId ? { ...r, bonusStatus: 'Approved' } : r));
    flash('Bonus approved for payment.');
  };

  const handleMarkBonusPaid = (refId) => {
    setReferrals((prev) => prev.map((r) => r.id === refId ? { ...r, bonusStatus: 'Paid', bonusPaidDate: new Date().toISOString().slice(0, 10) } : r));
    flash('Bonus marked as paid.');
  };

  // Rule handlers
  const handleAddRule = (event) => {
    event.preventDefault();
    if (!newRuleForm.role.trim() || !newRuleForm.bonus) return;
    setBonusRules((prev) => [...prev, { id: `rule-${Date.now()}`, ...newRuleForm, bonus: Number(newRuleForm.bonus), active: true }]);
    setNewRuleForm({ role: '', level: 'Mid', bonus: '', currency: 'USD', requireTenure: '90 days' });
    flash('Referral rule created.');
  };

  const handleToggleRule = (id) => {
    setBonusRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleDeleteRule = (id) => {
    setBonusRules((prev) => prev.filter((r) => r.id !== id));
    flash('Rule deleted.');
  };

  // Analytics
  const analytics = useMemo(() => {
    const total = referrals.length;
    const hired = referrals.filter((r) => r.status === 'Hired').length;
    const conversionRate = total > 0 ? Math.round((hired / total) * 100) : 0;
    const totalBonusPaid = referrals.filter((r) => r.bonusStatus === 'Paid').reduce((s, r) => s + r.bonusAmount, 0);
    const totalBonusPending = referrals.filter((r) => r.bonusStatus === 'Approved').reduce((s, r) => s + r.bonusAmount, 0);

    const leaderboard = EMPLOYEES_SEED.map((emp) => {
      const empRefs = referrals.filter((r) => r.referrerId === emp.id);
      return {
        ...emp,
        total: empRefs.length,
        hired: empRefs.filter((r) => r.status === 'Hired').length,
        earned: empRefs.filter((r) => r.bonusStatus === 'Paid').reduce((s, r) => s + r.bonusAmount, 0),
      };
    }).sort((a, b) => b.hired - a.hired || b.total - a.total);

    const byRole = OPEN_ROLES.map((role) => ({
      role,
      count: referrals.filter((r) => r.role === role).length,
      hired: referrals.filter((r) => r.role === role && r.status === 'Hired').length,
    })).filter((r) => r.count > 0);

    return { total, hired, conversionRate, totalBonusPaid, totalBonusPending, leaderboard, byRole };
  }, [referrals]);

  const filteredReferrals = useMemo(() => (
    filterEmployee === 'all' ? referrals : referrals.filter((r) => r.referrerId === filterEmployee)
  ), [referrals, filterEmployee]);

  return (
    <div className="user-management">
      {actionMessage && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{actionMessage}</div>}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-gift" /><span>Referral System</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="user-management__main">

        {/* ── My Referrals ── */}
        {activeSection === 'myReferrals' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-users" /> Referral Tracker</h4>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{referrals.length}</strong><span>Total Referrals</span></div>
              <div className="user-management__kpi"><strong>{referrals.filter((r) => r.status === 'Hired').length}</strong><span>Hired</span></div>
              <div className="user-management__kpi"><strong>{referrals.filter((r) => r.bonusStatus === 'Paid').length}</strong><span>Bonuses Paid</span></div>
              <div className="user-management__kpi"><strong>${referrals.filter((r) => r.bonusStatus === 'Paid').reduce((s, r) => s + r.bonusAmount, 0).toLocaleString()}</strong><span>Total Paid Out</span></div>
            </div>

            <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
              <button type="button" className={`btn btn-sm ${filterEmployee === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterEmployee('all')}>All</button>
              {EMPLOYEES_SEED.map((e) => (
                <button key={e.id} type="button" className={`btn btn-sm ${filterEmployee === e.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterEmployee(e.id)}>{e.name}</button>
              ))}
            </div>

            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead>
                  <tr><th>Referrer</th><th>Candidate</th><th>Role</th><th>Referred</th><th>Candidate Status</th><th>Bonus</th><th>Bonus Status</th><th>Update Status</th></tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((ref) => (
                    <tr key={ref.id}>
                      <td><strong>{ref.referrerName}</strong></td>
                      <td>{ref.candidateName}<br /><small style={{ color: '#64748b' }}>{ref.candidateEmail}</small></td>
                      <td style={{ fontSize: '12px' }}>{ref.role}</td>
                      <td style={{ fontSize: '12px' }}>{ref.referralDate}</td>
                      <td>
                        <span style={{ background: (STATUS_COLOR[ref.status] || '#94a3b8') + '22', color: STATUS_COLOR[ref.status] || '#94a3b8', border: `1px solid ${STATUS_COLOR[ref.status] || '#94a3b8'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#16a34a' }}>${ref.bonusAmount.toLocaleString()}</td>
                      <td>
                        <span style={{ background: (BONUS_COLOR[ref.bonusStatus] || '#94a3b8') + '22', color: BONUS_COLOR[ref.bonusStatus] || '#94a3b8', border: `1px solid ${BONUS_COLOR[ref.bonusStatus] || '#94a3b8'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                          {ref.bonusStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="fo-input"
                          value={ref.status}
                          onChange={(e) => handleUpdateCandidateStatus(ref.id, e.target.value)}
                          style={{ fontSize: '11px', padding: '2px 6px', width: 'auto' }}
                        >
                          {REFERRAL_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Refer a Friend ── */}
        {activeSection === 'refer' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-user-plus" /> Refer a Friend</h4>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Submit a referral for an open position. The system automatically assigns the matching bonus based on active referral rules.</p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '10px' }}>Referral Workflow</h5>
              <div style={{ display: 'flex', gap: '0', alignItems: 'center', flexWrap: 'wrap' }}>
                {['Employee Referral', 'Candidate Hired', 'Bonus Approved', 'Payment Released'].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <div style={{ background: '#3b82f6', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>{step}</div>
                    {i < arr.length - 1 && <div style={{ fontSize: '18px', color: '#94a3b8', padding: '0 6px' }}>→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="user-management__card-form">
              <h5>Submit Referral</h5>
              <form style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} onSubmit={handleSubmitReferral}>
                <select className="fo-input" value={referForm.referrerId} onChange={(e) => setReferForm((p) => ({ ...p, referrerId: e.target.value }))} required style={{ flex: '1 1 180px' }}>
                  <option value="">-- Referring Employee --</option>
                  {EMPLOYEES_SEED.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                </select>
                <input className="fo-input" placeholder="Candidate Full Name" value={referForm.candidateName} onChange={(e) => setReferForm((p) => ({ ...p, candidateName: e.target.value }))} required style={{ flex: '1 1 180px' }} />
                <input className="fo-input" type="email" placeholder="Candidate Email" value={referForm.candidateEmail} onChange={(e) => setReferForm((p) => ({ ...p, candidateEmail: e.target.value }))} required style={{ flex: '1 1 200px' }} />
                <select className="fo-input" value={referForm.role} onChange={(e) => setReferForm((p) => ({ ...p, role: e.target.value }))} style={{ flex: '2 1 220px' }}>
                  {OPEN_ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <textarea className="fo-input" placeholder="Notes (optional)" value={referForm.notes} onChange={(e) => setReferForm((p) => ({ ...p, notes: e.target.value }))} style={{ flex: '3 1 100%', minHeight: '60px', resize: 'vertical' }} />
                <button type="submit" className="btn btn-primary btn-sm"><i className="fa fa-user-plus" /> Submit Referral</button>
              </form>
            </div>
          </section>
        )}

        {/* ── Referral Rules ── */}
        {activeSection === 'rules' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-gavel" /> Referral Rules & Bonuses</h4>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Configure role-based referral bonuses. Bonuses are auto-assigned when a referral is submitted.</p>

            <div className="user-management__card-form">
              <h5>Add Referral Rule</h5>
              <form className="user-management__inline-form" onSubmit={handleAddRule}>
                <input className="fo-input" placeholder="Role / Function" value={newRuleForm.role} onChange={(e) => setNewRuleForm((p) => ({ ...p, role: e.target.value }))} required />
                <select className="fo-input" value={newRuleForm.level} onChange={(e) => setNewRuleForm((p) => ({ ...p, level: e.target.value }))}>
                  {['Junior', 'Mid', 'Senior', 'Lead', 'Any'].map((l) => <option key={l}>{l}</option>)}
                </select>
                <input className="fo-input" type="number" placeholder="Bonus Amount" value={newRuleForm.bonus} onChange={(e) => setNewRuleForm((p) => ({ ...p, bonus: e.target.value }))} />
                <select className="fo-input" value={newRuleForm.currency} onChange={(e) => setNewRuleForm((p) => ({ ...p, currency: e.target.value }))}>
                  {['USD', 'EUR', 'GBP'].map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="fo-input" placeholder="Tenure requirement" value={newRuleForm.requireTenure} onChange={(e) => setNewRuleForm((p) => ({ ...p, requireTenure: e.target.value }))} />
                <button type="submit" className="btn btn-primary btn-sm">Add Rule</button>
              </form>
            </div>

            <div className="user-management__table-wrapper" style={{ marginTop: '20px' }}>
              <table className="user-management__table">
                <thead>
                  <tr><th>Role</th><th>Level</th><th>Bonus</th><th>Tenure Required</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {bonusRules.map((rule) => (
                    <tr key={rule.id}>
                      <td><strong>{rule.role}</strong></td>
                      <td>{rule.level}</td>
                      <td style={{ fontWeight: 700, color: '#16a34a' }}>{rule.currency} {rule.bonus.toLocaleString()}</td>
                      <td style={{ fontSize: '12px' }}>{rule.requireTenure}</td>
                      <td>
                        <span className={`dashboard-pill ${rule.active ? 'dashboard-pill--success' : 'dashboard-pill--warning'}`}>{rule.active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleToggleRule(rule.id)}>{rule.active ? 'Disable' : 'Enable'}</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteRule(rule.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Bonus Management ── */}
        {activeSection === 'bonuses' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-money" /> Bonus Management</h4>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Approve and release bonus payments for successful referrals.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {referrals.filter((r) => r.bonusStatus !== 'N/A').map((ref) => (
                <div key={ref.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <strong>{ref.referrerName}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>referred</span>
                    <strong style={{ fontSize: '13px', marginLeft: '4px' }}>{ref.candidateName}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{ref.role}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>${ref.bonusAmount.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Bonus</div>
                  </div>
                  <div style={{ minWidth: '100px' }}>
                    <span style={{ background: (BONUS_COLOR[ref.bonusStatus] || '#94a3b8') + '22', color: BONUS_COLOR[ref.bonusStatus] || '#94a3b8', border: `1px solid ${BONUS_COLOR[ref.bonusStatus] || '#94a3b8'}`, borderRadius: '4px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>
                      {ref.bonusStatus}
                    </span>
                    {ref.bonusPaidDate && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>Paid: {ref.bonusPaidDate}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {ref.bonusStatus === 'Pending' && ref.status === 'Hired' && (
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleApproveBonusPayment(ref.id)}>Approve</button>
                    )}
                    {ref.bonusStatus === 'Approved' && (
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleMarkBonusPaid(ref.id)}>Mark Paid</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Referral Analytics ── */}
        {activeSection === 'analytics' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-bar-chart" /> Referral Analytics</h4>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{analytics.total}</strong><span>Total Referrals</span></div>
              <div className="user-management__kpi"><strong>{analytics.hired}</strong><span>Hires from Referrals</span></div>
              <div className="user-management__kpi"><strong>{analytics.conversionRate}%</strong><span>Conversion Rate</span></div>
              <div className="user-management__kpi"><strong>${analytics.totalBonusPaid.toLocaleString()}</strong><span>Bonuses Paid</span></div>
              <div className="user-management__kpi"><strong>${analytics.totalBonusPending.toLocaleString()}</strong><span>Bonuses Pending</span></div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 280px' }}>
                <h5>Referrer Leaderboard</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  {analytics.leaderboard.map((emp, i) => (
                    <div key={emp.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? '#fef3c7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: i === 0 ? '#b45309' : '#475569', flexShrink: 0 }}>
                        {i === 0 ? '🥇' : `#${i + 1}`}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '13px' }}>{emp.name}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.total} referred · {emp.hired} hired</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#16a34a' }}>${emp.earned.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: '1 1 260px' }}>
                <h5>Referrals by Role</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  {analytics.byRole.map((row) => (
                    <div key={row.role} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>{row.role}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{row.count} refs · {row.hired} hired</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.count > 0 ? Math.round((row.hired / row.count) * 100) : 0}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseReferral;
