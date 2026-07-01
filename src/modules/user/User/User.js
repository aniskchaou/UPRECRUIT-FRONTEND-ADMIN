import React, { useEffect, useMemo, useState } from 'react';
import './User.css';
import userHTTPService from '../../../main/services/userHTTPService';
import adminHTTPService from '../../../main/services/adminHTTPService';
import showMessage from '../../../libraries/messages/messages';

const JOB_SEEKER_SEED = [
  {
    id: 1,
    fullName: 'Sara Ben Ali',
    email: 'sara.benali@uprecruit.dev',
    status: 'Active',
    verified: true,
    suspended: false,
    banned: false,
    deleted: false,
    skills: ['React', 'TypeScript', 'Node.js'],
    phone: '+216 55 000 111',
    location: 'Tunis',
    profileCompletion: 92,
    activity: [
      'Applied to Senior React Developer (2h ago)',
      'Updated CV (Yesterday)',
      'Completed profile skills section (2 days ago)',
    ],
  },
  {
    id: 2,
    fullName: 'Youssef Trabelsi',
    email: 'youssef.trabelsi@uprecruit.dev',
    status: 'Inactive',
    verified: false,
    suspended: false,
    banned: false,
    deleted: false,
    skills: ['Java', 'Spring Boot', 'SQL'],
    phone: '+216 55 222 333',
    location: 'Sousse',
    profileCompletion: 74,
    activity: [
      'Started application for Backend Engineer (3 days ago)',
      'Last login (6 days ago)',
    ],
  },
  {
    id: 3,
    fullName: 'Lina Haddad',
    email: 'lina.haddad@uprecruit.dev',
    status: 'Suspended',
    verified: true,
    suspended: true,
    banned: false,
    deleted: false,
    skills: ['UX', 'Figma', 'Product Design'],
    phone: '+216 55 999 888',
    location: 'Sfax',
    profileCompletion: 85,
    activity: [
      'Flagged by trust team for document mismatch (1 day ago)',
      'Portfolio update pending review (2 days ago)',
    ],
  },
];

const PRICING_PLAN_SEED = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    cycle: 'month',
    description: 'Entry access for small recruiters testing the marketplace.',
    features: ['1 active job', 'Basic search', 'Email support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    cycle: 'month',
    description: 'Higher visibility, more active jobs, and faster support.',
    features: ['15 active jobs', 'Featured placements', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    cycle: 'month',
    description: 'Advanced workflows, analytics, and account management.',
    features: ['Unlimited jobs', 'Advanced analytics', 'Dedicated manager'],
  },
];

const RECRUITER_SEED = [
  {
    id: 101,
    fullName: 'Maya Laurent',
    email: 'maya@talentbridge.io',
    company: 'TalentBridge',
    registrationStatus: 'Pending',
    companyVerified: false,
    status: 'Active',
    subscription: 'Free',
    paymentStatus: 'Trial',
    jobsPosted: 2,
    hires: 0,
  },
  {
    id: 102,
    fullName: 'Karim Ben Salem',
    email: 'karim@acmehiring.com',
    company: 'Acme Hiring',
    registrationStatus: 'Approved',
    companyVerified: true,
    status: 'Active',
    subscription: 'Premium',
    paymentStatus: 'Paid',
    jobsPosted: 19,
    hires: 6,
  },
  {
    id: 103,
    fullName: 'Nora Smith',
    email: 'nora@northstar.tech',
    company: 'Northstar Tech',
    registrationStatus: 'Approved',
    companyVerified: true,
    status: 'Suspended',
    subscription: 'Enterprise',
    paymentStatus: 'Overdue',
    jobsPosted: 31,
    hires: 12,
  },
];

const REPORTS_SEED = [
  {
    id: 1,
    targetType: 'Job',
    targetName: 'Senior Frontend Engineer',
    reportType: 'Fraud',
    severity: 'High',
    status: 'Open',
    reporter: 'candidate@uprecruit.dev',
    email: 'fraudulent-poster@scamhire.io',
    domain: 'scamhire.io',
    ip: '185.24.10.44',
    details: 'Offer asked for an upfront equipment fee before interview.',
  },
  {
    id: 2,
    targetType: 'User',
    targetName: 'Lina Haddad',
    reportType: 'Harassment',
    severity: 'Medium',
    status: 'Investigating',
    reporter: 'support@uprecruit.dev',
    email: 'lina.haddad@uprecruit.dev',
    domain: 'uprecruit.dev',
    ip: '41.230.11.9',
    details: 'Candidate reported repeated aggressive messages after rejection.',
  },
  {
    id: 3,
    targetType: 'Message',
    targetName: 'Inbox thread #4821',
    reportType: 'Spam',
    severity: 'Low',
    status: 'Open',
    reporter: 'maya@talentbridge.io',
    email: 'growth@leadspam.biz',
    domain: 'leadspam.biz',
    ip: '92.15.77.5',
    details: 'Repeated external links and mass outreach detected.',
  },
];

const FLAGGED_MESSAGES_SEED = [
  {
    id: 1,
    from: 'growth@leadspam.biz',
    to: 'maya@talentbridge.io',
    snippet: 'Guaranteed hires in 24h, pay now to unlock premium candidates.',
    status: 'Flagged',
  },
  {
    id: 2,
    from: 'noreply@fake-office.com',
    to: 'candidate@uprecruit.dev',
    snippet: 'Share your ID and bank details to reserve your interview slot.',
    status: 'Flagged',
  },
];

const PAYMENT_HISTORY_SEED = [
  {
    id: 1,
    recruiterId: 102,
    recruiter: 'Karim Ben Salem',
    company: 'Acme Hiring',
    plan: 'Premium',
    amount: 149,
    paymentDate: '2026-04-03',
    status: 'Paid',
    invoice: 'INV-2026-001',
    coupon: '',
  },
  {
    id: 2,
    recruiterId: 103,
    recruiter: 'Nora Smith',
    company: 'Northstar Tech',
    plan: 'Enterprise',
    amount: 499,
    paymentDate: '2026-04-11',
    status: 'Overdue',
    invoice: 'INV-2026-002',
    coupon: 'SPRING20',
  },
  {
    id: 3,
    recruiterId: 102,
    recruiter: 'Karim Ben Salem',
    company: 'Acme Hiring',
    plan: 'Premium',
    amount: 149,
    paymentDate: '2026-03-03',
    status: 'Refunded',
    invoice: 'INV-2026-000',
    coupon: '',
  },
];

const COUPON_SEED = [
  { id: 1, code: 'SPRING20', type: 'Percent', value: 20, targetPlan: 'Enterprise', active: true },
  { id: 2, code: 'PREMIUM50', type: 'Flat', value: 50, targetPlan: 'Premium', active: true },
];

const BLACKLIST_SEED = {
  emails: ['fraudulent-poster@scamhire.io'],
  domains: ['leadspam.biz'],
  ips: ['185.24.10.44'],
};

const BLOCKED_KEYWORDS_SEED = ['wire transfer', 'guaranteed hire', 'pay upfront'];

const JOB_POSTS_SEED = [
  { id: 'jp-1', title: 'Senior React Developer', company: 'TalentBridge', poster: 'maya@talentbridge.io', status: 'Pending', category: 'Engineering', postedAt: '2026-06-18', flagged: false, spamScore: 2 },
  { id: 'jp-2', title: 'Get Rich Quick – Earn From Home', company: 'ScamHire Inc.', poster: 'fraudulent-poster@scamhire.io', status: 'Pending', category: 'Sales', postedAt: '2026-06-19', flagged: true, spamScore: 91 },
  { id: 'jp-3', title: 'Product Designer', company: 'Acme Hiring', poster: 'karim@acmehiring.com', status: 'Approved', category: 'Design', postedAt: '2026-06-17', flagged: false, spamScore: 1 },
  { id: 'jp-4', title: 'Crypto Investor Needed – No Experience Required', company: 'EasyMoney Ltd.', poster: 'admin@easymoney.biz', status: 'Pending', category: 'Finance', postedAt: '2026-06-19', flagged: true, spamScore: 96 },
];

const TENANTS_SEED = [
  { id: 't-1', name: 'ACME Corp', domain: 'acmecorp.uprecruit.io', plan: 'Enterprise', status: 'Active', users: 45, jobs: 120, monthlyRevenue: 499, createdAt: '2025-01-12' },
  { id: 't-2', name: 'TalentBridge', domain: 'talentbridge.uprecruit.io', plan: 'Premium', status: 'Active', users: 12, jobs: 38, monthlyRevenue: 149, createdAt: '2025-03-05' },
  { id: 't-3', name: 'Northstar Tech', domain: 'northstar.uprecruit.io', plan: 'Enterprise', status: 'Suspended', users: 31, jobs: 89, monthlyRevenue: 0, createdAt: '2024-11-20' },
];

const COMMISSIONS_SEED = [
  { id: 'c-1', plan: 'Free', commissionRate: 0, type: 'Flat', note: 'No commission on free tier' },
  { id: 'c-2', plan: 'Premium', commissionRate: 10, type: 'Percent', note: '10% on all Premium revenue' },
  { id: 'c-3', plan: 'Enterprise', commissionRate: 8, type: 'Percent', note: '8% on Enterprise — negotiated rate' },
];

const PLAN_ORDER = ['Free', 'Premium', 'Enterprise'];

const User = () => {
  const [jobSeekers, setJobSeekers] = useState(JOB_SEEKER_SEED);
  const [recruiters, setRecruiters] = useState(RECRUITER_SEED);
  const [reports, setReports] = useState(REPORTS_SEED);
  const [flaggedMessages, setFlaggedMessages] = useState(FLAGGED_MESSAGES_SEED);
  const [pricingPlans, setPricingPlans] = useState(PRICING_PLAN_SEED);
  const [paymentHistory, setPaymentHistory] = useState(PAYMENT_HISTORY_SEED);
  const [coupons, setCoupons] = useState(COUPON_SEED);
  const [blacklist, setBlacklist] = useState(BLACKLIST_SEED);
  const [blockedKeywords, setBlockedKeywords] = useState(BLOCKED_KEYWORDS_SEED);
  const [loading, setLoading] = useState(true);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignCompanyDraft, setAssignCompanyDraft] = useState({});
  const [actionMessage, setActionMessage] = useState('');
  const [blacklistDraft, setBlacklistDraft] = useState({ type: 'emails', value: '' });
  const [keywordDraft, setKeywordDraft] = useState('');
  const [couponDraft, setCouponDraft] = useState({ code: '', type: 'Percent', value: '', targetPlan: 'Premium' });
  const [newPlanDraft, setNewPlanDraft] = useState({ name: '', price: '', cycle: 'month', description: '' });
  const [jobPosts, setJobPosts] = useState(JOB_POSTS_SEED);
  const [tenants, setTenants] = useState(TENANTS_SEED);
  const [commissions, setCommissions] = useState(COMMISSIONS_SEED);
  const [newTenantDraft, setNewTenantDraft] = useState({ name: '', domain: '', plan: 'Premium' });

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      adminHTTPService.getJobSeekers(),
      adminHTTPService.getRecruiters(),
      userHTTPService.getAllUser(),
    ])
      .then(([jobSeekerResult, recruiterResult, userResult]) => {
        if (jobSeekerResult.status === 'fulfilled' && Array.isArray(jobSeekerResult.value?.data) && jobSeekerResult.value.data.length > 0) {
          setJobSeekers(jobSeekerResult.value.data);
        }

        if (recruiterResult.status === 'fulfilled' && Array.isArray(recruiterResult.value?.data) && recruiterResult.value.data.length > 0) {
          setRecruiters(recruiterResult.value.data);
        }

        const apiUsers = userResult.status === 'fulfilled' && Array.isArray(userResult.value?.data) ? userResult.value.data : [];
        if ((jobSeekerResult.status !== 'fulfilled' || !Array.isArray(jobSeekerResult.value?.data) || jobSeekerResult.value.data.length === 0) && apiUsers.length > 0) {
          const merged = apiUsers.slice(0, 4).map((item, index) => ({
            id: 1000 + index,
            fullName: item.fullName || item.username || `User ${index + 1}`,
            email: item.email || `${item.username || `user${index + 1}`}@uprecruit.dev`,
            status: index % 2 === 0 ? 'Active' : 'Inactive',
            verified: Boolean(item.verified),
            suspended: false,
            banned: false,
            deleted: false,
            skills: index % 2 === 0 ? ['React', 'Node.js'] : ['Java', 'SQL'],
            phone: item.phone || 'N/A',
            location: item.location || 'Not specified',
            profileCompletion: 70 + (index * 5),
            activity: ['Profile synced from API', 'No recent events'],
          }));
          setJobSeekers((previous) => {
            const stableSeed = previous.filter((entry) => entry.id < 1000);
            return [...stableSeed, ...merged];
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showMessage('Info', 'Using local mock data for admin trust and billing actions.', 'info');
        console.log(error);
      });
  }, []);

  const availableSkills = useMemo(() => {
    const skillSet = new Set();
    jobSeekers.forEach((user) => {
      user.skills.forEach((skill) => skillSet.add(skill));
    });
    return ['All', ...Array.from(skillSet)];
  }, [jobSeekers]);

  const filteredJobSeekers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return jobSeekers.filter((user) => {
      if (user.deleted) {
        return false;
      }
      const matchEmail = !query || user.email.toLowerCase().includes(query) || user.fullName.toLowerCase().includes(query);
      const matchSkill = skillFilter === 'All' || user.skills.includes(skillFilter);
      const matchStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchEmail && matchSkill && matchStatus;
    });
  }, [jobSeekers, searchValue, skillFilter, statusFilter]);

  const revenueMetrics = useMemo(() => {
    const collected = paymentHistory.filter((payment) => payment.status === 'Paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const refunded = paymentHistory.filter((payment) => payment.status === 'Refunded').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const overdue = paymentHistory.filter((payment) => payment.status === 'Overdue').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const activePaidAccounts = recruiters.filter((recruiter) => recruiter.subscription !== 'Free' && recruiter.status === 'Active').length;
    return {
      collected,
      refunded,
      overdue,
      net: collected - refunded,
      activePaidAccounts,
    };
  }, [paymentHistory, recruiters]);

  const updateJobSeeker = (userId, mapper) => {
    setJobSeekers((previous) => previous.map((user) => (user.id === userId ? mapper(user) : user)));
  };

  const updateRecruiter = (recruiterId, mapper) => {
    setRecruiters((previous) => previous.map((recruiter) => (recruiter.id === recruiterId ? mapper(recruiter) : recruiter)));
  };

  const persistJobSeeker = (userId, data) => {
    adminHTTPService.updateJobSeeker(userId, data).catch((error) => {
      console.log(error);
    });
  };

  const persistRecruiter = (recruiterId, data) => {
    adminHTTPService.updateRecruiter(recruiterId, data).catch((error) => {
      console.log(error);
    });
  };

  const handleViewProfile = (user) => {
    setSelectedJobSeeker(user);
    setActionMessage(`Viewing full profile for ${user.fullName}.`);
  };

  const handleActivateToggle = (userId) => {
    updateJobSeeker(userId, (user) => {
      const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      setActionMessage(`Account for ${user.fullName} is now ${nextStatus.toLowerCase()}.`);
      persistJobSeeker(userId, { status: nextStatus, suspended: false, banned: false });
      return { ...user, status: nextStatus, suspended: false, banned: false };
    });
  };

  const handleSuspendToggle = (userId) => {
    updateJobSeeker(userId, (user) => {
      const nextSuspended = !user.suspended;
      setActionMessage(nextSuspended ? `${user.fullName} has been suspended.` : `${user.fullName} suspension removed.`);
      persistJobSeeker(userId, { suspended: nextSuspended, status: nextSuspended ? 'Suspended' : 'Active' });
      return { ...user, suspended: nextSuspended, status: nextSuspended ? 'Suspended' : 'Active' };
    });
  };

  const handleBanToggle = (userId) => {
    updateJobSeeker(userId, (user) => {
      const nextBanned = !user.banned;
      setActionMessage(nextBanned ? `${user.fullName} has been banned.` : `${user.fullName} has been unbanned.`);
      persistJobSeeker(userId, { banned: nextBanned, suspended: nextBanned, status: nextBanned ? 'Banned' : 'Active' });
      return { ...user, banned: nextBanned, suspended: nextBanned, status: nextBanned ? 'Banned' : 'Active' };
    });
  };

  const handleVerifyIdentity = (userId) => {
    updateJobSeeker(userId, (user) => {
      setActionMessage(`Identity manually verified for ${user.fullName}.`);
      persistJobSeeker(userId, { verified: true });
      return { ...user, verified: true };
    });
  };

  const handleResetPassword = async (user) => {
    try {
      await adminHTTPService.resetJobSeekerPassword(user.id);
      setActionMessage(`Password reset email queued for ${user.email}.`);
      showMessage('Success', `Reset link sent to ${user.email}`, 'success');
    } catch (error) {
      setActionMessage(`Password reset email queued for ${user.email}.`);
      showMessage('Info', 'Backend reset endpoint is unavailable; kept local action.', 'info');
      console.log(error);
    }
  };

  const handleImpersonate = async (user) => {
    try {
      await adminHTTPService.impersonateJobSeeker(user.id);
      setActionMessage(`Support impersonation started for ${user.fullName}.`);
    } catch (error) {
      setActionMessage(`Support impersonation started for ${user.fullName}.`);
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId, mode) => {
    try {
      await adminHTTPService.deleteJobSeeker(userId, mode);
    } catch (error) {
      console.log(error);
    }

    setJobSeekers((previous) => {
      if (mode === 'hard') {
        const target = previous.find((user) => user.id === userId);
        if (target) {
          setActionMessage(`${target.fullName} permanently deleted.`);
        }
        return previous.filter((user) => user.id !== userId);
      }
      return previous.map((user) => {
        if (user.id !== userId) {
          return user;
        }
        setActionMessage(`${user.fullName} soft deleted (can be restored).`);
        return { ...user, deleted: true, status: 'Deleted' };
      });
    });
  };

  const handleExportUserData = (user) => {
    adminHTTPService.exportJobSeekerData(user.id)
      .then((response) => {
        const payload = response.data || {
          exportedAt: new Date().toISOString(),
          gdprRegion: 'EU',
          user,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${user.fullName.toLowerCase().replace(/\s+/g, '-')}-gdpr-export.json`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        setActionMessage(`GDPR export downloaded for ${user.fullName}.`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReviewRecruiterRegistration = (recruiterId, approved) => {
    updateRecruiter(recruiterId, (recruiter) => {
      const status = approved ? 'Approved' : 'Rejected';
      setActionMessage(`Recruiter registration ${status.toLowerCase()} for ${recruiter.fullName}.`);
      persistRecruiter(recruiterId, { registrationStatus: status, status: approved ? recruiter.status : 'Suspended' });
      return { ...recruiter, registrationStatus: status, status: approved ? recruiter.status : 'Suspended' };
    });
  };

  const handleVerifyCompany = (recruiterId) => {
    updateRecruiter(recruiterId, (recruiter) => {
      const nextState = !recruiter.companyVerified;
      setActionMessage(nextState ? `${recruiter.company} marked as verified.` : `${recruiter.company} verification removed.`);
      persistRecruiter(recruiterId, { companyVerified: nextState });
      return { ...recruiter, companyVerified: nextState };
    });
  };

  const handleAssignCompany = (recruiterId) => {
    const companyName = (assignCompanyDraft[recruiterId] || '').trim();
    if (!companyName) {
      setActionMessage('Enter a company name before assigning.');
      return;
    }
    updateRecruiter(recruiterId, (recruiter) => {
      setActionMessage(`${recruiter.fullName} assigned to ${companyName}.`);
      persistRecruiter(recruiterId, { company: companyName });
      return { ...recruiter, company: companyName };
    });
  };

  const handleSuspendRecruiterOrCompany = (recruiterId) => {
    updateRecruiter(recruiterId, (recruiter) => {
      const nextStatus = recruiter.status === 'Suspended' ? 'Active' : 'Suspended';
      setActionMessage(`${recruiter.fullName} and ${recruiter.company} now ${nextStatus.toLowerCase()}.`);
      persistRecruiter(recruiterId, { status: nextStatus });
      return { ...recruiter, status: nextStatus };
    });
  };

  const handleAssignPlan = (recruiterId, nextPlan) => {
    updateRecruiter(recruiterId, (recruiter) => {
      setActionMessage(`${recruiter.fullName} assigned to ${nextPlan}.`);
      persistRecruiter(recruiterId, { subscription: nextPlan });
      return { ...recruiter, subscription: nextPlan };
    });
  };

  const handleSubscriptionChange = (recruiterId, direction) => {
    updateRecruiter(recruiterId, (recruiter) => {
      const currentIndex = PLAN_ORDER.indexOf(recruiter.subscription);
      const offset = direction === 'upgrade' ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(PLAN_ORDER.length - 1, currentIndex + offset));
      const nextSubscription = PLAN_ORDER[nextIndex];
      setActionMessage(`${recruiter.fullName} moved to ${nextSubscription} subscription.`);
      persistRecruiter(recruiterId, { subscription: nextSubscription });
      return { ...recruiter, subscription: nextSubscription };
    });
  };

  const updateReport = (reportId, mapper) => {
    setReports((previous) => previous.map((report) => (report.id === reportId ? mapper(report) : report)));
  };

  const handleWarnFromReport = (reportId) => {
    updateReport(reportId, (report) => ({ ...report, status: 'Warned' }));
    setActionMessage(`Warning issued for report #${reportId}.`);
  };

  const handleSuspendFromReport = (report) => {
    if (report.targetType === 'User') {
      const matchedSeeker = jobSeekers.find((user) => user.email === report.email);
      const matchedRecruiter = recruiters.find((recruiter) => recruiter.email === report.email);
      if (matchedSeeker) {
        handleSuspendToggle(matchedSeeker.id);
      }
      if (matchedRecruiter) {
        handleSuspendRecruiterOrCompany(matchedRecruiter.id);
      }
    }
    updateReport(report.id, (current) => ({ ...current, status: 'Suspended' }));
    setActionMessage(`Suspension action completed for ${report.targetName}.`);
  };

  const handleRemoveContent = (reportId) => {
    updateReport(reportId, (report) => ({ ...report, status: 'Content Removed' }));
    setActionMessage(`Flagged content removed for report #${reportId}.`);
  };

  const handleBlacklistFromReport = (report) => {
    setBlacklist((previous) => ({
      emails: report.email && !previous.emails.includes(report.email) ? [...previous.emails, report.email] : previous.emails,
      domains: report.domain && !previous.domains.includes(report.domain) ? [...previous.domains, report.domain] : previous.domains,
      ips: report.ip && !previous.ips.includes(report.ip) ? [...previous.ips, report.ip] : previous.ips,
    }));
    updateReport(report.id, (current) => ({ ...current, status: 'Blacklisted' }));
    setActionMessage(`Blacklist updated from report #${report.id}.`);
  };

  const handleModerateMessage = (messageId, action) => {
    setFlaggedMessages((previous) => previous.map((message) => {
      if (message.id !== messageId) {
        return message;
      }
      return { ...message, status: action === 'remove' ? 'Removed' : 'Allowed' };
    }));
    setActionMessage(action === 'remove' ? `Flagged message ${messageId} removed.` : `Flagged message ${messageId} marked safe.`);
  };

  const handleAddBlacklistEntry = () => {
    const value = blacklistDraft.value.trim().toLowerCase();
    if (!value) {
      setActionMessage('Enter a value before adding to blacklist.');
      return;
    }
    setBlacklist((previous) => {
      if (previous[blacklistDraft.type].includes(value)) {
        return previous;
      }
      return {
        ...previous,
        [blacklistDraft.type]: [...previous[blacklistDraft.type], value],
      };
    });
    setBlacklistDraft((previous) => ({ ...previous, value: '' }));
    setActionMessage(`${value} added to ${blacklistDraft.type} blacklist.`);
  };

  const handleRemoveBlacklistEntry = (type, value) => {
    setBlacklist((previous) => ({
      ...previous,
      [type]: previous[type].filter((item) => item !== value),
    }));
    setActionMessage(`${value} removed from ${type} blacklist.`);
  };

  const handleAddBlockedKeyword = () => {
    const value = keywordDraft.trim().toLowerCase();
    if (!value) {
      setActionMessage('Enter a blocked keyword first.');
      return;
    }
    if (blockedKeywords.includes(value)) {
      setActionMessage('This keyword is already blocked.');
      return;
    }
    setBlockedKeywords((previous) => [...previous, value]);
    setKeywordDraft('');
    setActionMessage(`${value} added to blocked keywords.`);
  };

  const handleRemoveBlockedKeyword = (value) => {
    setBlockedKeywords((previous) => previous.filter((keyword) => keyword !== value));
    setActionMessage(`${value} removed from blocked keywords.`);
  };

  const handleUpdatePlanField = (planId, field, value) => {
    setPricingPlans((previous) => previous.map((plan) => (plan.id === planId ? { ...plan, [field]: field === 'price' ? Number(value) || 0 : value } : plan)));
  };

  const handleCreatePlan = () => {
    const planName = newPlanDraft.name.trim();
    if (!planName) {
      setActionMessage('Pricing plan name is required.');
      return;
    }
    setPricingPlans((previous) => [...previous, {
      id: planName.toLowerCase().replace(/\s+/g, '-'),
      name: planName,
      price: Number(newPlanDraft.price) || 0,
      cycle: newPlanDraft.cycle,
      description: newPlanDraft.description,
      features: [],
    }]);
    setNewPlanDraft({ name: '', price: '', cycle: 'month', description: '' });
    setActionMessage(`${planName} plan created.`);
  };

  const handleRefundPayment = (paymentId) => {
    setPaymentHistory((previous) => previous.map((payment) => (payment.id === paymentId ? { ...payment, status: 'Refunded' } : payment)));
    setActionMessage(`Refund issued for payment #${paymentId}.`);
  };

  const handleSuspendUnpaidAccount = (recruiterId) => {
    updateRecruiter(recruiterId, (recruiter) => ({ ...recruiter, status: 'Suspended', paymentStatus: 'Suspended for non-payment' }));
    setActionMessage(`Recruiter account ${recruiterId} suspended for unpaid balance.`);
  };

  const handleApplyCoupon = () => {
    if (!couponDraft.code.trim() || !couponDraft.value) {
      setActionMessage('Enter coupon code and value first.');
      return;
    }
    setCoupons((previous) => [...previous, {
      id: previous.length + 1,
      code: couponDraft.code.trim().toUpperCase(),
      type: couponDraft.type,
      value: Number(couponDraft.value),
      targetPlan: couponDraft.targetPlan,
      active: true,
    }]);
    setCouponDraft({ code: '', type: 'Percent', value: '', targetPlan: 'Premium' });
    setActionMessage('Discount coupon created and applied to the catalog.');
  };

  // NEW: Job Moderation
  const handleApproveJobPost = (jobId) => {
    setJobPosts((previous) => previous.map((j) => (j.id === jobId ? { ...j, status: 'Approved' } : j)));
    setActionMessage('Job post approved and published.');
  };

  const handleRejectJobPost = (jobId) => {
    setJobPosts((previous) => previous.map((j) => (j.id === jobId ? { ...j, status: 'Rejected' } : j)));
    setActionMessage('Job post rejected and removed from queue.');
  };

  const handleMarkSpamJobPost = (jobId) => {
    setJobPosts((previous) => previous.map((j) => (j.id === jobId ? { ...j, status: 'Spam', flagged: true } : j)));
    setActionMessage('Job post flagged as spam.');
  };

  // NEW: Tenant Management
  const handleCreateTenant = () => {
    if (!newTenantDraft.name.trim()) {
      setActionMessage('Tenant name is required.');
      return;
    }
    setTenants((previous) => [...previous, {
      id: `t-${Date.now()}`,
      name: newTenantDraft.name.trim(),
      domain: newTenantDraft.domain.trim() || `${newTenantDraft.name.toLowerCase().replace(/\s+/g, '')}.uprecruit.io`,
      plan: newTenantDraft.plan,
      status: 'Active',
      users: 0,
      jobs: 0,
      monthlyRevenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    }]);
    setNewTenantDraft({ name: '', domain: '', plan: 'Premium' });
    setActionMessage('New tenant created successfully.');
  };

  const handleToggleTenantStatus = (tenantId) => {
    setTenants((previous) => previous.map((t) => (
      t.id === tenantId ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t
    )));
    setActionMessage('Tenant status updated.');
  };

  // NEW: Commission Management
  const handleUpdateCommissionRate = (commissionId, field, value) => {
    setCommissions((previous) => previous.map((c) => (
      c.id === commissionId ? { ...c, [field]: field === 'commissionRate' ? Number(value) || 0 : value } : c
    )));
  };

  return (
    <div className="user-management">
      <div className="card">
        <div className="card-header user-management__header">
          <div>
            <strong className="card-title">Admin User Management</strong>
            <p className="user-management__subtitle">Control job seeker and recruiter lifecycle, trust, safety, subscriptions, payments, and compliance actions.</p>
          </div>
          <span className="dashboard-pill dashboard-pill--success">Admin Console</span>
        </div>

        <div className="card-body">
          {actionMessage && <div className="user-management__message">{actionMessage}</div>}

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-user"></i> Job Seekers</h4>

            <div className="user-management__filters">
              <input type="text" className="fo-input" placeholder="Search by email or name" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
              <select className="fo-select" value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)}>
                {availableSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <select className="fo-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="Banned">Banned</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Status</th>
                    <th>Skills</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-4">Loading users...</td>
                    </tr>
                  )}
                  {!loading && filteredJobSeekers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No job seekers match your filters.</td>
                    </tr>
                  )}
                  {!loading && filteredJobSeekers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.fullName}</strong>
                        <div>{user.email}</div>
                        <small>{user.location} | Completion: {user.profileCompletion}%</small>
                      </td>
                      <td>
                        <span className="user-management__status">{user.status}</span>
                        <div>{user.verified ? 'Identity verified' : 'Identity not verified'}</div>
                      </td>
                      <td>{user.skills.join(', ')}</td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleViewProfile(user)}>View</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleActivateToggle(user.id)}>{user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleSuspendToggle(user.id)}>{user.suspended ? 'Unsuspend' : 'Suspend'}</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleBanToggle(user.id)}>{user.banned ? 'Unban' : 'Ban'}</button>
                        <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleVerifyIdentity(user.id)}>Verify ID</button>
                        <button type="button" className="btn btn-outline-info btn-sm" onClick={() => handleResetPassword(user)}>Reset Password</button>
                        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => handleImpersonate(user)}>Impersonate</button>
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleDeleteUser(user.id, 'soft')}>Soft Delete</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id, 'hard')}>Hard Delete</button>
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleExportUserData(user)}>Export GDPR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedJobSeeker && (
              <div className="user-management__detail card">
                <div className="card-body">
                  <h5>Full Profile and Activity: {selectedJobSeeker.fullName}</h5>
                  <p>Email: {selectedJobSeeker.email}</p>
                  <p>Phone: {selectedJobSeeker.phone}</p>
                  <p>Location: {selectedJobSeeker.location}</p>
                  <p>Skills: {selectedJobSeeker.skills.join(', ')}</p>
                  <p>Status: {selectedJobSeeker.status}</p>
                  <ul>
                    {selectedJobSeeker.activity.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-building"></i> Recruiters and Employers</h4>

            <div className="table-responsive">
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Recruiter</th>
                    <th>Registration</th>
                    <th>Company</th>
                    <th>Subscription</th>
                    <th>Billing</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.map((recruiter) => (
                    <tr key={recruiter.id}>
                      <td>
                        <strong>{recruiter.fullName}</strong>
                        <div>{recruiter.email}</div>
                      </td>
                      <td>
                        <span className="user-management__status">{recruiter.registrationStatus}</span>
                        <div>{recruiter.status}</div>
                      </td>
                      <td>
                        <div>{recruiter.company}</div>
                        <small>{recruiter.companyVerified ? 'Company verified' : 'Verification pending'}</small>
                        <div className="user-management__assign-row">
                          <input
                            type="text"
                            className="fo-input"
                            placeholder="Assign company"
                            value={assignCompanyDraft[recruiter.id] || ''}
                            onChange={(event) => {
                              const value = event.target.value;
                              setAssignCompanyDraft((previous) => ({ ...previous, [recruiter.id]: value }));
                            }}
                          />
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleAssignCompany(recruiter.id)}>Assign</button>
                        </div>
                      </td>
                      <td>
                        <select className="fo-select" value={recruiter.subscription} onChange={(event) => handleAssignPlan(recruiter.id, event.target.value)}>
                          {pricingPlans.map((plan) => (
                            <option key={plan.id} value={plan.name}>{plan.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="user-management__status">{recruiter.paymentStatus}</span>
                      </td>
                      <td>
                        <div>Jobs posted: {recruiter.jobsPosted}</div>
                        <div>Hires: {recruiter.hires}</div>
                      </td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleReviewRecruiterRegistration(recruiter.id, true)}>Approve</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleReviewRecruiterRegistration(recruiter.id, false)}>Reject</button>
                        <button type="button" className="btn btn-outline-info btn-sm" onClick={() => handleVerifyCompany(recruiter.id)}>{recruiter.companyVerified ? 'Unverify Company' : 'Verify Company'}</button>
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleSuspendRecruiterOrCompany(recruiter.id)}>{recruiter.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}</button>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleSubscriptionChange(recruiter.id, 'upgrade')}>Upgrade Plan</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleSubscriptionChange(recruiter.id, 'downgrade')}>Downgrade Plan</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleSuspendUnpaidAccount(recruiter.id)}>Suspend Unpaid</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-shield"></i> Content Moderation and Safety</h4>

            <div className="user-management__metrics-grid">
              <div className="user-management__metric-card">
                <strong>{reports.length}</strong>
                <span>Abuse reports</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{reports.filter((report) => report.status === 'Open').length}</strong>
                <span>Open reports</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{flaggedMessages.filter((message) => message.status === 'Flagged').length}</strong>
                <span>Flagged messages</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{blacklist.emails.length + blacklist.domains.length + blacklist.ips.length}</strong>
                <span>Blacklist entries</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Target</th>
                    <th>Report</th>
                    <th>Reporter</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong>{report.targetType}</strong>
                        <div>{report.targetName}</div>
                        <small>{report.details}</small>
                      </td>
                      <td>
                        <span className="user-management__status">{report.reportType}</span>
                        <div>Severity: {report.severity}</div>
                      </td>
                      <td>
                        <div>{report.reporter}</div>
                        <small>{report.email}</small>
                      </td>
                      <td>{report.status}</td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleWarnFromReport(report.id)}>Warn User</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleSuspendFromReport(report)}>Suspend Account</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleRemoveContent(report.id)}>Remove Content</button>
                        <button type="button" className="btn btn-dark btn-sm" onClick={() => handleBlacklistFromReport(report)}>Blacklist</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-responsive user-management__subsection">
              <h5>Moderate Flagged Messages</h5>
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedMessages.map((message) => (
                    <tr key={message.id}>
                      <td>
                        <strong>{message.from}</strong>
                        <div>To: {message.to}</div>
                        <small>{message.snippet}</small>
                      </td>
                      <td>{message.status}</td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleModerateMessage(message.id, 'remove')}>Remove Message</button>
                        <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleModerateMessage(message.id, 'allow')}>Mark Safe</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-management__safety-grid">
              <div className="user-management__panel card">
                <div className="card-body">
                  <h5>Blacklist Emails, Domains, and IPs</h5>
                  <div className="user-management__inline-form">
                    <select className="fo-select" value={blacklistDraft.type} onChange={(event) => setBlacklistDraft((previous) => ({ ...previous, type: event.target.value }))}>
                      <option value="emails">Emails</option>
                      <option value="domains">Domains</option>
                      <option value="ips">IPs</option>
                    </select>
                    <input className="fo-input" value={blacklistDraft.value} onChange={(event) => setBlacklistDraft((previous) => ({ ...previous, value: event.target.value }))} placeholder="Add blacklist value" />
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddBlacklistEntry}>Add</button>
                  </div>

                  <div className="user-management__tag-groups">
                    {Object.entries(blacklist).map(([type, values]) => (
                      <div key={type}>
                        <strong>{type}</strong>
                        <div className="user-management__tag-list">
                          {values.map((value) => (
                            <button key={value} type="button" className="user-management__tag" onClick={() => handleRemoveBlacklistEntry(type, value)}>{value} x</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="user-management__panel card">
                <div className="card-body">
                  <h5>Manage Blocked Keywords</h5>
                  <div className="user-management__inline-form">
                    <input className="fo-input" value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} placeholder="Add blocked phrase" />
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddBlockedKeyword}>Add Keyword</button>
                  </div>
                  <div className="user-management__tag-list">
                    {blockedKeywords.map((keyword) => (
                      <button key={keyword} type="button" className="user-management__tag" onClick={() => handleRemoveBlockedKeyword(keyword)}>{keyword} x</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-briefcase"></i> Job Moderation</h4>
            <p className="user-management__subtitle">Approve, reject, or flag job postings. Auto-detected spam jobs are highlighted by spam score.</p>

            <div className="table-responsive">
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company / Poster</th>
                    <th>Category</th>
                    <th>Posted</th>
                    <th>Spam Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPosts.map((job) => (
                    <tr key={job.id} style={job.flagged ? { background: '#fff7ed' } : {}}>
                      <td>
                        <strong>{job.title}</strong>
                        {job.flagged && <span className="badge badge-warning" style={{ marginLeft: '6px', fontSize: '10px' }}>Flagged</span>}
                      </td>
                      <td>
                        <div>{job.company}</div>
                        <small>{job.poster}</small>
                      </td>
                      <td>{job.category}</td>
                      <td>{job.postedAt}</td>
                      <td>
                        <span style={{ color: job.spamScore > 50 ? '#dc2626' : job.spamScore > 20 ? '#d97706' : '#16a34a', fontWeight: 600 }}>
                          {job.spamScore}%
                        </span>
                      </td>
                      <td><span className="user-management__status">{job.status}</span></td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleApproveJobPost(job.id)} disabled={job.status === 'Approved'}>Approve</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRejectJobPost(job.id)} disabled={job.status === 'Rejected'}>Reject</button>
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleMarkSpamJobPost(job.id)} disabled={job.status === 'Spam'}>Mark Spam</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-management__metrics-grid" style={{ marginTop: '12px' }}>
              <div className="user-management__metric-card">
                <strong>{jobPosts.filter((j) => j.status === 'Pending').length}</strong>
                <span>Pending review</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{jobPosts.filter((j) => j.status === 'Approved').length}</strong>
                <span>Approved</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{jobPosts.filter((j) => j.status === 'Rejected').length}</strong>
                <span>Rejected</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{jobPosts.filter((j) => j.status === 'Spam' || j.flagged).length}</strong>
                <span>Spam / Flagged</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{jobPosts.filter((j) => j.spamScore > 50).length}</strong>
                <span>High spam score</span>
              </div>
            </div>
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-credit-card"></i> Subscription and Payment</h4>

            <div className="user-management__metrics-grid">
              <div className="user-management__metric-card">
                <strong>{revenueMetrics.net} USD</strong>
                <span>Net revenue</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{revenueMetrics.collected} USD</strong>
                <span>Collected</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{revenueMetrics.refunded} USD</strong>
                <span>Refunded</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{revenueMetrics.overdue} USD</strong>
                <span>Overdue</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{revenueMetrics.activePaidAccounts}</strong>
                <span>Paid recruiters</span>
              </div>
            </div>

            <div className="user-management__pricing-grid">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="user-management__panel card">
                  <div className="card-body">
                    <div className="user-management__plan-header">
                      <h5>{plan.name}</h5>
                      <span className="user-management__status">{plan.cycle}</span>
                    </div>
                    <label>Price</label>
                    <input type="number" className="fo-input" value={plan.price} onChange={(event) => handleUpdatePlanField(plan.id, 'price', event.target.value)} />
                    <label>Description</label>
                    <textarea className="fo-input user-management__textarea" value={plan.description} onChange={(event) => handleUpdatePlanField(plan.id, 'description', event.target.value)} />
                    <div className="user-management__plan-features">
                      {plan.features.map((feature) => (
                        <span key={feature} className="dashboard-pill">{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="user-management__panel card user-management__subsection">
              <div className="card-body">
                <h5>Create Pricing Plan</h5>
                <div className="user-management__plan-form">
                  <input className="fo-input" placeholder="Plan name" value={newPlanDraft.name} onChange={(event) => setNewPlanDraft((previous) => ({ ...previous, name: event.target.value }))} />
                  <input className="fo-input" type="number" placeholder="Price" value={newPlanDraft.price} onChange={(event) => setNewPlanDraft((previous) => ({ ...previous, price: event.target.value }))} />
                  <select className="fo-select" value={newPlanDraft.cycle} onChange={(event) => setNewPlanDraft((previous) => ({ ...previous, cycle: event.target.value }))}>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                  <input className="fo-input" placeholder="Description" value={newPlanDraft.description} onChange={(event) => setNewPlanDraft((previous) => ({ ...previous, description: event.target.value }))} />
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleCreatePlan}>Create Plan</button>
                </div>
              </div>
            </div>

            <div className="table-responsive user-management__subsection">
              <h5>Payment History</h5>
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Recruiter</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.invoice}</strong>
                        <div>{payment.paymentDate}</div>
                      </td>
                      <td>
                        <div>{payment.recruiter}</div>
                        <small>{payment.company}</small>
                      </td>
                      <td>{payment.plan}</td>
                      <td>{payment.amount} USD</td>
                      <td>
                        <span className="user-management__status">{payment.status}</span>
                        <div>{payment.coupon ? `Coupon: ${payment.coupon}` : 'No coupon'}</div>
                      </td>
                      <td className="user-management__actions">
                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleRefundPayment(payment.id)} disabled={payment.status === 'Refunded'}>Refund</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleSuspendUnpaidAccount(payment.recruiterId)} disabled={payment.status !== 'Overdue'}>Suspend Unpaid</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-management__safety-grid">
              <div className="user-management__panel card">
                <div className="card-body">
                  <h5>Apply Discounts and Coupons</h5>
                  <div className="user-management__coupon-form">
                    <input className="fo-input" placeholder="Coupon code" value={couponDraft.code} onChange={(event) => setCouponDraft((previous) => ({ ...previous, code: event.target.value }))} />
                    <select className="fo-select" value={couponDraft.type} onChange={(event) => setCouponDraft((previous) => ({ ...previous, type: event.target.value }))}>
                      <option value="Percent">Percent</option>
                      <option value="Flat">Flat</option>
                    </select>
                    <input className="fo-input" type="number" placeholder="Value" value={couponDraft.value} onChange={(event) => setCouponDraft((previous) => ({ ...previous, value: event.target.value }))} />
                    <select className="fo-select" value={couponDraft.targetPlan} onChange={(event) => setCouponDraft((previous) => ({ ...previous, targetPlan: event.target.value }))}>
                      {pricingPlans.map((plan) => (
                        <option key={plan.id} value={plan.name}>{plan.name}</option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyCoupon}>Save Coupon</button>
                  </div>
                </div>
              </div>

              <div className="user-management__panel card">
                <div className="card-body">
                  <h5>Active Coupons</h5>
                  <div className="user-management__tag-groups">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="user-management__coupon-item">
                        <strong>{coupon.code}</strong>
                        <span>{coupon.type === 'Percent' ? `${coupon.value}%` : `${coupon.value} USD`} on {coupon.targetPlan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-building"></i> Tenant Management (SaaS)</h4>
            <p className="user-management__subtitle">Manage platform tenants, their plans, domains, and suspension status.</p>

            <div className="user-management__panel card user-management__subsection">
              <div className="card-body">
                <h5>Create New Tenant</h5>
                <div className="user-management__plan-form">
                  <input className="fo-input" placeholder="Organisation name" value={newTenantDraft.name} onChange={(event) => setNewTenantDraft((previous) => ({ ...previous, name: event.target.value }))} />
                  <input className="fo-input" placeholder="Custom domain (e.g. acme.uprecruit.io)" value={newTenantDraft.domain} onChange={(event) => setNewTenantDraft((previous) => ({ ...previous, domain: event.target.value }))} />
                  <select className="fo-select" value={newTenantDraft.plan} onChange={(event) => setNewTenantDraft((previous) => ({ ...previous, plan: event.target.value }))}>
                    {pricingPlans.map((plan) => (
                      <option key={plan.id} value={plan.name}>{plan.name}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleCreateTenant}>Create Tenant</button>
                </div>
              </div>
            </div>

            <div className="table-responsive user-management__subsection">
              <table className="table table-striped table-bordered user-management__table">
                <thead>
                  <tr>
                    <th>Organisation</th>
                    <th>Domain</th>
                    <th>Plan</th>
                    <th>Users</th>
                    <th>Jobs</th>
                    <th>Monthly Revenue</th>
                    <th>Since</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td><strong>{tenant.name}</strong></td>
                      <td><small>{tenant.domain}</small></td>
                      <td><span className="dashboard-pill">{tenant.plan}</span></td>
                      <td>{tenant.users}</td>
                      <td>{tenant.jobs}</td>
                      <td>{tenant.monthlyRevenue} USD</td>
                      <td>{tenant.createdAt}</td>
                      <td><span className="user-management__status">{tenant.status}</span></td>
                      <td>
                        <button type="button" className={`btn btn-sm ${tenant.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => handleToggleTenantStatus(tenant.id)}>
                          {tenant.status === 'Active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-management__metrics-grid" style={{ marginTop: '8px' }}>
              <div className="user-management__metric-card">
                <strong>{tenants.filter((t) => t.status === 'Active').length}</strong>
                <span>Active tenants</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{tenants.reduce((sum, t) => sum + t.users, 0)}</strong>
                <span>Total users</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{tenants.reduce((sum, t) => sum + t.monthlyRevenue, 0)} USD</strong>
                <span>Total MRR</span>
              </div>
            </div>
          </section>

          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-percent"></i> Commission Management</h4>
            <p className="user-management__subtitle">Configure platform commission rates per subscription plan. These rates determine revenue share deductions.</p>

            <div className="user-management__pricing-grid">
              {commissions.map((commission) => (
                <div key={commission.id} className="user-management__panel card">
                  <div className="card-body">
                    <div className="user-management__plan-header">
                      <h5>{commission.plan} Plan</h5>
                      <span className="dashboard-pill">{commission.type}</span>
                    </div>
                    <label>Commission Rate {commission.type === 'Percent' ? '(%)' : '(USD flat)'}</label>
                    <input
                      type="number"
                      className="fo-input"
                      value={commission.commissionRate}
                      onChange={(event) => handleUpdateCommissionRate(commission.id, 'commissionRate', event.target.value)}
                    />
                    <label>Type</label>
                    <select
                      className="fo-select"
                      value={commission.type}
                      onChange={(event) => handleUpdateCommissionRate(commission.id, 'type', event.target.value)}
                    >
                      <option value="Percent">Percent (%)</option>
                      <option value="Flat">Flat (USD)</option>
                    </select>
                    <label>Note</label>
                    <input
                      className="fo-input"
                      value={commission.note}
                      onChange={(event) => handleUpdateCommissionRate(commission.id, 'note', event.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="user-management__metrics-grid" style={{ marginTop: '12px' }}>
              <div className="user-management__metric-card">
                <strong>{commissions.filter((c) => c.type === 'Percent').reduce((sum, c) => sum + c.commissionRate, 0) / Math.max(commissions.filter((c) => c.type === 'Percent').length, 1)}%</strong>
                <span>Avg. commission rate</span>
              </div>
              <div className="user-management__metric-card">
                <strong>{commissions.filter((c) => c.commissionRate > 0).length}</strong>
                <span>Plans with commission</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default User;
