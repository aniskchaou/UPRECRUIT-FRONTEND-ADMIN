import React, { useState, useEffect } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── localStorage helpers (shared with AdminBilling) ──────────────────────────

const loadLiveSubscriptions = () => {
  try {
    return JSON.parse(localStorage.getItem('uprecruit_all_subscriptions') || '[]');
  } catch { return []; }
};

const loadLivePayment = () => {
  try {
    return JSON.parse(localStorage.getItem('uprecruit_subscriptions') || 'null');
  } catch { return null; }
};

// ─── Seed data ─────────────────────────────────────────────────────────────────

const TENANTS_SEED = [
  { id: 't1', name: 'Nexa Systems',      domain: 'nexa.uprecruit.io',      plan: 'Business',    users: 24, status: 'Active',   created: '2025-09-01', region: 'EU-West' },
  { id: 't2', name: 'BrightPath Health', domain: 'bph.uprecruit.io',       plan: 'Professional', users: 9,  status: 'Active',   created: '2025-11-15', region: 'US-East' },
  { id: 't3', name: 'Vortex Finance',    domain: 'vortex.uprecruit.io',    plan: 'Enterprise',  users: 47, status: 'Trial',    created: '2026-06-01', region: 'EU-West' },
  { id: 't4', name: 'DataStride Inc',    domain: 'datastride.uprecruit.io',plan: 'Business',    users: 13, status: 'Active',   created: '2026-01-20', region: 'APAC' },
  { id: 't5', name: 'OldCorp Global',    domain: 'oldcorp.uprecruit.io',   plan: 'Professional', users: 3,  status: 'Suspended',created: '2025-06-10', region: 'EU-West' },
];

const PAYMENTS_SEED = [
  { id: 'p1', tenant: 'Nexa Systems',      amount: 1200, plan: 'Business',     status: 'Paid',   date: '2026-06-01', method: 'Stripe' },
  { id: 'p2', tenant: 'BrightPath Health', amount: 399,  plan: 'Professional', status: 'Paid',   date: '2026-06-01', method: 'Stripe' },
  { id: 'p3', tenant: 'DataStride Inc',    amount: 799,  plan: 'Business',     status: 'Paid',   date: '2026-06-01', method: 'PayPal' },
  { id: 'p4', tenant: 'Nexa Systems',      amount: 1200, plan: 'Business',     status: 'Failed', date: '2026-05-01', method: 'Stripe' },
  { id: 'p5', tenant: 'OldCorp Global',    amount: 399,  plan: 'Professional', status: 'Refunded', date: '2026-04-15', method: 'Stripe' },
];

const AI_PROVIDERS = [
  { id: 'ai1', name: 'OpenAI GPT-4o',        provider: 'OpenAI',    feature: 'Resume Parsing & Job Matching',     status: 'Active',   modelVersion: 'gpt-4o',         costPerCall: 0.012 },
  { id: 'ai2', name: 'OpenAI Embeddings',    provider: 'OpenAI',    feature: 'Semantic Search & Recommendations',  status: 'Active',   modelVersion: 'text-embedding-3-large', costPerCall: 0.00013 },
  { id: 'ai3', name: 'Azure AI Language',    provider: 'Microsoft', feature: 'Skill Extraction & NLP',            status: 'Active',   modelVersion: '2024-05',        costPerCall: 0.005 },
  { id: 'ai4', name: 'Cohere Rerank',        provider: 'Cohere',    feature: 'Candidate Ranking',                  status: 'Inactive', modelVersion: 'rerank-v3',      costPerCall: 0.002 },
  { id: 'ai5', name: 'Anthropic Claude',     provider: 'Anthropic', feature: 'Interview Scoring & Analysis',       status: 'Inactive', modelVersion: 'claude-sonnet',  costPerCall: 0.015 },
];

const SSO_PROVIDERS = [
  { id: 'sso1', name: 'Microsoft Entra ID', protocol: 'SAML 2.0', tenants: 3, status: 'Active' },
  { id: 'sso2', name: 'Google Workspace',   protocol: 'OAuth 2.0 / OIDC', tenants: 2, status: 'Active' },
  { id: 'sso3', name: 'Okta',               protocol: 'SAML 2.0', tenants: 0, status: 'Configured' },
  { id: 'sso4', name: 'Auth0',              protocol: 'OAuth 2.0 / OIDC', tenants: 0, status: 'Inactive' },
];

const GLOBAL_SETTINGS = [
  { key: 'maintenance_mode',     label: 'Maintenance Mode',          value: 'false', type: 'toggle', description: 'Temporarily block all non-admin access to the platform' },
  { key: 'max_tenants',          label: 'Max Tenants',               value: '500',   type: 'number', description: 'Hard cap on total tenant count' },
  { key: 'ai_rate_limit',        label: 'AI Calls / Min (Global)',   value: '300',   type: 'number', description: 'Platform-wide AI request rate limit' },
  { key: 'allow_self_signup',    label: 'Allow Self-Signup',         value: 'true',  type: 'toggle', description: 'Allow new companies to sign up without admin approval' },
  { key: 'default_ai_provider',  label: 'Default AI Provider',      value: 'OpenAI',type: 'select', description: 'Provider used for new tenants without custom config', options: ['OpenAI', 'Microsoft', 'Anthropic', 'Cohere'] },
  { key: 'billing_currency',     label: 'Billing Currency',         value: 'USD',   type: 'select', description: 'Default currency for all invoices', options: ['USD', 'EUR', 'GBP', 'MAD'] },
];

const SECTIONS = [
  { id: 'overview',       label: 'Overview',           icon: 'fa-globe'       },
  { id: 'verifications',  label: 'Verifications',      icon: 'fa-id-card'     },
  { id: 'tenants',        label: 'Tenant Management',  icon: 'fa-building'    },
  { id: 'payments',       label: 'Payments & Billing', icon: 'fa-credit-card' },
  { id: 'ai',             label: 'AI Configuration',   icon: 'fa-robot'       },
  { id: 'security',       label: 'SSO / OAuth',        icon: 'fa-lock'        },
  { id: 'settings',       label: 'Global Settings',    icon: 'fa-sliders'     },
];

const planColor   = p => ({ Enterprise: '#8b5cf6', Business: '#3b82f6', Professional: '#0ea5e9' }[p] || '#64748b');
const statusColor = s => ({ Active: '#16a34a', Trial: '#f59e0b', Suspended: '#ef4444' }[s] || '#94a3b8');
const payColor    = s => ({ Paid: '#16a34a', Failed: '#ef4444', Refunded: '#94a3b8' }[s] || '#64748b');

// ─── Component ──────────────────────────────────────────────────────────────────

const EnterpriseSuperAdmin = () => {
  const [activeSection, setActiveSection]   = useState('overview');
  const [tenants, setTenants]               = useState(TENANTS_SEED);
  const [aiProviders, setAiProviders]       = useState(AI_PROVIDERS);
  const [settings, setSettings]             = useState(GLOBAL_SETTINGS);
  const [flash, setFlash]                   = useState('');
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [tenantForm, setTenantForm]         = useState({ name: '', domain: '', plan: 'Professional', region: 'EU-West' });
  const [livePayments, setLivePayments]     = useState(() => loadLiveSubscriptions());
  const [verifications, setVerifications]   = useState([]);
  const [expandedDoc, setExpandedDoc]       = useState(null); // { regId, docId }
  const [rejectNote, setRejectNote]         = useState({});   // { [regId]: string }

  // Load verifications from localStorage
  const loadVerifications = () => {
    try {
      return JSON.parse(localStorage.getItem('uprecruit_company_registrations') || '[]');
    } catch { return []; }
  };

  const saveVerifications = (list) => {
    localStorage.setItem('uprecruit_company_registrations', JSON.stringify(list));
  };

  // Poll localStorage every 3s so new admin payments and registrations appear in real-time
  useEffect(() => {
    setVerifications(loadVerifications());
    const iv = setInterval(() => {
      const fresh = loadLiveSubscriptions();
      setLivePayments(fresh);
      setVerifications(loadVerifications());
      // Auto-provision tenant if not already in the list
      if (fresh.length > 0) {
        setTenants(prev => {
          const merged = [...prev];
          fresh.forEach(sub => {
            const exists = merged.some(t => t.name === sub.tenantName);
            if (!exists && sub.tenantName) {
              merged.push({
                id: `t-live-${sub.tenantEmail}`,
                name: sub.tenantName,
                domain: `${sub.tenantName.toLowerCase().replace(/\s+/g, '')}.uprecruit.io`,
                plan: sub.plan,
                users: 1,
                status: sub.status === 'Active' ? 'Active' : 'Suspended',
                created: sub.paidAt,
                region: sub.region || 'EU-West',
              });
            }
          });
          return merged;
        });
      }
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const msg = (m) => { setFlash(m); setTimeout(() => setFlash(''), 3000); };

  const approveRegistration = (regId) => {
    const updated = verifications.map(r =>
      r.id === regId ? { ...r, status: 'approved', reviewedAt: new Date().toISOString().slice(0, 10) } : r
    );
    setVerifications(updated);
    saveVerifications(updated);
    const reg = updated.find(r => r.id === regId);
    // Auto-provision the tenant
    if (reg) {
      setTenants(prev => {
        if (prev.some(t => t.name === reg.company.name)) return prev;
        return [...prev, {
          id: `t-reg-${regId}`,
          name: reg.company.name,
          domain: `${reg.company.name.toLowerCase().replace(/\s+/g, '')}.uprecruit.io`,
          plan: 'Trial',
          users: 1,
          status: 'Trial',
          created: new Date().toISOString().slice(0, 10),
          region: 'EU-West',
        }];
      });
    }
    msg(`✅ "${reg?.company?.name}" approved and tenant provisioned.`);
  };

  const rejectRegistration = (regId) => {
    const note = rejectNote[regId] || '';
    const updated = verifications.map(r =>
      r.id === regId ? { ...r, status: 'rejected', rejectReason: note, reviewedAt: new Date().toISOString().slice(0, 10) } : r
    );
    setVerifications(updated);
    saveVerifications(updated);
    const reg = updated.find(r => r.id === regId);
    msg(`❌ "${reg?.company?.name}" rejected.`);
  };

  const activeTenants  = tenants.filter(t => t.status === 'Active').length;
  const totalRevenue   = PAYMENTS_SEED.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const activeAI       = aiProviders.filter(a => a.status === 'Active').length;

  const createTenant = (e) => {
    e.preventDefault();
    setTenants(prev => [...prev, { id: `t-${Date.now()}`, ...tenantForm, users: 0, status: 'Trial', created: new Date().toISOString().slice(0, 10) }]);
    setShowTenantForm(false);
    setTenantForm({ name: '', domain: '', plan: 'Professional', region: 'EU-West' });
    msg(`Tenant "${tenantForm.name}" provisioned.`);
  };

  const toggleTenantStatus = (id) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t));
    msg('Tenant status updated.');
  };

  const toggleAI = (id) => {
    setAiProviders(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
    msg('AI provider configuration updated.');
  };

  const updateSetting = (key, value) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    msg(`Setting "${key}" saved.`);
  };

  return (
    <div className="user-management">
      {flash && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{flash}</div>}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-globe" /><span>Super Admin</span></div>
        {SECTIONS.map(s => {
          const pendingCount = s.id === 'verifications' ? verifications.filter(r => r.status === 'pending').length : 0;
          return (
            <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa ${s.icon}`} /><span>{s.label}</span>
              </span>
              {pendingCount > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '10px', fontWeight: 800 }}>{pendingCount}</span>
              )}
            </button>
          );
        })}
        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', padding: '10px 14px' }}>
          {[['fa-building', '#3b82f6', activeTenants, 'Active Tenants'], ['fa-line-chart', '#16a34a', `$${totalRevenue.toLocaleString()}`, 'Revenue (MoM)'], ['fa-robot', '#8b5cf6', activeAI, 'Active AI Providers']].map(([ic, col, val, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <i className={`fa ${ic}`} style={{ color: col, width: '16px' }} />
              <div><div style={{ fontWeight: 800, fontSize: '15px', color: '#1e293b' }}>{val}</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>{lbl}</div></div>
            </div>
          ))}
        </div>
      </aside>

      <main className="user-management__main">

        {/* ── Verifications ── */}
        {activeSection === 'verifications' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-id-card" /> Company Verifications</h4>

            {/* Status summary */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                ['pending',  '#f59e0b', 'fa-clock-o',    'Pending Review'],
                ['approved', '#16a34a', 'fa-check-circle','Approved'],
                ['rejected', '#ef4444', 'fa-times-circle','Rejected'],
              ].map(([status, color, icon, label]) => {
                const count = verifications.filter(r => r.status === status).length;
                return (
                  <div key={status} style={{ flex: '1 1 150px', background: '#fff', border: `1px solid ${color}22`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <i className={`fa ${icon}`} style={{ color, fontSize: '22px', marginBottom: '4px', display: 'block' }} />
                    <div style={{ fontSize: '24px', fontWeight: 900, color }}>{count}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</div>
                  </div>
                );
              })}
            </div>

            {verifications.length === 0 && (
              <div style={{ background: '#fff', border: '1px dashed #e2e8f0', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <i className="fa fa-inbox" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }} />
                No company registrations yet. Share the registration link with companies.
                <div style={{ marginTop: '12px' }}>
                  <code style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>
                    /frontoffice/company-register
                  </code>
                </div>
              </div>
            )}

            {verifications.map(reg => {
              const isPending  = reg.status === 'pending';
              const isApproved = reg.status === 'approved';
              const isRejected = reg.status === 'rejected';
              const statusColor = isPending ? '#f59e0b' : isApproved ? '#16a34a' : '#ef4444';
              const statusLabel = isPending ? 'Pending' : isApproved ? 'Approved' : 'Rejected';

              return (
                <div key={reg.id} style={{ background: '#fff', border: `1.5px solid ${isPending ? '#fde68a' : isApproved ? '#86efac' : '#fca5a5'}`, borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>

                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: statusColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa fa-building" style={{ color: statusColor, fontSize: '18px' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '16px', color: '#0f172a' }}>{reg.company.name}</strong>
                          <span style={{ background: statusColor + '18', color: statusColor, borderRadius: '6px', padding: '2px 10px', fontSize: '10px', fontWeight: 800 }}>{statusLabel}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{reg.company.industry} · {reg.company.size} employees · {reg.company.city}, {reg.company.country}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
                      Submitted: {reg.submittedAt}<br />
                      {reg.reviewedAt && `Reviewed: ${reg.reviewedAt}`}
                    </div>
                  </div>

                  {/* Two-column: contact + company */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '8px' }}>Contact Person</div>
                      {[
                        ['fa-user', `${reg.owner.firstName} ${reg.owner.lastName}`],
                        ['fa-briefcase', reg.owner.title],
                        ['fa-envelope', reg.owner.email],
                        ['fa-phone', reg.owner.phone || '—'],
                      ].map(([icon, val]) => (
                        <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#475569', marginBottom: '5px' }}>
                          <i className={`fa ${icon}`} style={{ color: '#94a3b8', width: '12px' }} />{val}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '8px' }}>Company Details</div>
                      {[
                        ['fa-globe', reg.company.website || 'No website'],
                        ['fa-map-marker', `${reg.company.address}, ${reg.company.city}`],
                        ['fa-info-circle', reg.company.description ? reg.company.description.slice(0, 80) + (reg.company.description.length > 80 ? '…' : '') : 'No description'],
                      ].map(([icon, val]) => (
                        <div key={icon} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#475569', marginBottom: '5px' }}>
                          <i className={`fa ${icon}`} style={{ color: '#94a3b8', width: '12px', marginTop: '2px', flexShrink: 0 }} />{val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div style={{ marginBottom: isPending ? '16px' : '0' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '8px' }}>Submitted Documents</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {reg.documents.map(doc => (
                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: doc.uploaded ? '#f0fdf4' : '#fef2f2', border: `1px solid ${doc.uploaded ? '#86efac' : '#fca5a5'}`, borderRadius: '8px', padding: '6px 12px', fontSize: '11px', cursor: doc.uploaded ? 'pointer' : 'default' }}
                          onClick={() => doc.uploaded && setExpandedDoc(expandedDoc?.regId === reg.id && expandedDoc?.docId === doc.id ? null : { regId: reg.id, docId: doc.id })}>
                          <i className={`fa ${doc.uploaded ? 'fa-file-text' : 'fa-times'}`} style={{ color: doc.uploaded ? '#16a34a' : '#ef4444' }} />
                          <span style={{ color: doc.uploaded ? '#15803d' : '#dc2626', fontWeight: 600 }}>{doc.label}</span>
                          {doc.uploaded && <span style={{ color: '#64748b' }}>— {doc.fileName}</span>}
                        </div>
                      ))}
                    </div>
                    {expandedDoc?.regId === reg.id && (
                      <div style={{ marginTop: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#475569' }}>
                        <i className="fa fa-info-circle" style={{ marginRight: '6px', color: '#6366f1' }} />
                        In production, the actual file would be displayed here. Document: <strong>{reg.documents.find(d => d.id === expandedDoc.docId)?.fileName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Reject note for rejection input */}
                  {isPending && (
                    <div>
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 300px' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>
                            Rejection reason (optional — will be shown to company)
                          </label>
                          <input
                            value={rejectNote[reg.id] || ''}
                            onChange={e => setRejectNote(prev => ({ ...prev, [reg.id]: e.target.value }))}
                            placeholder="e.g. Documents are blurry, missing tax certificate…"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '12px', color: '#0f172a' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button type="button" onClick={() => rejectRegistration(reg.id)}
                            style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fa fa-times" /> Reject
                          </button>
                          <button type="button" onClick={() => approveRegistration(reg.id)}
                            style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 3px 10px #16a34a40' }}>
                            <i className="fa fa-check" /> Approve & Provision Tenant
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRejected && reg.rejectReason && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>
                      <strong>Rejection reason:</strong> {reg.rejectReason}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* ── Overview ── */}
        {activeSection === 'overview' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-globe" /> SaaS Platform Overview</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { label: 'Total Tenants',    value: tenants.length,                             icon: 'fa-building',    color: '#3b82f6' },
                { label: 'Active Tenants',   value: activeTenants,                              icon: 'fa-check-circle',color: '#16a34a' },
                { label: 'Trial Tenants',    value: tenants.filter(t => t.status === 'Trial').length, icon: 'fa-clock-o', color: '#f59e0b' },
                { label: 'Revenue (MoM)',    value: `$${totalRevenue.toLocaleString()}`,         icon: 'fa-line-chart',  color: '#16a34a' },
                { label: 'Active AI Engines',value: activeAI,                                   icon: 'fa-robot',       color: '#8b5cf6' },
                { label: 'SSO Providers',    value: SSO_PROVIDERS.filter(s => s.status === 'Active').length, icon: 'fa-lock', color: '#0ea5e9' },
              ].map(stat => (
                <div key={stat.label} style={{ flex: '1 1 150px', background: '#fff', border: `1px solid ${stat.color}22`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <i className={`fa ${stat.icon}`} style={{ fontSize: '22px', color: stat.color, marginBottom: '6px', display: 'block' }} />
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '2 1 300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ marginBottom: '10px' }}>Tenant Distribution by Plan</h5>
                {['Enterprise', 'Business', 'Professional'].map(plan => {
                  const count = tenants.filter(t => t.plan === plan).length;
                  const pct = Math.round((count / tenants.length) * 100);
                  return (
                    <div key={plan} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                        <span><strong style={{ color: planColor(plan) }}>{plan}</strong></span>
                        <span style={{ color: '#64748b' }}>{count} tenants ({pct}%)</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px' }}>
                        <div style={{ background: planColor(plan), borderRadius: '4px', height: '6px', width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ flex: '1 1 200px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ marginBottom: '10px' }}>Recent Payments</h5>
                {PAYMENTS_SEED.slice(0, 4).map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '11px' }}>
                    <span style={{ color: '#475569' }}>{p.tenant}</span>
                    <span style={{ color: payColor(p.status), fontWeight: 700 }}>{p.status === 'Paid' ? `+$${p.amount}` : p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Tenant Management ── */}
        {activeSection === 'tenants' && (
          <section className="user-management__section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 className="dashboard-section-heading" style={{ margin: 0 }}><i className="fa fa-building" /> Tenant Management</h4>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowTenantForm(p => !p)}><i className="fa fa-plus" /> Provision Tenant</button>
            </div>

            {showTenantForm && (
              <div className="user-management__card-form" style={{ marginBottom: '16px' }}>
                <h5>Provision New Tenant</h5>
                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} onSubmit={createTenant}>
                  <div><label className="fo-label">Company Name</label><input className="fo-input" required value={tenantForm.name} onChange={e => setTenantForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><label className="fo-label">Subdomain</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input className="fo-input" required value={tenantForm.domain} onChange={e => setTenantForm(p => ({ ...p, domain: e.target.value }))} placeholder="company" style={{ flex: 1 }} />
                      <span style={{ padding: '0 8px', color: '#94a3b8', fontSize: '12px' }}>.uprecruit.io</span>
                    </div>
                  </div>
                  <div><label className="fo-label">Plan</label>
                    <select className="fo-input" value={tenantForm.plan} onChange={e => setTenantForm(p => ({ ...p, plan: e.target.value }))}>
                      {['Professional', 'Business', 'Enterprise'].map(pl => <option key={pl}>{pl}</option>)}
                    </select>
                  </div>
                  <div><label className="fo-label">Region</label>
                    <select className="fo-input" value={tenantForm.region} onChange={e => setTenantForm(p => ({ ...p, region: e.target.value }))}>
                      {['EU-West', 'US-East', 'US-West', 'APAC', 'MENA'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Provision</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowTenantForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead><tr><th>Tenant</th><th>Domain</th><th>Plan</th><th>Region</th><th>Users</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id}>
                      <td><strong style={{ fontSize: '12px' }}>{t.name}</strong></td>
                      <td><code style={{ fontSize: '10px' }}>{t.domain}</code></td>
                      <td><span style={{ background: planColor(t.plan) + '18', color: planColor(t.plan), borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{t.plan}</span></td>
                      <td style={{ fontSize: '11px', color: '#64748b' }}>{t.region}</td>
                      <td style={{ fontSize: '12px' }}>{t.users}</td>
                      <td><span style={{ background: statusColor(t.status) + '18', color: statusColor(t.status), borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{t.status}</span></td>
                      <td style={{ fontSize: '11px', color: '#94a3b8' }}>{t.created}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button type="button" className="btn btn-outline-primary btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={() => msg(`Impersonating ${t.name} tenant…`)}><i className="fa fa-sign-in" /></button>
                          <button type="button" className={`btn ${t.status === 'Suspended' ? 'btn-success' : 'btn-outline-warning'} btn-sm`} style={{ fontSize: '10px', padding: '2px 8px' }} onClick={() => toggleTenantStatus(t.id)}>
                            <i className={`fa ${t.status === 'Suspended' ? 'fa-play' : 'fa-pause'}`} />
                          </button>
                          <button type="button" className="btn btn-outline-secondary btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={() => msg(`Settings for ${t.name}`)}><i className="fa fa-cog" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Payments ── */}
        {activeSection === 'payments' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-credit-card" /> Payments & Billing</h4>

            {livePayments.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa fa-bell" style={{ color: '#16a34a', fontSize: '16px' }} />
                <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 600 }}>
                  {livePayments.length} live payment{livePayments.length > 1 ? 's' : ''} received from admin portal — showing below.
                </span>
              </div>
            )}

            {/* Live payments from admin billing */}
            {livePayments.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  Live Incoming Payments
                </h5>
                <div className="user-management__table-wrapper">
                  <table className="user-management__table">
                    <thead><tr><th>Tenant</th><th>Plan</th><th>Amount</th><th>Billing</th><th>Method</th><th>Paid At</th><th>Next Renewal</th><th>Status</th></tr></thead>
                    <tbody>
                      {livePayments.map((p, i) => (
                        <tr key={i} style={{ background: '#f0fdf410' }}>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>{p.tenantName}</div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{p.tenantEmail}</div>
                          </td>
                          <td><span style={{ background: planColor(p.plan) + '18', color: planColor(p.plan), borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{p.plan}</span></td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>${p.amount.toLocaleString()}</td>
                          <td style={{ fontSize: '11px' }}>{p.billingPeriod}</td>
                          <td style={{ fontSize: '12px' }}>{p.method}</td>
                          <td style={{ fontSize: '11px', color: '#94a3b8' }}>{p.paidAt}</td>
                          <td style={{ fontSize: '11px', color: '#64748b' }}>{p.nextRenewal}</td>
                          <td>
                            <span style={{ background: '#16a34a18', color: '#16a34a', borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>
                              <i className="fa fa-check-circle" style={{ marginRight: '3px' }} />{p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Seed + summary */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['Paid', 'Failed', 'Refunded'].map(status => {
                const total = PAYMENTS_SEED.filter(p => p.status === status).reduce((s, p) => s + p.amount, 0);
                const liveTotal = livePayments.filter(p => p.status === 'Active').reduce((s, p) => s + p.amount, 0);
                const count = PAYMENTS_SEED.filter(p => p.status === status).length;
                return (
                  <div key={status} style={{ flex: '1 1 150px', background: '#fff', border: `1px solid ${payColor(status)}22`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: payColor(status) }}>
                      ${(total + (status === 'Paid' ? liveTotal : 0)).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{count + (status === 'Paid' ? livePayments.length : 0)} {status}</div>
                  </div>
                );
              })}
            </div>

            <h5 style={{ marginBottom: '10px', color: '#64748b', fontSize: '13px' }}>Historical Payments</h5>
            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead><tr><th>ID</th><th>Tenant</th><th>Plan</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {PAYMENTS_SEED.map(p => (
                    <tr key={p.id}>
                      <td><code style={{ fontSize: '10px' }}>{p.id.toUpperCase()}</code></td>
                      <td><strong style={{ fontSize: '12px' }}>{p.tenant}</strong></td>
                      <td><span style={{ background: planColor(p.plan) + '18', color: planColor(p.plan), borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{p.plan}</span></td>
                      <td style={{ fontWeight: 700, color: '#1e293b' }}>${p.amount.toLocaleString()}</td>
                      <td style={{ fontSize: '12px' }}>{p.method}</td>
                      <td style={{ fontSize: '11px', color: '#94a3b8' }}>{p.date}</td>
                      <td><span style={{ background: payColor(p.status) + '18', color: payColor(p.status), borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{p.status}</span></td>
                      <td>
                        <button type="button" className="btn btn-outline-secondary btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={() => msg(`Receipt for ${p.id.toUpperCase()} downloaded`)}><i className="fa fa-download" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── AI Configuration ── */}
        {activeSection === 'ai' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-robot" /> AI Provider Configuration</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>Manage AI engines powering resume parsing, job matching, recommendations, and scoring.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiProviders.map(ai => (
                <div key={ai.id} style={{ background: '#fff', border: `1px solid ${ai.status === 'Active' ? '#16a34a22' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '13px' }}>{ai.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Provider: {ai.provider} · Model: <code style={{ fontSize: '10px' }}>{ai.modelVersion}</code></div>
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}><i className="fa fa-cogs" style={{ marginRight: '4px', color: '#8b5cf6' }} />{ai.feature}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>${ai.costPerCall}/call</span>
                      <span style={{ background: ai.status === 'Active' ? '#16a34a18' : '#94a3b818', color: ai.status === 'Active' ? '#16a34a' : '#94a3b8', borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{ai.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className={`btn ${ai.status === 'Active' ? 'btn-outline-warning' : 'btn-success'} btn-sm`} style={{ fontSize: '11px' }} onClick={() => toggleAI(ai.id)}>
                      {ai.status === 'Active' ? <><i className="fa fa-pause" /> Disable</> : <><i className="fa fa-play" /> Enable</>}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" style={{ fontSize: '11px' }} onClick={() => msg(`API key configured for ${ai.name}`)}>
                      <i className="fa fa-key" /> Configure API Key
                    </button>
                    <button type="button" className="btn btn-outline-primary btn-sm" style={{ fontSize: '11px' }} onClick={() => msg(`Running test call for ${ai.name}…`)}>
                      <i className="fa fa-flash" /> Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SSO / OAuth ── */}
        {activeSection === 'security' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-lock" /> SSO & OAuth Configuration</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>Configure identity providers for enterprise single sign-on across tenants.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {SSO_PROVIDERS.map(sso => (
                <div key={sso.id} style={{ background: '#fff', border: `1px solid ${sso.status === 'Active' ? '#3b82f622' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '13px' }}>{sso.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Protocol: {sso.protocol} · Tenants using: {sso.tenants}</div>
                    </div>
                    <span style={{ background: sso.status === 'Active' ? '#16a34a18' : sso.status === 'Configured' ? '#f59e0b18' : '#94a3b818', color: sso.status === 'Active' ? '#16a34a' : sso.status === 'Configured' ? '#f59e0b' : '#94a3b8', borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>
                      {sso.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-outline-primary btn-sm" style={{ fontSize: '11px' }} onClick={() => msg(`Opening ${sso.name} configuration wizard…`)}><i className="fa fa-cog" /> Configure</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" style={{ fontSize: '11px' }} onClick={() => msg(`SAML/OIDC metadata downloaded for ${sso.name}`)}><i className="fa fa-download" /> Metadata</button>
                    {sso.status !== 'Active' && <button type="button" className="btn btn-success btn-sm" style={{ fontSize: '11px' }} onClick={() => msg(`${sso.name} activated`)}><i className="fa fa-power-off" /> Activate</button>}
                  </div>
                </div>
              ))}
            </div>

            <h5 style={{ marginBottom: '10px' }}>Security Policies</h5>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              {[
                { label: 'Force MFA for all Admins', desc: 'Require 2FA for all backoffice users', enabled: true },
                { label: 'Force MFA for Recruiters', desc: 'Require 2FA for all frontoffice recruiter accounts', enabled: false },
                { label: 'IP Allowlist (Admin Panel)', desc: 'Restrict admin access to approved IPs', enabled: false },
                { label: 'Session Timeout (30 min)', desc: 'Auto-logout inactive sessions after 30 minutes', enabled: true },
                { label: 'Brute-Force Lock (5 attempts)', desc: 'Lock accounts after 5 consecutive failed logins', enabled: true },
              ].map((policy, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{policy.label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{policy.desc}</div>
                  </div>
                  <button type="button" onClick={() => msg(`Policy "${policy.label}" toggled`)}
                    style={{ background: policy.enabled ? '#16a34a' : '#e2e8f0', color: policy.enabled ? '#fff' : '#94a3b8', border: 'none', borderRadius: '12px', padding: '3px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', minWidth: '56px' }}>
                    {policy.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Global Settings ── */}
        {activeSection === 'settings' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-sliders" /> Global Platform Settings</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>These settings apply across all tenants unless overridden at the tenant level.</p>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              {settings.map((setting, i) => (
                <div key={setting.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: i < settings.length - 1 ? '1px solid #f1f5f9' : 'none', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{setting.label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{setting.description}</div>
                  </div>
                  <div style={{ flex: '0 0 auto' }}>
                    {setting.type === 'toggle' && (
                      <button type="button" onClick={() => updateSetting(setting.key, setting.value === 'true' ? 'false' : 'true')}
                        style={{ background: setting.value === 'true' ? '#3b82f6' : '#e2e8f0', color: setting.value === 'true' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '12px', padding: '3px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', minWidth: '56px' }}>
                        {setting.value === 'true' ? 'ON' : 'OFF'}
                      </button>
                    )}
                    {setting.type === 'number' && (
                      <input type="number" className="fo-input" style={{ width: '100px', padding: '4px 8px', fontSize: '12px', textAlign: 'right' }}
                        value={setting.value} onChange={e => updateSetting(setting.key, e.target.value)} />
                    )}
                    {setting.type === 'select' && (
                      <select className="fo-input" style={{ width: '140px', padding: '4px 8px', fontSize: '12px' }}
                        value={setting.value} onChange={e => updateSetting(setting.key, e.target.value)}>
                        {setting.options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => msg('All settings saved successfully.')}><i className="fa fa-save" /> Save All Settings</button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseSuperAdmin;
