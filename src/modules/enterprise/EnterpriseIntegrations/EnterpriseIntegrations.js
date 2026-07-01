import React, { useState } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Integration catalogue ────────────────────────────────────────────────────

const INTEGRATIONS = [
  // HR Systems
  { id: 'workday',         name: 'Workday',              category: 'HR Systems',      icon: 'fa-users',          color: '#0095d3', description: 'Sync employee records, org structure, and onboarding data bi-directionally with Workday HCM.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Employee Sync', 'Org Chart Import', 'Payroll Handoff'], popularity: 94 },
  { id: 'sap',             name: 'SAP SuccessFactors',   category: 'HR Systems',      icon: 'fa-database',       color: '#00a800', description: 'Push hired candidates directly into SAP SuccessFactors as new employee records with all offer data.', status: 'Disconnected', authType: 'API Key',   actions: ['New Hire Export', 'Position Sync', 'Compensation Mapping'], popularity: 87 },
  { id: 'oracle',          name: 'Oracle HCM',           category: 'HR Systems',      icon: 'fa-server',         color: '#f80000', description: 'Integrate with Oracle HCM Cloud for headcount planning, workforce analytics and hire-to-retire lifecycle.', status: 'Disconnected', authType: 'OAuth 2.0', actions: ['Headcount Sync', 'Position Management', 'Onboarding Trigger'], popularity: 78 },
  { id: 'bamboo',          name: 'BambooHR',             category: 'HR Systems',      icon: 'fa-leaf',           color: '#73b504', description: 'Small-to-mid size HR teams: sync employee directory, time-off and org chart with BambooHR.', status: 'Disconnected', authType: 'API Key',   actions: ['Employee Directory Sync', 'Time-off Rules'], popularity: 71 },
  // Communication
  { id: 'teams',           name: 'Microsoft Teams',      category: 'Communication',   icon: 'fa-comments',       color: '#5058e5', description: 'Send interview notifications, offer updates and onboarding alerts directly to Teams channels and users.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Interview Alerts', 'Offer Notifications', 'Team Channels', 'Onboarding Bot'], popularity: 91 },
  { id: 'slack',           name: 'Slack',                category: 'Communication',   icon: 'fa-slack',          color: '#4a154b', description: 'Real-time hiring pipeline updates pushed to Slack channels. Approve offers directly from Slack messages.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Pipeline Alerts', 'Offer Approval', 'Recruiter Daily Digest', 'Candidate Status'], popularity: 89 },
  { id: 'zoom',            name: 'Zoom',                 category: 'Communication',   icon: 'fa-video-camera',   color: '#2d8cff', description: 'Auto-generate Zoom meeting links for video interviews. Join directly from the interview card.', status: 'Disconnected', authType: 'OAuth 2.0', actions: ['Meeting Link Generation', 'Recording Storage'], popularity: 83 },
  { id: 'googlemeet',      name: 'Google Meet',          category: 'Communication',   icon: 'fa-video-camera',   color: '#34a853', description: 'Generate Google Meet links for interviews. Automatically creates calendar events in Google Calendar.', status: 'Disconnected', authType: 'OAuth 2.0', actions: ['Meeting Link Generation', 'Calendar Event Creation'], popularity: 76 },
  // Calendar
  { id: 'gcal',            name: 'Google Calendar',      category: 'Calendar',        icon: 'fa-calendar',       color: '#4285f4', description: 'Sync interview schedules to Google Calendar. Check interviewer availability before booking.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Availability Check', 'Event Creation', 'Reminder Sync'], popularity: 88 },
  { id: 'outlook',         name: 'Microsoft Outlook',    category: 'Calendar',        icon: 'fa-envelope',       color: '#0078d4', description: 'Push interview invitations and onboarding events to Outlook calendars with one click.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Calendar Event Push', 'Availability Check', 'Invite Attachments'], popularity: 85 },
  { id: 'calendly',        name: 'Calendly',             category: 'Calendar',        icon: 'fa-clock-o',        color: '#006bff', description: 'Let candidates self-schedule interviews through Calendly links embedded in outreach emails.', status: 'Disconnected', authType: 'API Key',   actions: ['Self-Scheduling Links', 'Availability Routing'], popularity: 74 },
  // Assessments
  { id: 'hackerrank',      name: 'HackerRank',           category: 'Assessments',     icon: 'fa-code',           color: '#2ec866', description: 'Send HackerRank technical challenges directly from the ATS. Scores flow back automatically.', status: 'Disconnected', authType: 'API Key',   actions: ['Test Invitation', 'Score Import', 'Plagiarism Report'], popularity: 80 },
  { id: 'codility',        name: 'Codility',             category: 'Assessments',     icon: 'fa-terminal',       color: '#ff5500', description: 'Automated coding challenges with Codility. Results imported directly into candidate profiles.', status: 'Disconnected', authType: 'API Key',   actions: ['Test Dispatch', 'Result Sync'], popularity: 73 },
  // Background Checks
  { id: 'checkr',          name: 'Checkr',               category: 'Background Checks', icon: 'fa-shield',       color: '#33cdd1', description: 'Trigger background checks post-offer. Status updates sync automatically into the candidate timeline.', status: 'Disconnected', authType: 'API Key',   actions: ['Check Trigger', 'Status Sync', 'Report Download'], popularity: 82 },
  { id: 'sterling',        name: 'Sterling',             category: 'Background Checks', icon: 'fa-check-circle', color: '#003087', description: 'Enterprise-grade screening with Sterling. Criminal, education and employment history verification.', status: 'Disconnected', authType: 'OAuth 2.0', actions: ['Package Selection', 'Status Polling', 'Result PDF'], popularity: 68 },
  // Job Boards
  { id: 'linkedin',        name: 'LinkedIn Jobs',        category: 'Job Boards',      icon: 'fa-linkedin',       color: '#0077b5', description: 'Post jobs to LinkedIn and receive applications directly into the pipeline. Real-time sync.', status: 'Connected',    authType: 'OAuth 2.0', actions: ['Job Post Sync', 'Application Import', 'Sponsored Ads'], popularity: 96 },
  { id: 'indeed',          name: 'Indeed',               category: 'Job Boards',      icon: 'fa-search',         color: '#2164f3', description: 'Distribute job postings to Indeed and automatically pull in applicants.', status: 'Connected',    authType: 'API Key',   actions: ['Job Post Distribution', 'Application Pull', 'Sponsored Listing'], popularity: 90 },
  // E-Signature
  { id: 'docusign',        name: 'DocuSign',             category: 'E-Signature',     icon: 'fa-pencil-square',  color: '#ffb800', description: 'Route offer letters through DocuSign for legally binding e-signatures with audit trail.', status: 'Disconnected', authType: 'OAuth 2.0', actions: ['Envelope Creation', 'Signature Routing', 'Audit Trail'], popularity: 85 },
  { id: 'hellosign',       name: 'Dropbox Sign',         category: 'E-Signature',     icon: 'fa-file-text',      color: '#0061ff', description: 'Send and track offer letters with Dropbox Sign (HelloSign). GDPR-compliant document storage.', status: 'Disconnected', authType: 'API Key',   actions: ['Document Send', 'Status Polling', 'Archive'], popularity: 72 },
];

const CATEGORIES = ['All', ...Array.from(new Set(INTEGRATIONS.map((i) => i.category)))];
const STATUS_OPTIONS = ['All', 'Connected', 'Disconnected'];

const SECTIONS = [
  { id: 'marketplace', label: 'Marketplace',   icon: 'fa-th-large' },
  { id: 'connected',   label: 'My Integrations', icon: 'fa-plug' },
  { id: 'logs',        label: 'Sync Logs',      icon: 'fa-list-alt' },
  { id: 'webhooks',    label: 'Webhooks',        icon: 'fa-code' },
];

const SYNC_LOGS = [
  { id: 'l1', integration: 'Workday',           action: 'Employee Sync',         status: 'Success', records: 4,  ts: '2026-06-20 08:14' },
  { id: 'l2', integration: 'LinkedIn Jobs',     action: 'Application Import',    status: 'Success', records: 18, ts: '2026-06-20 07:55' },
  { id: 'l3', integration: 'Google Calendar',   action: 'Event Creation',        status: 'Success', records: 3,  ts: '2026-06-20 07:30' },
  { id: 'l4', integration: 'Microsoft Teams',   action: 'Interview Alert',       status: 'Success', records: 5,  ts: '2026-06-20 06:00' },
  { id: 'l5', integration: 'Indeed',            action: 'Job Post Distribution', status: 'Failed',  records: 0,  ts: '2026-06-19 23:00', error: 'Rate limit exceeded (429). Retry scheduled.' },
  { id: 'l6', integration: 'Slack',             action: 'Offer Approval',        status: 'Success', records: 1,  ts: '2026-06-19 17:22' },
  { id: 'l7', integration: 'Microsoft Outlook', action: 'Calendar Event Push',   status: 'Success', records: 6,  ts: '2026-06-19 14:10' },
];

const WEBHOOKS_SEED = [
  { id: 'wh1', name: 'New Application',    event: 'application.created',   url: 'https://api.acme.io/hooks/uprecruit', active: true,  lastFired: '2026-06-20 08:00' },
  { id: 'wh2', name: 'Offer Signed',       event: 'offer.signed',           url: 'https://hrms.acme.io/webhook',        active: true,  lastFired: '2026-06-17 15:30' },
  { id: 'wh3', name: 'Hire Complete',      event: 'hire.completed',         url: 'https://payroll.acme.io/new-hire',    active: false, lastFired: '2026-06-10 09:15' },
];

const WEBHOOK_EVENTS = ['application.created', 'application.stage_changed', 'interview.scheduled', 'offer.created', 'offer.signed', 'offer.declined', 'hire.completed', 'candidate.rejected'];

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseIntegrations = () => {
  const [activeSection, setActiveSection] = useState('marketplace');
  const [statuses, setStatuses]     = useState(() => Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.status])));
  const [syncing,  setSyncing]      = useState({});
  const [catFilter, setCatFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]         = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [webhooks, setWebhooks]     = useState(WEBHOOKS_SEED);
  const [wForm, setWForm]           = useState({ name: '', event: WEBHOOK_EVENTS[0], url: '' });
  const [logs, setLogs]             = useState(SYNC_LOGS);
  const [detailOpen, setDetailOpen] = useState(null); // integration id

  const flash = (msg) => { setActionMessage(msg); setTimeout(() => setActionMessage(''), 3500); };

  const connect = (id) => {
    setSyncing((p) => ({ ...p, [id]: true }));
    setTimeout(() => {
      setSyncing((p) => ({ ...p, [id]: false }));
      setStatuses((p) => ({ ...p, [id]: 'Connected' }));
      const intg = INTEGRATIONS.find((i) => i.id === id);
      setLogs((prev) => [{ id: `l-${Date.now()}`, integration: intg.name, action: 'Initial Sync', status: 'Success', records: Math.floor(Math.random() * 10) + 1, ts: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...prev]);
      flash(`${intg?.name} connected successfully.`);
    }, 1500);
  };

  const disconnect = (id) => {
    setStatuses((p) => ({ ...p, [id]: 'Disconnected' }));
    flash(`${INTEGRATIONS.find((i) => i.id === id)?.name} disconnected.`);
  };

  const syncNow = (id) => {
    setSyncing((p) => ({ ...p, [id]: true }));
    setTimeout(() => {
      setSyncing((p) => ({ ...p, [id]: false }));
      const intg = INTEGRATIONS.find((i) => i.id === id);
      setLogs((prev) => [{ id: `l-${Date.now()}`, integration: intg.name, action: intg.actions[0], status: 'Success', records: Math.floor(Math.random() * 15) + 1, ts: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...prev]);
      flash(`${intg?.name} synced successfully.`);
    }, 1200);
  };

  const addWebhook = (e) => {
    e.preventDefault();
    if (!wForm.url.startsWith('https://')) { flash('Webhook URL must start with https://'); return; }
    setWebhooks((prev) => [...prev, { id: `wh-${Date.now()}`, name: wForm.name, event: wForm.event, url: wForm.url, active: true, lastFired: '—' }]);
    setWForm({ name: '', event: WEBHOOK_EVENTS[0], url: '' });
    flash('Webhook registered.');
  };

  const toggleWebhook = (id) => setWebhooks((prev) => prev.map((w) => w.id === id ? { ...w, active: !w.active } : w));
  const deleteWebhook = (id) => { setWebhooks((prev) => prev.filter((w) => w.id !== id)); flash('Webhook deleted.'); };

  const filtered = INTEGRATIONS.filter((i) => {
    const matchCat    = catFilter === 'All'    || i.category === catFilter;
    const matchStatus = statusFilter === 'All' || statuses[i.id] === statusFilter;
    const matchSearch = !search.trim() || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const connectedIntegrations = INTEGRATIONS.filter((i) => statuses[i.id] === 'Connected');
  const detail = detailOpen ? INTEGRATIONS.find((i) => i.id === detailOpen) : null;

  return (
    <div className="user-management">
      {actionMessage && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{actionMessage}</div>}

      {/* Detail drawer */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }} onClick={() => setDetailOpen(null)}>
          <div style={{ background: '#fff', width: '400px', height: '100%', padding: '28px', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.18)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: detail.color + '18', border: `1px solid ${detail.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa ${detail.icon}`} style={{ color: detail.color, fontSize: '18px' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '16px' }}>{detail.name}</strong>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{detail.category} · {detail.authType}</div>
                </div>
              </div>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setDetailOpen(null)}><i className="fa fa-times" /></button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>{detail.description}</p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Available Actions</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {detail.actions.map((a) => <span key={a} style={{ background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '3px 8px', fontSize: '11px' }}>{a}</span>)}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Integration Details</div>
              {[['Authentication', detail.authType], ['Category', detail.category], ['Popularity', `${detail.popularity}% of enterprise customers`], ['Status', statuses[detail.id]]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <strong style={{ color: '#1e293b' }}>{v}</strong>
                </div>
              ))}
            </div>

            {statuses[detail.id] === 'Connected' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-primary" onClick={() => { syncNow(detail.id); setDetailOpen(null); }} disabled={syncing[detail.id]}>
                  <i className={`fa ${syncing[detail.id] ? 'fa-spinner fa-spin' : 'fa-refresh'}`} /> Sync Now
                </button>
                <button type="button" className="btn btn-outline-danger" onClick={() => { disconnect(detail.id); setDetailOpen(null); }}>Disconnect</button>
              </div>
            ) : (
              <button type="button" className="btn btn-success" onClick={() => { connect(detail.id); setDetailOpen(null); }} disabled={syncing[detail.id]}>
                <i className={`fa ${syncing[detail.id] ? 'fa-spinner fa-spin' : 'fa-plug'}`} /> Connect {detail.name}
              </button>
            )}
          </div>
        </div>
      )}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-plug" /><span>Integrations</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', paddingTop: '10px', padding: '10px 14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>CONNECTED</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>{connectedIntegrations.length} / {INTEGRATIONS.length}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>integrations active</div>
        </div>
      </aside>

      <main className="user-management__main">

        {/* ── Marketplace ── */}
        {activeSection === 'marketplace' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-th-large" /> Integration Marketplace</h4>

            {/* Search + filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <i className="fa fa-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }} />
                <input className="fo-input" placeholder="Search integrations…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '32px' }} />
              </div>
              <select className="fo-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: '0 1 140px' }}>
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className={`btn btn-sm ${catFilter === c ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setCatFilter(c)}>{c}</button>
              ))}
            </div>

            {/* Cards by category */}
            {(catFilter === 'All' ? Array.from(new Set(INTEGRATIONS.map((i) => i.category))) : [catFilter]).map((cat) => {
              const items = filtered.filter((i) => i.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#475569', marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}><i className="fa fa-folder-o" /> {cat}</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {items.map((intg) => {
                      const connected = statuses[intg.id] === 'Connected';
                      const isSyncing = syncing[intg.id];
                      return (
                        <div key={intg.id} style={{ flex: '1 1 260px', background: '#fff', border: `1px solid ${connected ? '#86efac' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: connected ? '0 0 0 1px #86efac' : 'none' }}
                          onClick={() => setDetailOpen(intg.id)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: intg.color + '18', border: `1px solid ${intg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className={`fa ${intg.icon}`} style={{ color: intg.color, fontSize: '16px' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '13px' }}>{intg.name}</div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{intg.authType}</div>
                              </div>
                            </div>
                            <span style={{ background: connected ? '#d1fae5' : '#f1f5f9', color: connected ? '#065f46' : '#94a3b8', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                              {connected ? '● Connected' : '○ Available'}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{intg.description.slice(0, 90)}…</p>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {intg.actions.slice(0, 2).map((a) => <span key={a} style={{ background: '#f8fafc', color: '#64748b', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', border: '1px solid #e2e8f0' }}>{a}</span>)}
                            {intg.actions.length > 2 && <span style={{ color: '#94a3b8', fontSize: '10px' }}>+{intg.actions.length - 2} more</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                            {connected ? (
                              <>
                                <button type="button" className="btn btn-outline-primary btn-sm" disabled={isSyncing} onClick={() => syncNow(intg.id)}>
                                  <i className={`fa ${isSyncing ? 'fa-spinner fa-spin' : 'fa-refresh'}`} /> {isSyncing ? 'Syncing…' : 'Sync'}
                                </button>
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => disconnect(intg.id)}>Disconnect</button>
                              </>
                            ) : (
                              <button type="button" className="btn btn-success btn-sm" style={{ width: '100%' }} disabled={isSyncing} onClick={() => connect(intg.id)}>
                                <i className={`fa ${isSyncing ? 'fa-spinner fa-spin' : 'fa-plus'}`} /> {isSyncing ? 'Connecting…' : 'Connect'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <i className="fa fa-search" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                No integrations match your search.
              </div>
            )}
          </section>
        )}

        {/* ── My Integrations ── */}
        {activeSection === 'connected' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-plug" /> My Connected Integrations</h4>

            {connectedIntegrations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <i className="fa fa-plug" style={{ fontSize: '28px', marginBottom: '10px', display: 'block' }} />
                No integrations connected yet. Visit the <button type="button" className="btn btn-link" style={{ padding: 0, fontSize: 'inherit' }} onClick={() => setActiveSection('marketplace')}>Marketplace</button>.
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {connectedIntegrations.map((intg) => (
                <div key={intg.id} style={{ flex: '1 1 260px', background: '#fff', border: '1px solid #86efac', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: intg.color + '18', border: `1px solid ${intg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa ${intg.icon}`} style={{ color: intg.color, fontSize: '16px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{intg.name}</div>
                      <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>● Connected · {intg.authType}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {intg.actions.map((a) => <span key={a} style={{ background: '#f0fdf4', color: '#065f46', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', border: '1px solid #86efac' }}>{a}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" className="btn btn-outline-primary btn-sm" disabled={syncing[intg.id]} onClick={() => syncNow(intg.id)}>
                      <i className={`fa ${syncing[intg.id] ? 'fa-spinner fa-spin' : 'fa-refresh'}`} /> Sync Now
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setDetailOpen(intg.id)}>Settings</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => disconnect(intg.id)}>Disconnect</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Sync Logs ── */}
        {activeSection === 'logs' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-list-alt" /> Sync Logs</h4>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Real-time log of all integration sync events. Failed events are retried automatically within 15 minutes.</p>
            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead>
                  <tr><th>Timestamp</th><th>Integration</th><th>Action</th><th>Status</th><th>Records</th><th>Detail</th></tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{log.ts}</td>
                      <td><strong style={{ fontSize: '12px' }}>{log.integration}</strong></td>
                      <td style={{ fontSize: '12px' }}>{log.action}</td>
                      <td>
                        <span className={`dashboard-pill ${log.status === 'Success' ? 'dashboard-pill--success' : 'dashboard-pill--danger'}`} style={{ fontSize: '10px' }}>
                          {log.status === 'Success' ? '✓' : '✗'} {log.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: log.records > 0 ? '#1e293b' : '#94a3b8' }}>{log.records > 0 ? log.records : '—'}</td>
                      <td style={{ fontSize: '11px', color: log.error ? '#dc2626' : '#94a3b8' }}>{log.error || 'OK'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Webhooks ── */}
        {activeSection === 'webhooks' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-code" /> Webhooks</h4>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Register HTTPS endpoints to receive real-time event notifications from UPRECRUIT. All payloads are signed with HMAC-SHA256.</p>

            <div className="user-management__card-form" style={{ marginBottom: '24px' }}>
              <h5>Register Webhook</h5>
              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} onSubmit={addWebhook}>
                <div>
                  <label className="fo-label">Webhook Name</label>
                  <input className="fo-input" required placeholder="e.g. New Hire Trigger" value={wForm.name} onChange={(e) => setWForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="fo-label">Event</label>
                  <select className="fo-input" value={wForm.event} onChange={(e) => setWForm((p) => ({ ...p, event: e.target.value }))}>
                    {WEBHOOK_EVENTS.map((ev) => <option key={ev}>{ev}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="fo-label">Endpoint URL (https://)</label>
                  <input className="fo-input" required type="url" placeholder="https://your-system.com/webhook" value={wForm.url} onChange={(e) => setWForm((p) => ({ ...p, url: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn btn-primary btn-sm"><i className="fa fa-plus" /> Register Webhook</button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {webhooks.map((wh) => (
                <div key={wh.id} style={{ background: '#fff', border: `1px solid ${wh.active ? '#86efac' : '#e2e8f0'}`, borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13px' }}>{wh.name}</strong>
                      <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 700, marginLeft: '8px' }}>{wh.event}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className={`dashboard-pill ${wh.active ? 'dashboard-pill--success' : 'dashboard-pill--secondary'}`} style={{ fontSize: '10px' }}>{wh.active ? 'Active' : 'Inactive'}</span>
                      <button type="button" className={`btn btn-sm ${wh.active ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => toggleWebhook(wh.id)}>{wh.active ? 'Disable' : 'Enable'}</button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteWebhook(wh.id)}><i className="fa fa-trash" /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', background: '#f8fafc', borderRadius: '4px', padding: '4px 8px' }}>{wh.url}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>Last fired: {wh.lastFired}</div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseIntegrations;
