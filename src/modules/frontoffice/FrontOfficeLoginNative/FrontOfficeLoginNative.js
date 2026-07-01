import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CurrentUser from '../../../main/config/user';
import userHTTPService from '../../../main/services/userHTTPService';
import recruiterHTTPService from '../../../main/services/recruiterHTTPService';
import FrontOfficeLayout from '../shared/FrontOfficeLayout';
import useSeo from '../shared/useSeo';

// ─── Portal definitions (3 top-level portals) ─────────────────────────────────

const PORTALS = [
  {
    id: 'backoffice',
    label: 'Back-Office',
    icon: 'fa-lock',
    color: '#dc2626',
    description: 'Admin & HR team workspace',
    detail: 'For Admins, HR Managers and HR Staff.',
    email: 'admin@uprecruit.com',
    password: 'Admin@2026',
  },
  {
    id: 'recruiter',
    label: 'Recruiter Portal',
    icon: 'fa-briefcase',
    color: '#7c3aed',
    description: 'Talent acquisition teams',
    detail: 'For Lead Recruiters and Recruiters.',
    email: 'omar.nasser@uprecruit.com',
    password: 'Recruiter2@2026',
  },
  {
    id: 'member',
    label: 'Member Portal',
    icon: 'fa-user',
    color: '#059669',
    description: 'Job seekers & candidates',
    detail: 'For Job Seekers and Candidates.',
    email: 'sara.benali@uprecruit.com',
    password: 'Member@2026',
  },
];

const FrontOfficeLoginNative = () => {
  const history = useHistory();
  const location = useLocation();
  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect');
  }, [location.search]);

  const [selectedPortal, setSelectedPortal] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const connected = localStorage.getItem('connected') === 'true';
    const role = localStorage.getItem('frontofficeRole');
    if (connected) {
      history.replace(role === 'recruiter' ? '/frontoffice/recruiter' : '/frontoffice/member');
    }
  }, [history]);

  useEffect(() => {
    const adminConnected = localStorage.getItem('adminConnected') === 'true';
    if (adminConnected) {
      history.replace('/dashboard');
    }
  }, [history]);

  useSeo('UPRECRUIT Login', 'Sign in to your workspace portal.');

  const selectPortal = (portal) => {
    setSelectedPortal(portal);
    setCredentials({ email: portal.email, password: portal.password });
    setFeedbackMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting || !selectedPortal) return;

    setIsSubmitting(true);
    setFeedbackMessage('');

    const { id } = selectedPortal;

    if (id === 'backoffice') {
      userHTTPService.login({ username: credentials.email, password: credentials.password })
        .then((response) => {
          const payload = response && response.data ? response.data : {};
          if (!Object.keys(payload).length) {
            setFeedbackMessage('Invalid credentials. Please check your email and password.');
            return;
          }
          CurrentUser.USER_DETAIL = payload;
          localStorage.setItem('adminConnected', 'true');
          localStorage.setItem('currentUser', JSON.stringify(payload));
          history.replace('/dashboard');
        })
        .catch((error) => {
          const msg = error && error.response && error.response.data && error.response.data.message;
          setFeedbackMessage(msg || 'Login failed. Please try again.');
        })
        .finally(() => setIsSubmitting(false));
      return;
    }

    if (id === 'recruiter') {
      recruiterHTTPService.login({ email: credentials.email, password: credentials.password })
        .then((response) => {
          const payload = response && response.data ? response.data : {};
          if (!Object.keys(payload).length) {
            setFeedbackMessage('Invalid credentials. Please check your email and password.');
            return;
          }
          CurrentUser.CONNECTED_USER = true;
          CurrentUser.USER_DETAIL = payload;
          localStorage.setItem('connected', 'true');
          localStorage.setItem('frontofficeRole', 'recruiter');
          localStorage.setItem('currentUser', JSON.stringify(payload));
          history.replace(redirect || '/frontoffice/recruiter');
        })
        .catch((error) => {
          const msg = error && error.response && error.response.data && error.response.data.message;
          setFeedbackMessage(msg || 'Login failed. Please try again.');
        })
        .finally(() => setIsSubmitting(false));
      return;
    }

    // Member portal
    userHTTPService.login({ username: credentials.email, password: credentials.password })
      .then((response) => {
        const payload = response && response.data ? response.data : {};
        if (!Object.keys(payload).length) {
          setFeedbackMessage('Invalid credentials. Please check your email and password.');
          return;
        }
        CurrentUser.CONNECTED_USER = true;
        CurrentUser.USER_DETAIL = payload;
        localStorage.setItem('connected', 'true');
        localStorage.setItem('frontofficeRole', 'jobseeker');
        localStorage.setItem('currentUser', JSON.stringify(payload));
        history.replace(redirect || '/frontoffice/member');
      })
      .catch((error) => {
        const msg = error && error.response && error.response.data && error.response.data.message;
        setFeedbackMessage(msg || 'Login failed. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  };

  const portal = selectedPortal;

  return (
    <FrontOfficeLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)', background: '#f8fafc' }}>

        {/* ── Left Brand Panel ── */}
        <aside style={{
          width: '42%',
          background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0c1464 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 44px',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(99,102,241,0.18)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(236,72,153,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-bolt" style={{ color: '#fff', fontSize: '16px' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>UPRECRUIT</span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Where great<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hires happen</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '36px', maxWidth: '320px' }}>
              One platform for every recruitment role -- from job seeker to enterprise admin.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '44px' }}>
              {[
                ['fa-bolt', '#818cf8', 'AI-powered job matching & scoring'],
                ['fa-shield', '#34d399', 'Enterprise-grade security & SSO'],
                ['fa-bar-chart', '#f472b6', 'Real-time analytics & reports'],
                ['fa-users', '#60a5fa', 'Collaborative hiring pipelines'],
              ].map(([icon, color, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa ${icon}`} style={{ color, fontSize: '12px' }} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              {[['50k+', 'Candidates'], ['2.4k+', 'Companies'], ['98%', 'Satisfaction']].map(([val, lbl], i) => (
                <div key={lbl} style={{ flex: 1, padding: '16px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{val}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right Login Panel ── */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>

            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>Welcome back</h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Choose your workspace portal to sign in.</p>
            </div>

            {/* 3 Portal Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {PORTALS.map(p => {
                const isSelected = portal && portal.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPortal(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: isSelected ? p.color + '0d' : '#fff',
                      border: `2px solid ${isSelected ? p.color : '#e2e8f0'}`,
                      borderRadius: '14px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? `0 4px 20px ${p.color}20` : 'none',
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isSelected ? p.color : p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                      <i className={`fa ${p.icon}`} style={{ color: isSelected ? '#fff' : p.color, fontSize: '18px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? p.color : '#1e293b', marginBottom: '2px' }}>{p.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{p.detail}</div>
                    </div>
                    {isSelected && <i className="fa fa-check-circle" style={{ color: p.color, fontSize: '18px' }} />}
                  </button>
                );
              })}
            </div>

            {/* Login Form */}
            <div style={{ maxHeight: portal ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
              {portal && (
                <div style={{ background: '#fff', border: `1.5px solid ${portal.color}30`, borderRadius: '14px', padding: '22px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: portal.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fa ${portal.icon}`} style={{ color: portal.color, fontSize: '15px' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                        Sign in to <span style={{ color: portal.color }}>{portal.label}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Demo credentials pre-filled</div>
                    </div>
                    <button type="button" onClick={() => setSelectedPortal(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px', padding: '4px' }}>
                      <i className="fa fa-times" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }} htmlFor="login-email">
                        Email / Username
                      </label>
                      <input
                        id="login-email"
                        type="text"
                        name="email"
                        required
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '9px', padding: '10px 14px', fontSize: '13px', color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => { e.target.style.borderColor = portal.color; e.target.style.background = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }} htmlFor="login-password">
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          required
                          value={credentials.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '9px', padding: '10px 40px 10px 14px', fontSize: '13px', color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => { e.target.style.borderColor = portal.color; e.target.style.background = '#fff'; }}
                          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                        />
                        <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </button>
                      </div>
                    </div>

                    <div style={{ background: portal.color + '08', border: `1px solid ${portal.color}25`, borderRadius: '8px', padding: '9px 12px', fontSize: '11px' }}>
                      <div style={{ fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.08em' }}>Demo Account</div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#475569' }}>
                        <code style={{ color: portal.color, fontWeight: 600 }}>{portal.email}</code>
                        <code style={{ color: portal.color, fontWeight: 600 }}>{portal.password}</code>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        background: isSubmitting ? '#94a3b8' : portal.color,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: isSubmitting ? 'none' : `0 4px 12px ${portal.color}40`,
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSubmitting
                        ? <><i className="fa fa-spinner fa-spin" /> Signing in...</>
                        : <><i className={`fa ${portal.icon}`} /> Sign in to {portal.label}</>}
                    </button>

                    {feedbackMessage && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa fa-exclamation-circle" />
                        {feedbackMessage}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Bottom links */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                New job seeker?{' '}
                <Link to="/frontoffice/register" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Create your account</Link>
              </p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                <i className="fa fa-building" style={{ marginRight: '5px', color: '#8b5cf6' }} />
                Are you a company?{' '}
                <Link to="/frontoffice/company-register" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none' }}>Register your company</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </FrontOfficeLayout>
  );
};

export default FrontOfficeLoginNative;
