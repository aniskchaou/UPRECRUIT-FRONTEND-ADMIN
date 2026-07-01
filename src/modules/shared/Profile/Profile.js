import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CurrentUser from '../../../main/config/user';

const getUser = () => {
  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) return parsed;
    }
  } catch (e) { /* ignore */ }
  return CurrentUser.USER_DETAIL || {};
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const INFO_FIELDS = [
  { label: 'Username / Email', key: 'username', icon: 'fa-envelope' },
  { label: 'Role', key: 'role', icon: 'fa-shield' },
  { label: 'Member since', key: 'createdAt', icon: 'fa-calendar', format: (v) => v ? new Date(v).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
  { label: 'Last updated', key: 'updatedAt', icon: 'fa-clock-o', format: (v) => v ? new Date(v).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
];

const STAT_ITEMS = [
  { label: 'Applications', icon: 'fa-file-text', color: '#6366f1', value: '—' },
  { label: 'Interviews', icon: 'fa-calendar-check-o', color: '#059669', value: '—' },
  { label: 'Notifications', icon: 'fa-bell', color: '#f59e0b', value: '—' },
];

const Profile = () => {
  const user = getUser();
  const displayName = user.fullName || user.username || user.email || 'Admin User';
  const initials = getInitials(displayName);
  const role = user.role || 'Administrator';
  const email = user.username || user.email || '—';
  const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#059669', '#0ea5e9'];
  const avatarBg = avatarColors[(displayName.charCodeAt(0) || 0) % avatarColors.length];

  const [editMode, setEditMode] = useState(false);
  const [formName, setFormName] = useState(displayName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '0 0 32px' }}>

      {/* ── Cover + Avatar ── */}
      <div style={{ position: 'relative', marginBottom: '72px' }}>
        {/* Cover banner */}
        <div style={{
          height: '180px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* decorative shapes */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99,102,241,0.3)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(139,92,246,0.25)', filter: 'blur(30px)' }} />
        </div>

        {/* Avatar */}
        <div style={{
          position: 'absolute',
          bottom: '-52px',
          left: '32px',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          background: avatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 800,
          color: '#fff',
          border: '4px solid #fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          letterSpacing: '-0.02em',
        }}>
          {initials}
        </div>

        {/* Edit / Save button */}
        <div style={{ position: 'absolute', bottom: '-46px', right: '24px', display: 'flex', gap: '8px' }}>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              <i className="fa fa-check" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: editMode ? '#6366f1' : '#fff',
              color: editMode ? '#fff' : '#374151',
              border: `1.5px solid ${editMode ? '#6366f1' : '#e2e8f0'}`,
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <i className={`fa ${editMode ? 'fa-save' : 'fa-pencil'}`} />
            {editMode ? 'Save profile' : 'Edit profile'}
          </button>
        </div>
      </div>

      {/* ── Name + Role ── */}
      <div style={{ padding: '0 32px 24px' }}>
        {editMode ? (
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', border: '1.5px solid #6366f1', borderRadius: '8px', padding: '6px 12px', outline: 'none', marginBottom: '4px', width: '320px' }}
          />
        ) : (
          <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{formName}</h2>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {role}
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>{email}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 24px' }}>

        {/* ── Account info card ── */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-info-circle" style={{ color: '#7c3aed', fontSize: '14px' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Account details</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {INFO_FIELDS.map(({ label, key, icon, format }) => {
              const rawVal = user[key];
              const displayVal = format ? format(rawVal) : (rawVal || '—');
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa ${icon}`} style={{ color: '#94a3b8', fontSize: '13px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500, wordBreak: 'break-all' }}>{displayVal}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Activity stats card ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-bar-chart" style={{ color: '#059669', fontSize: '14px' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Activity overview</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {STAT_ITEMS.map(({ label, icon, color, value }) => (
                <div key={label} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '10px', background: color + '0d', border: `1px solid ${color}20` }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <i className={`fa ${icon}`} style={{ color, fontSize: '15px' }} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{value}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security card */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-lock" style={{ color: '#d97706', fontSize: '14px' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Security</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Password', status: 'Set', icon: 'fa-key', ok: true },
                { label: '2-Factor Auth', status: 'Not enabled', icon: 'fa-mobile', ok: false },
                { label: 'Active session', status: 'Current device', icon: 'fa-check-circle', ok: true },
              ].map(({ label, status, icon, ok }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                    <i className={`fa ${icon}`} style={{ color: '#94a3b8', width: '14px' }} />
                    {label}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: ok ? '#059669' : '#d97706', background: ok ? '#f0fdf4' : '#fffbeb', borderRadius: '5px', padding: '2px 8px' }}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {};
Profile.defaultProps = {};

export default Profile;

