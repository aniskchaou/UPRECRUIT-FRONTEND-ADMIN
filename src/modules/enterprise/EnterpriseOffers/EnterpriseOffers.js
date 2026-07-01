import React, { useState } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Seeds ────────────────────────────────────────────────────────────────────

const CANDIDATES_SEED = [
  { id: 'c1', name: 'Sophia Lee',   role: 'Senior Engineer' },
  { id: 'c2', name: 'Tom Fischer',  role: 'Sales Manager' },
  { id: 'c3', name: 'Aisha Patel',  role: 'Marketing Lead' },
  { id: 'c4', name: 'Luis Gomez',   role: 'Data Analyst' },
];

const TEMPLATES_SEED = [
  { id: 't1', name: 'Engineering Offer',  baseSalary: 95000, currency: 'USD', bonus: 10, equity: '0.05%', benefits: ['Health Insurance', 'Dental & Vision', '401k (4% match)', 'Remote Work'] },
  { id: 't2', name: 'Sales Offer',        baseSalary: 75000, currency: 'USD', bonus: 20, equity: '',       benefits: ['Health Insurance', 'Commission Plan', 'Car Allowance'] },
  { id: 't3', name: 'Executive Offer',    baseSalary: 180000, currency: 'USD', bonus: 30, equity: '0.2%', benefits: ['Health Insurance', 'Dental & Vision', '401k (6% match)', 'Remote Work', 'Company Car', 'Annual Bonus Pool'] },
];

const BENCHMARK_SEED = {
  'Senior Engineer':  { p25: 85000, p50: 95000, p75: 110000, currency: 'USD' },
  'Sales Manager':    { p25: 65000, p50: 75000, p75: 90000,  currency: 'USD' },
  'Marketing Lead':   { p25: 60000, p50: 72000, p75: 85000,  currency: 'USD' },
  'Data Analyst':     { p25: 55000, p50: 65000, p75: 80000,  currency: 'USD' },
};

const APPROVAL_STAGES = ['HR Approval', 'Finance Approval', 'Executive Approval'];

const buildOffers = () => [
  { id: 'o1', candidateId: 'c1', candidateName: 'Sophia Lee',  role: 'Senior Engineer', baseSalary: 97000, bonus: 10, equity: '0.05%', currency: 'USD', benefits: ['Health Insurance', 'Remote Work', '401k (4% match)'], status: 'Pending HR', approvals: { 'HR Approval': null, 'Finance Approval': null, 'Executive Approval': null }, sentAt: null, signedAt: null, expiresAt: '2026-07-05', eSignature: '' },
  { id: 'o2', candidateId: 'c3', candidateName: 'Aisha Patel', role: 'Marketing Lead',  baseSalary: 73000, bonus: 12, equity: '',      currency: 'USD', benefits: ['Health Insurance'], status: 'Approved',  approvals: { 'HR Approval': 'approved', 'Finance Approval': 'approved', 'Executive Approval': 'approved' }, sentAt: '2026-06-15', signedAt: null, expiresAt: '2026-07-01', eSignature: '' },
  { id: 'o3', candidateId: 'c2', candidateName: 'Tom Fischer', role: 'Sales Manager',   baseSalary: 78000, bonus: 20, equity: '',      currency: 'USD', benefits: ['Health Insurance', 'Commission Plan'], status: 'Signed',    approvals: { 'HR Approval': 'approved', 'Finance Approval': 'approved', 'Executive Approval': 'approved' }, sentAt: '2026-06-12', signedAt: '2026-06-17', expiresAt: '2026-07-01', eSignature: 'Tom Fischer' },
];

const STATUS_FLOW = ['Draft', 'Pending HR', 'Pending Finance', 'Pending Executive', 'Approved', 'Sent to Candidate', 'Signed', 'Declined', 'Withdrawn'];
const STATUS_COLOR = { Draft: '#94a3b8', 'Pending HR': '#f59e0b', 'Pending Finance': '#f59e0b', 'Pending Executive': '#f59e0b', Approved: '#3b82f6', 'Sent to Candidate': '#8b5cf6', Signed: '#16a34a', Declined: '#dc2626', Withdrawn: '#dc2626' };

const SECTIONS = [
  { id: 'offers',     label: 'Offer Tracker',     icon: 'fa-file-text' },
  { id: 'create',     label: 'Create Offer',       icon: 'fa-plus-circle' },
  { id: 'templates',  label: 'Offer Templates',    icon: 'fa-copy' },
  { id: 'benchmark',  label: 'Salary Benchmark',   icon: 'fa-bar-chart' },
  { id: 'approvals',  label: 'Approvals',          icon: 'fa-thumbs-up' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseOffers = () => {
  const [activeSection, setActiveSection] = useState('offers');
  const [offers, setOffers]       = useState(buildOffers);
  const [templates, setTemplates] = useState(TEMPLATES_SEED);
  const [actionMessage, setActionMessage] = useState('');

  // Create form
  const [form, setForm] = useState({
    candidateId: 'c1',
    templateId: 't1',
    baseSalary: '',
    bonus: '',
    equity: '',
    currency: 'USD',
    benefits: '',
    expiresAt: '',
  });

  // Template form
  const [tplForm, setTplForm] = useState({ name: '', baseSalary: '', currency: 'USD', bonus: '', equity: '', benefits: '' });

  // E-signature modal
  const [sigModal, setSigModal] = useState(null); // offer id
  const [sigInput, setSigInput] = useState('');

  const flash = (msg) => { setActionMessage(msg); setTimeout(() => setActionMessage(''), 3500); };

  const handleCreate = (e) => {
    e.preventDefault();
    const cand = CANDIDATES_SEED.find((c) => c.id === form.candidateId);
    const newOffer = {
      id: `o-${Date.now()}`,
      candidateId: form.candidateId,
      candidateName: cand.name,
      role: cand.role,
      baseSalary: Number(form.baseSalary),
      bonus: Number(form.bonus),
      equity: form.equity,
      currency: form.currency,
      benefits: form.benefits ? form.benefits.split(',').map((b) => b.trim()) : [],
      status: 'Pending HR',
      approvals: { 'HR Approval': null, 'Finance Approval': null, 'Executive Approval': null },
      sentAt: null,
      signedAt: null,
      expiresAt: form.expiresAt,
      eSignature: '',
    };
    setOffers((prev) => [...prev, newOffer]);
    flash(`Offer created for ${cand.name} — now pending HR approval.`);
    setForm({ candidateId: 'c1', templateId: 't1', baseSalary: '', bonus: '', equity: '', currency: 'USD', benefits: '', expiresAt: '' });
    setActiveSection('approvals');
  };

  const applyTemplate = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setForm((p) => ({ ...p, baseSalary: tpl.baseSalary, bonus: tpl.bonus, equity: tpl.equity, currency: tpl.currency, benefits: tpl.benefits.join(', ') }));
  };

  const handleApprove = (offerId, stage) => {
    setOffers((prev) => prev.map((o) => {
      if (o.id !== offerId) return o;
      const newApprovals = { ...o.approvals, [stage]: 'approved' };
      const allApproved = APPROVAL_STAGES.every((s) => newApprovals[s] === 'approved');
      return { ...o, approvals: newApprovals, status: allApproved ? 'Approved' : o.status };
    }));
    flash(`${stage} approved.`);
  };

  const handleReject = (offerId, stage) => {
    setOffers((prev) => prev.map((o) => o.id !== offerId ? o : { ...o, approvals: { ...o.approvals, [stage]: 'rejected' }, status: 'Withdrawn' }));
    flash(`${stage} rejected — offer withdrawn.`);
  };

  const sendToCandidate = (offerId) => {
    setOffers((prev) => prev.map((o) => o.id !== offerId ? o : { ...o, status: 'Sent to Candidate', sentAt: new Date().toISOString().slice(0, 10) }));
    flash('Offer sent to candidate with e-signature request.');
  };

  const handleSign = (offerId) => {
    if (!sigInput.trim()) { flash('Please type your full name to sign.'); return; }
    setOffers((prev) => prev.map((o) => o.id !== offerId ? o : { ...o, status: 'Signed', signedAt: new Date().toISOString().slice(0, 10), eSignature: sigInput }));
    setSigModal(null);
    setSigInput('');
    flash('Offer signed successfully!');
  };

  const addTemplate = (e) => {
    e.preventDefault();
    setTemplates((prev) => [...prev, { id: `tpl-${Date.now()}`, name: tplForm.name, baseSalary: Number(tplForm.baseSalary), currency: tplForm.currency, bonus: Number(tplForm.bonus), equity: tplForm.equity, benefits: tplForm.benefits ? tplForm.benefits.split(',').map((b) => b.trim()) : [] }]);
    setTplForm({ name: '', baseSalary: '', currency: 'USD', bonus: '', equity: '', benefits: '' });
    flash('Template added.');
  };

  const pendingApprovals = offers.filter((o) => ['Pending HR', 'Pending Finance', 'Pending Executive'].includes(o.status) || APPROVAL_STAGES.some((s) => o.approvals[s] === null && o.status !== 'Withdrawn'));

  return (
    <div className="user-management">
      {actionMessage && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{actionMessage}</div>}

      {/* E-signature modal */}
      {sigModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h5 style={{ marginBottom: '8px' }}><i className="fa fa-pencil" /> E-Signature</h5>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Type your full legal name below to electronically sign and accept the offer.</p>
            <input className="fo-input" placeholder="Full legal name" value={sigInput} onChange={(e) => setSigInput(e.target.value)} style={{ marginBottom: '16px', width: '100%', fontFamily: 'cursive', fontSize: '18px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-success" onClick={() => handleSign(sigModal)}><i className="fa fa-check" /> Sign Offer</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => { setSigModal(null); setSigInput(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-file-text" /><span>Offer Management</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="user-management__main">

        {/* ── Offer Tracker ── */}
        {activeSection === 'offers' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-list" /> Offer Tracker</h4>

            {/* Pipeline visualiser */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '12px' }}>
              {['Recruiter', 'HR Approval', 'Finance Approval', 'Executive Approval', 'Candidate'].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', fontWeight: 600, color: '#475569' }}>{step}</span>
                  {i < arr.length - 1 && <i className="fa fa-arrow-right" style={{ color: '#cbd5e1', fontSize: '10px' }} />}
                </React.Fragment>
              ))}
            </div>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{offers.length}</strong><span>Total Offers</span></div>
              <div className="user-management__kpi"><strong>{offers.filter((o) => o.status === 'Approved' || o.status === 'Sent to Candidate').length}</strong><span>Approved</span></div>
              <div className="user-management__kpi"><strong>{offers.filter((o) => o.status === 'Signed').length}</strong><span>Signed</span></div>
              <div className="user-management__kpi"><strong>{offers.filter((o) => o.status === 'Withdrawn' || o.status === 'Declined').length}</strong><span>Declined / Withdrawn</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '14px 0' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveSection('create')}><i className="fa fa-plus" /> New Offer</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...offers].reverse().map((o) => (
                <div key={o.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{o.candidateName}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>— {o.role}</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{o.currency} {o.baseSalary.toLocaleString()}</span>
                        {o.bonus > 0 && <span style={{ color: '#16a34a' }}>+{o.bonus}% bonus</span>}
                        {o.equity && <span style={{ color: '#8b5cf6' }}>+{o.equity} equity</span>}
                        <span style={{ color: '#94a3b8' }}>Expires {o.expiresAt}</span>
                      </div>
                      {o.signedAt && <div style={{ marginTop: '4px', fontSize: '11px', color: '#16a34a', fontStyle: 'italic' }}><i className="fa fa-check-circle" /> Signed by "{o.eSignature}" on {o.signedAt}</div>}
                    </div>
                    <span style={{ background: (STATUS_COLOR[o.status] || '#94a3b8') + '22', color: STATUS_COLOR[o.status] || '#94a3b8', border: `1px solid ${STATUS_COLOR[o.status] || '#94a3b8'}55`, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, alignSelf: 'flex-start' }}>{o.status}</span>
                  </div>

                  {/* Approval mini-pipeline */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {APPROVAL_STAGES.map((stage) => (
                      <span key={stage} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: o.approvals[stage] === 'approved' ? '#d1fae5' : o.approvals[stage] === 'rejected' ? '#fee2e2' : '#f1f5f9', color: o.approvals[stage] === 'approved' ? '#065f46' : o.approvals[stage] === 'rejected' ? '#991b1b' : '#64748b', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>
                        <i className={`fa ${o.approvals[stage] === 'approved' ? 'fa-check-circle' : o.approvals[stage] === 'rejected' ? 'fa-times-circle' : 'fa-clock-o'}`} />
                        {stage.replace(' Approval', '')}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {o.status === 'Approved' && <button type="button" className="btn btn-primary btn-sm" onClick={() => sendToCandidate(o.id)}><i className="fa fa-send" /> Send to Candidate</button>}
                    {o.status === 'Sent to Candidate' && <button type="button" className="btn btn-success btn-sm" onClick={() => setSigModal(o.id)}><i className="fa fa-pencil" /> Sign Offer</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Create Offer ── */}
        {activeSection === 'create' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-plus-circle" /> Create New Offer</h4>
            <div className="user-management__card-form">
              <div style={{ marginBottom: '12px' }}>
                <label className="fo-label">Load from Template</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {templates.map((t) => (
                    <button key={t.id} type="button" className="btn btn-outline-secondary btn-sm" onClick={() => applyTemplate(t.id)}>
                      <i className="fa fa-copy" /> {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} onSubmit={handleCreate}>
                <div>
                  <label className="fo-label">Candidate</label>
                  <select className="fo-input" value={form.candidateId} onChange={(e) => setForm((p) => ({ ...p, candidateId: e.target.value }))}>
                    {CANDIDATES_SEED.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fo-label">Currency</label>
                  <select className="fo-input" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fo-label">Base Salary</label>
                  <input className="fo-input" type="number" required placeholder="e.g. 95000" value={form.baseSalary} onChange={(e) => setForm((p) => ({ ...p, baseSalary: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Bonus (%)</label>
                  <input className="fo-input" type="number" placeholder="e.g. 15" value={form.bonus} onChange={(e) => setForm((p) => ({ ...p, bonus: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Equity / Options</label>
                  <input className="fo-input" placeholder="e.g. 0.05%" value={form.equity} onChange={(e) => setForm((p) => ({ ...p, equity: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Offer Expiry Date</label>
                  <input className="fo-input" type="date" required value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="fo-label">Benefits (comma-separated)</label>
                  <input className="fo-input" placeholder="Health Insurance, Remote Work, 401k…" value={form.benefits} onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn btn-primary"><i className="fa fa-paper-plane" /> Submit for Approval</button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ── Offer Templates ── */}
        {activeSection === 'templates' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-copy" /> Offer Templates</h4>

            <div className="user-management__card-form" style={{ marginBottom: '24px' }}>
              <h5>Add Template</h5>
              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} onSubmit={addTemplate}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="fo-label">Template Name</label>
                  <input className="fo-input" required placeholder="e.g. Junior Developer Offer" value={tplForm.name} onChange={(e) => setTplForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Base Salary</label>
                  <input className="fo-input" type="number" required placeholder="e.g. 60000" value={tplForm.baseSalary} onChange={(e) => setTplForm((p) => ({ ...p, baseSalary: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Currency</label>
                  <select className="fo-input" value={tplForm.currency} onChange={(e) => setTplForm((p) => ({ ...p, currency: e.target.value }))}>
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fo-label">Bonus (%)</label>
                  <input className="fo-input" type="number" placeholder="0" value={tplForm.bonus} onChange={(e) => setTplForm((p) => ({ ...p, bonus: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Equity</label>
                  <input className="fo-input" placeholder="e.g. 0.01%" value={tplForm.equity} onChange={(e) => setTplForm((p) => ({ ...p, equity: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="fo-label">Benefits (comma-separated)</label>
                  <input className="fo-input" placeholder="Health Insurance, Remote Work…" value={tplForm.benefits} onChange={(e) => setTplForm((p) => ({ ...p, benefits: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn btn-primary btn-sm"><i className="fa fa-plus" /> Add Template</button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {templates.map((tpl) => (
                <div key={tpl.id} style={{ flex: '1 1 260px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', color: '#1e293b' }}><i className="fa fa-copy" style={{ color: '#3b82f6' }} /> {tpl.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{tpl.currency} {tpl.baseSalary.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    {tpl.bonus > 0 && <span style={{ marginRight: '8px', color: '#16a34a' }}>+{tpl.bonus}% bonus</span>}
                    {tpl.equity && <span style={{ color: '#8b5cf6' }}>+{tpl.equity} equity</span>}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {tpl.benefits.map((b) => <span key={b} style={{ background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '1px 7px', fontSize: '10px' }}>{b}</span>)}
                  </div>
                  <button type="button" className="btn btn-outline-primary btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => { applyTemplate(tpl.id); setActiveSection('create'); }}>
                    Use This Template
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Salary Benchmark ── */}
        {activeSection === 'benchmark' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-bar-chart" /> Salary Benchmarking</h4>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Market salary data by role. Use percentile bands to set competitive offers.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(BENCHMARK_SEED).map(([role, data]) => {
                const relatedOffer = offers.find((o) => o.role === role && o.status !== 'Withdrawn');
                const offerSalary = relatedOffer?.baseSalary;
                const inBand = offerSalary ? offerSalary >= data.p25 && offerSalary <= data.p75 : null;
                const pct = offerSalary ? Math.min(100, Math.max(0, Math.round(((offerSalary - data.p25) / (data.p75 - data.p25)) * 100))) : null;

                return (
                  <div key={role} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '14px' }}>{role}</strong>
                      {offerSalary && (
                        <span style={{ background: inBand ? '#d1fae5' : '#fee2e2', color: inBand ? '#065f46' : '#991b1b', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
                          {inBand ? '✓ In market band' : '⚠ Outside band'} — Offer: {data.currency} {offerSalary.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '12px' }}>
                      <div><span style={{ color: '#94a3b8' }}>25th</span><br /><strong>{data.currency} {data.p25.toLocaleString()}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Median</span><br /><strong style={{ color: '#3b82f6' }}>{data.currency} {data.p50.toLocaleString()}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>75th</span><br /><strong>{data.currency} {data.p75.toLocaleString()}</strong></div>
                    </div>
                    <div style={{ position: 'relative', height: '12px', background: 'linear-gradient(to right, #fee2e2, #fef3c7, #d1fae5)', borderRadius: '6px', overflow: 'hidden' }}>
                      {pct !== null && (
                        <div style={{ position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: '3px', background: '#1e293b', borderRadius: '2px' }} title={`Offer: ${data.currency} ${offerSalary?.toLocaleString()}`} />
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                      <span>Below Market</span><span>At Market</span><span>Above Market</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Approvals ── */}
        {activeSection === 'approvals' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-thumbs-up" /> Offer Approvals</h4>

            {offers.filter((o) => o.status !== 'Signed' && o.status !== 'Withdrawn' && o.status !== 'Declined').length === 0 && (
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>No offers awaiting approval.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {offers.filter((o) => o.status !== 'Signed' && o.status !== 'Withdrawn' && o.status !== 'Declined').map((o) => (
                <div key={o.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <strong>{o.candidateName}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>— {o.role}</span>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{o.currency} {o.baseSalary.toLocaleString()} {o.bonus > 0 && <span style={{ color: '#16a34a', fontSize: '12px' }}>+{o.bonus}% bonus</span>}</div>
                    </div>
                    <span style={{ background: (STATUS_COLOR[o.status] || '#94a3b8') + '22', color: STATUS_COLOR[o.status] || '#94a3b8', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{o.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {APPROVAL_STAGES.map((stage) => (
                      <div key={stage} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{stage}</span>
                        {o.approvals[stage] === 'approved' && <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '12px' }}><i className="fa fa-check-circle" /> Approved</span>}
                        {o.approvals[stage] === 'rejected' && <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '12px' }}><i className="fa fa-times-circle" /> Rejected</span>}
                        {o.approvals[stage] === null && o.status !== 'Withdrawn' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" className="btn btn-success btn-sm" onClick={() => handleApprove(o.id, stage)}><i className="fa fa-check" /> Approve</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleReject(o.id, stage)}><i className="fa fa-times" /> Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {o.status === 'Approved' && (
                    <div style={{ marginTop: '12px' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => sendToCandidate(o.id)}><i className="fa fa-send" /> Send to Candidate</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseOffers;
