import React, { useState, useEffect } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ── Shared localStorage key (also read by EnterpriseSuperAdmin) ────────────────
export const BILLING_STORAGE_KEY = 'uprecruit_subscriptions';

const PLANS = [
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 399,
    annualPrice: 319,
    color: '#0ea5e9',
    icon: 'fa-star-o',
    description: 'For growing hiring teams that need core ATS features.',
    seats: 10,
    features: [
      'Up to 10 seats',
      'Core ATS & pipeline',
      'Job board posting',
      'Email & calendar sync',
      'Standard analytics',
      'Email support (48h SLA)',
    ],
    notIncluded: ['AI matching', 'White-label', 'SSO / SAML', 'Dedicated CSM'],
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 799,
    annualPrice: 639,
    color: '#3b82f6',
    icon: 'fa-star-half-o',
    popular: true,
    description: 'For established teams that need automation and deeper analytics.',
    seats: 25,
    features: [
      'Up to 25 seats',
      'All Professional features',
      'AI-powered job matching',
      'Advanced analytics & BI',
      'Candidate CRM',
      'Interview intelligence',
      'Priority support (12h SLA)',
    ],
    notIncluded: ['White-label', 'SSO / SAML', 'Dedicated CSM'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 1200,
    annualPrice: 960,
    color: '#8b5cf6',
    icon: 'fa-star',
    description: 'For large organisations needing full control, security, and customisation.',
    seats: 999,
    features: [
      'Unlimited seats',
      'All Business features',
      'White-label branding',
      'SSO / SAML / OIDC',
      'Custom AI configuration',
      'Dedicated CSM',
      'SLA 99.9% uptime',
      '1h emergency support',
    ],
    notIncluded: [],
  },
];

const BILLING_PERIODS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual',  label: 'Annual', badge: 'Save 20%' },
];

const SECTIONS = [
  { id: 'current',  label: 'Current Plan',  icon: 'fa-credit-card' },
  { id: 'upgrade',  label: 'Upgrade Plan',  icon: 'fa-arrow-up' },
  { id: 'invoices', label: 'Billing History', icon: 'fa-list-alt' },
];

// ── helpers ───────────────────────────────────────────────────────────────────

const loadSubscription = () => {
  try {
    const raw = localStorage.getItem(BILLING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveSubscription = (sub) => {
  localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(sub));
  // append to the super-admin ledger so EnterpriseSuperAdmin can pick it up
  const allKey = 'uprecruit_all_subscriptions';
  try {
    const all = JSON.parse(localStorage.getItem(allKey) || '[]');
    const idx = all.findIndex(s => s.tenantEmail === sub.tenantEmail);
    if (idx >= 0) all[idx] = sub; else all.push(sub);
    localStorage.setItem(allKey, JSON.stringify(all));
  } catch { /* ignore */ }
};

const nextRenewalDate = (period) => {
  const d = new Date();
  period === 'annual' ? d.setFullYear(d.getFullYear() + 1) : d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
};

// ── Component ─────────────────────────────────────────────────────────────────

const AdminBilling = () => {
  const [activeSection, setActiveSection] = useState('current');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [subscription, setSubscription] = useState(() => loadSubscription());
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [flash, setFlash] = useState({ type: '', msg: '' });

  // Checkout form — company & email only (card handled by Stripe)
  const [checkoutForm, setCheckoutForm] = useState({ companyName: '', billingEmail: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Re-read on mount (another tab might have updated)
    const sub = loadSubscription();
    if (sub) setSubscription(sub);

    // Handle Stripe redirect back to /billing?success=true&session_id=...
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const sessionId = params.get('session_id');
      setPaymentSuccess(true);
      setActiveSection('upgrade');
      setShowCheckout(true);

      if (sessionId) {
        // Confirm with backend and persist subscription
        fetch(`/api/billing/session/${sessionId}`)
          .then(r => r.json())
          .then(data => {
            if (data.plan) {
              const plan = PLANS.find(p => p.name.toLowerCase() === data.plan.toLowerCase());
              if (plan) {
                setSelectedPlan(plan);
                const period  = data.billingPeriod || 'monthly';
                const price   = period === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                const newSub = {
                  plan: plan.name,
                  planId: plan.id,
                  seats: plan.seats,
                  tenantName: data.companyName || checkoutForm.companyName || 'My Company',
                  tenantEmail: data.customerEmail || checkoutForm.billingEmail,
                  amount: price,
                  billingPeriod: period,
                  method: 'Stripe',
                  status: 'Active',
                  paidAt: new Date().toISOString().slice(0, 10),
                  nextRenewal: nextRenewalDate(period),
                  region: 'EU-West',
                  stripeSessionId: sessionId,
                };
                saveSubscription(newSub);
                setSubscription(newSub);
              }
            }
          })
          .catch(() => { /* session fetch failed — subscription still saved via webhook */ });
      }

      // Clean up URL query params
      window.history.replaceState({}, '', '/billing');
      msg('success', 'Payment successful! Your subscription is now active.');
    }

    if (params.get('cancelled') === 'true') {
      window.history.replaceState({}, '', '/billing');
      msg('warning', 'Checkout was cancelled. No charge was made.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const msg = (type, m) => {
    setFlash({ type, msg: m });
    setTimeout(() => setFlash({ type: '', msg: '' }), 4000);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
    setPaymentSuccess(false);
    setCheckoutForm({
      billingEmail: localStorage.getItem('currentUserEmail') || '',
      companyName: subscription?.tenantName || '',
    });
    setActiveSection('upgrade');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.name,
          billingPeriod,
          companyName: checkoutForm.companyName,
          email: checkoutForm.billingEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setIsProcessing(false);
      msg('error', `Payment error: ${err.message}`);
    }
  };

  const cancelSubscription = () => {
    const updated = { ...subscription, status: 'Cancelled', cancelledAt: new Date().toISOString().slice(0, 10) };
    saveSubscription(updated);
    setSubscription(updated);
    msg('warning', 'Subscription cancelled. Access continues until end of billing period.');
  };

  const planDetails = subscription ? PLANS.find(p => p.name === subscription.plan) : null;
  const billedHistory = subscription
    ? [{ id: 'latest', ...subscription, label: `${subscription.plan} Plan — ${subscription.billingPeriod}` }]
    : [];

  return (
    <div>
      {flash.msg && (
        <div className={`alert alert-${flash.type === 'success' ? 'success' : flash.type === 'warning' ? 'warning' : 'info'}`} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className={`fa ${flash.type === 'success' ? 'fa-check-circle' : flash.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`} />
          {flash.msg}
        </div>
      )}

      <div className="user-management">

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-credit-card" /><span>Billing & Plan</span></div>
        {SECTIONS.map(s => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => { setActiveSection(s.id); setShowCheckout(false); }}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}

        {/* Current plan mini-card */}
        {subscription && (
          <div style={{ margin: '12px 10px 0', background: (planDetails?.color || '#3b82f6') + '12', border: `1px solid ${planDetails?.color || '#3b82f6'}30`, borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Active Plan</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: planDetails?.color || '#3b82f6' }}>{subscription.plan}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>${subscription.amount}/mo · {subscription.seats === 999 ? 'Unlimited' : subscription.seats} seats</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>Renews {subscription.nextRenewal}</div>
          </div>
        )}
        {!subscription && (
          <div style={{ margin: '12px 10px 0', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <i className="fa fa-star-o" style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '4px', display: 'block' }} />
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>No active plan<br />Choose one to get started</div>
          </div>
        )}
      </aside>

      <main className="user-management__main">

        {/* ── Current Plan ── */}
        {activeSection === 'current' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-credit-card" /> Current Plan & Subscription</h4>

            {!subscription && (
              <div style={{ background: 'linear-gradient(135deg, #f8faff 0%, #fff 100%)', border: '2px dashed #c7d7fe', borderRadius: '20px', padding: '52px 48px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <i className="fa fa-rocket" style={{ fontSize: '30px', color: '#fff' }} />
                </div>
                <h5 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px', fontSize: '18px' }}>No active subscription</h5>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  You're on the free tier. Upgrade to unlock the full UPRECRUIT platform — AI matching, unlimited jobs, and priority support.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-primary" style={{ padding: '10px 22px', fontWeight: 700 }} onClick={() => setActiveSection('upgrade')}>
                    <i className="fa fa-arrow-up" /> View Plans & Upgrade
                  </button>
                  <button type="button" style={{ padding: '10px 18px', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }} onClick={() => setActiveSection('upgrade')}>
                    Compare Features
                  </button>
                </div>
                <div style={{ marginTop: '28px', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[['fa-check-circle', '#16a34a', 'No setup fees'], ['fa-lock', '#3b82f6', 'Cancel anytime'], ['fa-shield', '#8b5cf6', 'Stripe secured']].map(([ico, col, lbl]) => (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                      <i className={`fa ${ico}`} style={{ color: col }} />{lbl}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subscription && (
              <>
                {/* Plan banner */}
                <div style={{ background: `linear-gradient(135deg, ${planDetails?.color || '#3b82f6'}15, ${planDetails?.color || '#3b82f6'}05)`, border: `1.5px solid ${planDetails?.color || '#3b82f6'}30`, borderRadius: '16px', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: (planDetails?.color || '#3b82f6') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa ${planDetails?.icon || 'fa-star'}`} style={{ color: planDetails?.color || '#3b82f6', fontSize: '22px' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '20px', color: '#0f172a' }}>{subscription.plan} Plan</strong>
                        <span style={{ background: subscription.status === 'Active' ? '#16a34a18' : '#ef444418', color: subscription.status === 'Active' ? '#16a34a' : '#ef4444', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
                          {subscription.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        <strong style={{ fontSize: '22px', color: planDetails?.color || '#3b82f6' }}>${subscription.amount.toLocaleString()}</strong>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>/{subscription.billingPeriod === 'annual' ? 'mo (billed annually)' : 'month'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveSection('upgrade')}><i className="fa fa-arrow-up" /> Change Plan</button>
                    {subscription.status === 'Active' && <button type="button" className="btn btn-outline-danger btn-sm" onClick={cancelSubscription}><i className="fa fa-times" /> Cancel</button>}
                  </div>
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {[
                    ['fa-calendar', '#3b82f6', 'Next Renewal', subscription.nextRenewal],
                    ['fa-users', '#059669', 'Seats', subscription.seats === 999 ? 'Unlimited' : subscription.seats],
                    ['fa-credit-card', '#8b5cf6', 'Payment Method', `•••• ${subscription.cardLast4 || '****'}`],
                    ['fa-envelope', '#0ea5e9', 'Billing Email', subscription.tenantEmail],
                    ['fa-building', '#f59e0b', 'Company', subscription.tenantName],
                    ['fa-globe', '#64748b', 'Region', subscription.region],
                  ].map(([icon, color, label, value]) => (
                    <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <i className={`fa ${icon}`} style={{ color, fontSize: '11px' }} />
                        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', wordBreak: 'break-all' }}>{String(value)}</div>
                    </div>
                  ))}
                </div>

                {/* Included features */}
                {planDetails && (
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <h5 style={{ marginBottom: '10px' }}>What's included in {subscription.plan}</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {planDetails.features.map(f => (
                        <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                          <i className="fa fa-check" style={{ fontSize: '9px' }} />{f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Upgrade Plan ── */}
        {activeSection === 'upgrade' && !showCheckout && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-arrow-up" /> Choose Your Plan</h4>

            {/* Billing period toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              {BILLING_PERIODS.map(p => (
                <button key={p.id} type="button"
                  onClick={() => setBillingPeriod(p.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px', border: `1.5px solid ${billingPeriod === p.id ? '#3b82f6' : '#e2e8f0'}`, background: billingPeriod === p.id ? '#3b82f618' : '#fff', color: billingPeriod === p.id ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  {p.label}
                  {p.badge && <span style={{ background: '#16a34a', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700 }}>{p.badge}</span>}
                </button>
              ))}
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>All prices in USD</span>
            </div>

            {/* Plan cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {PLANS.map(plan => {
                const price = billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                const isCurrent = subscription?.plan === plan.name && subscription?.status === 'Active';
                return (
                  <div key={plan.id} style={{ background: '#fff', border: `2px solid ${plan.popular ? plan.color : isCurrent ? '#16a34a' : '#e2e8f0'}`, borderRadius: '16px', padding: '22px', position: 'relative', boxShadow: plan.popular ? `0 4px 24px ${plan.color}20` : 'none' }}>
                    {plan.popular && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', borderRadius: '20px', padding: '3px 14px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        Most Popular
                      </div>
                    )}
                    {isCurrent && (
                      <div style={{ position: 'absolute', top: '-12px', right: '16px', background: '#16a34a', color: '#fff', borderRadius: '20px', padding: '3px 10px', fontSize: '10px', fontWeight: 800 }}>
                        Current
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <i className={`fa ${plan.icon}`} style={{ color: plan.color, fontSize: '18px' }} />
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{plan.name}</strong>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '30px', fontWeight: 900, color: plan.color }}>${price.toLocaleString()}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>/mo</span>
                      {billingPeriod === 'annual' && <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>Billed annually (save 20%)</div>}
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>{plan.description}</p>
                    <div style={{ marginBottom: '16px' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#475569', marginBottom: '5px' }}>
                          <i className="fa fa-check" style={{ color: '#16a34a', fontSize: '10px', flexShrink: 0 }} />{f}
                        </div>
                      ))}
                      {plan.notIncluded.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px' }}>
                          <i className="fa fa-times" style={{ color: '#e2e8f0', fontSize: '10px', flexShrink: 0 }} />{f}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: isCurrent ? '#f1f5f9' : plan.color, color: isCurrent ? '#94a3b8' : '#fff', fontWeight: 700, fontSize: '13px', cursor: isCurrent ? 'default' : 'pointer', boxShadow: isCurrent ? 'none' : `0 3px 10px ${plan.color}40` }}>
                      {isCurrent ? 'Current Plan' : `Get ${plan.name} →`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Checkout ── */}
        {activeSection === 'upgrade' && showCheckout && selectedPlan && (
          <section className="user-management__section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setShowCheckout(false); setPaymentSuccess(false); }}>
                <i className="fa fa-arrow-left" /> Back to Plans
              </button>
              <h4 className="dashboard-section-heading" style={{ margin: 0 }}>
                <i className="fa fa-lock" /> Secure Checkout
              </h4>
            </div>

            {paymentSuccess ? (
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <i className="fa fa-check" style={{ color: '#fff', fontSize: '28px' }} />
                </div>
                <h4 style={{ color: '#15803d', marginBottom: '8px' }}>Payment Successful!</h4>
                <p style={{ color: '#16a34a', fontSize: '14px', marginBottom: '16px' }}>
                  <strong>{selectedPlan.name} Plan</strong> is now active. A confirmation has been sent to {checkoutForm.billingEmail}.
                </p>
                <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#166534', marginBottom: '20px' }}>
                  ${(billingPeriod === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice).toLocaleString()} charged · Next renewal: {nextRenewalDate(billingPeriod)}
                </div>
                <button type="button" className="btn btn-success" onClick={() => { setActiveSection('current'); setShowCheckout(false); }}>
                  <i className="fa fa-dashboard" /> Go to My Plan
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '24px', maxWidth: '860px' }}>

                {/* Order summary */}
                <div style={{ background: `linear-gradient(135deg, ${selectedPlan.color}15, ${selectedPlan.color}05)`, border: `1.5px solid ${selectedPlan.color}30`, borderRadius: '16px', padding: '22px', alignSelf: 'flex-start' }}>
                  <h5 style={{ marginBottom: '14px' }}>Order Summary</h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                    <span>Plan</span><strong style={{ color: selectedPlan.color }}>{selectedPlan.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                    <span>Billing</span><strong>{billingPeriod === 'annual' ? 'Annual' : 'Monthly'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                    <span>Seats</span><strong>{selectedPlan.seats === 999 ? 'Unlimited' : selectedPlan.seats}</strong>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#16a34a' }}>
                      <span>Annual discount</span><strong>-20%</strong>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700 }}>Total / mo</span>
                    <strong style={{ fontSize: '18px', color: selectedPlan.color }}>
                      ${(billingPeriod === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice).toLocaleString()}
                    </strong>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
                      Billed annually: ${(selectedPlan.annualPrice * 12).toLocaleString()}/yr
                    </div>
                  )}

                  <div style={{ marginTop: '14px', background: '#fff', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#64748b' }}>
                    <i className="fa fa-lock" style={{ color: '#16a34a', marginRight: '4px' }} />
                    256-bit SSL encrypted payment. Powered by Stripe.
                  </div>
                </div>

                {/* Payment form — Stripe redirect */}
                <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
                  <h5 style={{ marginBottom: '6px' }}>Complete Your Purchase</h5>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '18px' }}>
                    You'll be redirected to <strong>Stripe's secure checkout</strong> to enter your card details.
                  </p>

                  <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Company Name</label>
                      <input name="companyName" required value={checkoutForm.companyName} onChange={handleFormChange}
                        placeholder="Acme Corp" className="fo-input" style={{ width: '100%', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Billing Email</label>
                      <input name="billingEmail" required type="email" value={checkoutForm.billingEmail} onChange={handleFormChange}
                        placeholder="billing@company.com" className="fo-input" style={{ width: '100%', boxSizing: 'border-box' }} />
                    </div>

                    {/* Stripe badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#64748b' }}>
                      <i className="fa fa-lock" style={{ color: '#635bff', fontSize: '14px' }} />
                      <span>Card details are entered securely on <strong style={{ color: '#635bff' }}>Stripe's</strong> hosted page — we never see your card number.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      style={{ padding: '13px', borderRadius: '10px', border: 'none', background: isProcessing ? '#94a3b8' : '#635bff', color: '#fff', fontWeight: 800, fontSize: '15px', cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isProcessing ? 'none' : '0 4px 14px #635bff50', letterSpacing: '-0.01em' }}>
                      {isProcessing
                        ? <><i className="fa fa-spinner fa-spin" /> Redirecting to Stripe…</>
                        : <><i className="fa fa-lock" /> Pay ${(billingPeriod === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice).toLocaleString()} with Stripe</>}
                    </button>
                    <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                      By paying you agree to our Terms of Service. You can cancel at any time.
                    </p>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Billing History ── */}
        {activeSection === 'invoices' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-list-alt" /> Billing History</h4>
            {billedHistory.length === 0 ? (
              <div style={{ background: '#fff', border: '1px dashed #e2e8f0', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: '#f8fafc', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '1px solid #e2e8f0' }}>
                  <i className="fa fa-file-text-o" style={{ fontSize: '24px', color: '#94a3b8' }} />
                </div>
                <h5 style={{ color: '#475569', marginBottom: '6px' }}>No invoices yet</h5>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Subscribe to a plan to generate your first invoice.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{billedHistory.length} invoice{billedHistory.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="user-management__table-wrapper">
                  <table className="user-management__table">
                    <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Billing</th><th>Method</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {billedHistory.map(inv => (
                        <tr key={inv.id}>
                          <td style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>{inv.paidAt}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>{inv.plan} Plan</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{inv.tenantName}</div>
                          </td>
                          <td style={{ fontWeight: 800, color: '#16a34a', fontSize: '14px' }}>${inv.amount.toLocaleString()}</td>
                          <td><span style={{ background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize' }}>{inv.billingPeriod}</span></td>
                          <td style={{ fontSize: '12px', color: '#475569' }}><i className="fa fa-lock" style={{ color: '#635bff', marginRight: '4px', fontSize: '10px' }} />{inv.method}</td>
                          <td><span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}><i className="fa fa-check" style={{ marginRight: '3px', fontSize: '9px' }} />Paid</span></td>
                          <td>
                            <button type="button" className="btn btn-outline-secondary btn-sm" style={{ fontSize: '11px' }}
                              onClick={() => msg('success', `Receipt for ${inv.plan} plan — $${inv.amount} — downloaded.`)}>
                              <i className="fa fa-download" /> Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}
      </main>
      </div>
    </div>
  );
};

export default AdminBilling;
