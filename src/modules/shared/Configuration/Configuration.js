import React, { useEffect, useMemo, useState } from 'react';
import './Configuration.css';
import settingsHTTPService from '../../../main/services/settingsHTTPService';
import adminHTTPService from '../../../main/services/adminHTTPService';
import showMessage from '../../../libraries/messages/messages';

const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to UPRECRUIT',
    body: 'Hello {{name}}, your workspace is ready. Start posting jobs and connecting with candidates.',
  },
  {
    id: 'job-approved',
    name: 'Job Approved',
    subject: 'Your job post is live',
    body: 'Hi {{company}}, your job post {{jobTitle}} is now approved and published.',
  },
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    subject: 'Payment reminder for your plan',
    body: 'Hello {{name}}, your subscription payment is due on {{date}}. Please update billing to avoid suspension.',
  },
];

const DEFAULT_NOTIFICATION_TRIGGERS = [
  { id: 'new-application', label: 'New application submitted', enabled: true, channel: 'Email + In-app' },
  { id: 'job-expiry', label: 'Job expiry in 48 hours', enabled: true, channel: 'Email' },
  { id: 'abuse-report', label: 'Abuse report created', enabled: true, channel: 'In-app' },
  { id: 'payment-overdue', label: 'Payment overdue', enabled: true, channel: 'Email + SMS' },
  { id: 'ai-flag', label: 'AI decision flagged for review', enabled: false, channel: 'In-app' },
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Scheduled platform maintenance',
    audience: 'All users',
    status: 'Sent',
    sentAt: '2026-04-20 09:30',
  },
  {
    id: 2,
    title: 'Premium matching beta launch',
    audience: 'Recruiters',
    status: 'Draft',
    sentAt: '-',
  },
];

const DEFAULT_AI_CONTENT = [
  {
    id: 1,
    type: 'Job Summary',
    title: 'AI-generated summary for Senior Frontend Engineer',
    status: 'Pending',
    preview: 'Lead the frontend architecture for a fast-growing product team focused on user trust and performance.',
  },
  {
    id: 2,
    type: 'Candidate Outreach',
    title: 'AI-generated outreach for shortlisted candidates',
    status: 'Pending',
    preview: 'We matched your React and design systems experience to an enterprise-grade frontend leadership role.',
  },
];

const DEFAULT_FLAGGED_AI_DECISIONS = [
  {
    id: 1,
    area: 'Candidate Matching',
    decision: 'Rejected a strong TypeScript profile for missing Angular experience',
    reason: 'Weighting over-penalized secondary framework mismatch.',
    status: 'Open',
  },
  {
    id: 2,
    area: 'Content Generation',
    decision: 'Generated salary text outside approved compensation policy',
    reason: 'Model proposed unsupported benefits language.',
    status: 'Open',
  },
];

const DEFAULT_AI_MODELS = [
  { id: 'matching-v3', name: 'Matching Model v3', version: '3.2.1', lastTrained: '2026-04-12', status: 'Ready' },
  { id: 'content-assist', name: 'Content Assist', version: '2.4.0', lastTrained: '2026-04-18', status: 'Ready' },
];

const DEFAULT_AI_PROVIDERS = [
  { id: 'aip-openai',    name: 'OpenAI',    apiEndpoint: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o',          usedFor: 'Content generation, Job summaries', enabled: true },
  { id: 'aip-cohere',    name: 'Cohere',    apiEndpoint: 'https://api.cohere.ai/v1',  apiKey: '', model: 'command-r-plus', usedFor: 'Resume scoring, Candidate ranking', enabled: false },
  { id: 'aip-anthropic', name: 'Anthropic', apiEndpoint: 'https://api.anthropic.com', apiKey: '', model: 'claude-3-opus',  usedFor: 'Bias detection, Audit workflows',   enabled: false },
];

const DEFAULT_RBAC_ROLES = [
  { id: 'role-super-admin',    name: 'Super Admin',    description: 'Full platform control, billing, tenants, AI, security.',    permissions: ['all'] },
  { id: 'role-platform-admin', name: 'Platform Admin', description: 'User management, job moderation, fraud, subscriptions.',    permissions: ['users.manage', 'jobs.moderate', 'fraud.review', 'subscriptions.manage'] },
  { id: 'role-recruiter',      name: 'Recruiter',      description: 'Post jobs, manage ATS, sourcing, interviews, offers.',      permissions: ['jobs.post', 'ats.manage', 'candidates.view', 'interviews.schedule'] },
  { id: 'role-agency',         name: 'Agency',         description: 'Client management, candidate submissions, invoicing.',      permissions: ['clients.manage', 'submissions.create', 'invoices.generate'] },
  { id: 'role-viewer',         name: 'Viewer',         description: 'Read-only access to analytics and reports.',               permissions: ['analytics.read', 'reports.read'] },
];

const ALL_PERMISSIONS = [
  'all',
  'users.manage', 'users.view', 'users.suspend', 'users.ban',
  'jobs.post', 'jobs.moderate', 'jobs.delete',
  'ats.manage', 'candidates.view', 'interviews.schedule',
  'fraud.review', 'subscriptions.manage',
  'clients.manage', 'submissions.create', 'invoices.generate',
  'analytics.read', 'reports.read',
  'ai.configure', 'security.manage', 'sso.configure',
];

const DEFAULT_AI_METRICS = {
  recommendationAccuracy: 87,
  recruiterApprovalRate: 82,
  falsePositiveRate: 6,
  reviewedDecisions: 148,
};

const DEFAULT_SECURITY_LOGS = [
  {
    id: 1,
    user: 'rachel.martin@uprecruit.com',
    action: 'Successful admin login',
    timestamp: '2026-05-01 08:24',
    ipAddress: '196.203.14.88',
    risk: 'Low',
    suspicious: false,
    sessionState: 'Active',
  },
  {
    id: 2,
    user: 'samir.hr@uprecruit.com',
    action: 'Password reset requested from new device',
    timestamp: '2026-05-01 07:42',
    ipAddress: '102.33.81.16',
    risk: 'High',
    suspicious: true,
    sessionState: 'Active',
  },
  {
    id: 3,
    user: 'nadia.talent@uprecruit.com',
    action: 'Bulk candidate export',
    timestamp: '2026-04-30 18:10',
    ipAddress: '41.226.12.50',
    risk: 'Medium',
    suspicious: true,
    sessionState: 'Active',
  },
];

const DEFAULT_PASSWORD_POLICY = {
  minLength: 12,
  expiryDays: 90,
  requireUppercase: true,
  requireNumber: true,
  requireSymbol: true,
};

const DEFAULT_RETENTION_POLICIES = [
  { id: 'applications', label: 'Applications', duration: 24, unit: 'months' },
  { id: 'activity-logs', label: 'Activity Logs', duration: 12, unit: 'months' },
  { id: 'marketing-consent', label: 'Marketing Consent', duration: 36, unit: 'months' },
];

const DEFAULT_GDPR_REQUESTS = [
  {
    id: 1,
    user: 'salma.candidate@demo.com',
    type: 'Data Access',
    requestedAt: '2026-04-28',
    status: 'Open',
  },
  {
    id: 2,
    user: 'talent.ops@partnerco.com',
    type: 'Data Deletion',
    requestedAt: '2026-04-29',
    status: 'Open',
  },
];

const DEFAULT_BLOG_POSTS = [
  {
    id: 1,
    title: '2026 Hiring Benchmarks for Product Teams',
    category: 'Blog',
    status: 'Published',
    updatedAt: '2026-04-22',
  },
  {
    id: 2,
    title: 'How to structure a fair technical interview',
    category: 'Career Resource',
    status: 'Draft',
    updatedAt: '2026-04-30',
  },
];

const DEFAULT_FAQS = [
  {
    id: 1,
    question: 'How do I update my billing method?',
    answer: 'Open Billing Settings from your recruiter workspace and update the saved payment method.',
    status: 'Published',
  },
  {
    id: 2,
    question: 'Can I pause a job post without deleting it?',
    answer: 'Yes. Admins and recruiters can unpublish a role and restore it later from the job moderation queue.',
    status: 'Published',
  },
];

const DEFAULT_LANDING_PAGES = [
  {
    id: 'home-hero',
    name: 'Homepage Hero',
    headline: 'Find jobs and companies that fit your growth plan.',
    ctaLabel: 'Explore Jobs',
    status: 'Live',
  },
  {
    id: 'employer-banner',
    name: 'Employer Landing Banner',
    headline: 'Hire faster with trusted AI screening and recruiter workflows.',
    ctaLabel: 'Book a Demo',
    status: 'Live',
  },
];

const DEFAULT_CUSTOM_FIELDS = {
  jobs: [
    { id: 1, name: 'Work Authorization', type: 'Select', required: true },
    { id: 2, name: 'Travel Requirement', type: 'Boolean', required: false },
  ],
  applications: [
    { id: 1, name: 'Portfolio URL', type: 'URL', required: false },
    { id: 2, name: 'Earliest Start Date', type: 'Date', required: true },
  ],
};

const DEFAULT_PIPELINE_STAGES = [
  { id: 1, name: 'Applied', slaHours: 24, active: true },
  { id: 2, name: 'Screening', slaHours: 48, active: true },
  { id: 3, name: 'Technical Interview', slaHours: 72, active: true },
  { id: 4, name: 'Final Review', slaHours: 48, active: true },
  { id: 5, name: 'Offer', slaHours: 24, active: true },
];

const DEFAULT_INTEGRATION_SETTINGS = {
  apiAccessEnabled: true,
  apiBaseUrl: 'https://api.uprecruit.com/v1',
  webhooksEnabled: true,
};

const DEFAULT_WEBHOOKS = [
  { id: 1, event: 'application.created', url: 'https://partner.example.com/hooks/application-created', status: 'Active' },
  { id: 2, event: 'job.published', url: 'https://partner.example.com/hooks/job-published', status: 'Active' },
];

const DEFAULT_INDEXING_SETTINGS = {
  allowSearchIndexing: true,
  includeJobPages: true,
  includeCompanyPages: true,
  sitemapAutoRefresh: true,
};

const DEFAULT_RECOMMENDATION_RULES = [
  { id: 1, name: 'Boost verified employers', weight: 12, enabled: true },
  { id: 2, name: 'Boost recent candidate activity', weight: 10, enabled: true },
  { id: 3, name: 'Penalize stale job offers', weight: -8, enabled: true },
];

const DEFAULT_SUPPORT_SLAS = [
  { id: 'critical', priority: 'Critical', firstResponseMins: 30, resolutionHours: 4 },
  { id: 'high', priority: 'High', firstResponseMins: 120, resolutionHours: 12 },
  { id: 'normal', priority: 'Normal', firstResponseMins: 480, resolutionHours: 48 },
];

const DEFAULT_THEME_SETTINGS = {
  themeMode: 'Light',
  density: 'Comfortable',
  chartPalette: 'Ocean',
  enableAnimations: true,
};

const DEFAULT_BRANDING_SETTINGS = {
  primaryColor: '#1c4679',
  accentColor: '#3f6a9b',
  logoShape: 'Rounded',
  landingHeadingFont: 'Poppins',
};

const DEFAULT_SSO_PROVIDERS = [
  { id: 'sso-1', name: 'Okta', entityId: 'https://okta.example.com/sso/saml', ssoUrl: 'https://okta.example.com/app/saml', certificate: '-----BEGIN CERTIFICATE-----\nMIICpDCCAYwCCQD...\n-----END CERTIFICATE-----', status: 'Active' },
  { id: 'sso-2', name: 'Azure AD', entityId: 'https://sts.windows.net/tenant-id/', ssoUrl: 'https://login.microsoftonline.com/tenant-id/saml2', certificate: '', status: 'Inactive' },
];

const DEFAULT_OAUTH_PROVIDERS = [
  { id: 'oauth-google', provider: 'Google', clientId: 'my-google-client-id.apps.googleusercontent.com', clientSecret: '••••••••', scopes: 'email,profile', enabled: true },
  { id: 'oauth-linkedin', provider: 'LinkedIn', clientId: 'linkedin-client-id', clientSecret: '••••••••', scopes: 'r_liteprofile,r_emailaddress', enabled: true },
  { id: 'oauth-github', provider: 'GitHub', clientId: '', clientSecret: '', scopes: 'user:email', enabled: false },
];

const DEFAULT_PROFILE_SETTINGS = {
  adminDisplayName: 'Admin User',
  profileVisibility: 'Internal',
  timezonePreference: 'Africa/Tunis',
  localePreference: 'en-US',
};

const DEFAULT_ANALYTICS_SNAPSHOT = {
  platform: {
    totalUsers: 0,
    jobSeekers: 0,
    recruiters: 0,
    activeUsersDaily: 0,
    activeUsersMonthly: 0,
    jobPostingsVolume: 0,
    applicationsPerJob: 0,
  },
  hiring: {
    timeToHireDays: 0,
    conversionRateViewToApply: 0,
    topPerformingCompanies: [],
    topPerformingJobs: [],
  },
  financial: {
    revenue: 0,
    refunds: 0,
    netRevenue: 0,
    subscriptionGrowth: 0,
    churnRate: 0,
  },
  exportActions: {
    scheduledReports: [],
    exports: [],
  },
};

const DEFAULT_ADMIN_JOB_POSTING_TEMPLATES = [
  {
    id: 'tpl-engineering',
    name: 'Engineering Standard',
    title: 'Senior Software Engineer',
    description: 'Build and ship reliable product features with measurable business impact.',
    requirements: '5+ years experience, strong problem solving, collaborative communication.',
    salaryRange: { min: 50000, max: 80000 },
    locations: ['Remote'],
    employmentType: 'Full-Time',
    screeningQuestions: [{ id: 'q-1', type: 'yes_no', question: 'Do you have 5+ years of relevant experience?' }],
    visibility: 'Public',
  },
  {
    id: 'tpl-design',
    name: 'Product Design',
    title: 'Product Designer',
    description: 'Design user journeys and product experiences from discovery to handoff.',
    requirements: 'Portfolio required, experience with design systems and UX research.',
    salaryRange: { min: 40000, max: 70000 },
    locations: ['Paris'],
    employmentType: 'Hybrid',
    screeningQuestions: [{ id: 'q-2', type: 'mcq', question: 'Primary design tool?', options: ['Figma', 'Sketch', 'Adobe XD'] }],
    visibility: 'Public',
  },
];

const EMPTY_ADMIN_JOB_POST_DRAFT = {
  title: '',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
  locations: '',
  employmentType: 'Full-Time',
  applicationDeadline: '',
  visibility: 'Public',
  screeningQuestions: [],
};

const Configuration = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const [systemSettings, setSystemSettings] = useState({
    id: null,
    platformName: 'UPRECRUIT',
    enterpriseName: 'UPRECRUIT Talent Platform',
    brandingTheme: 'Ocean Blue',
    showLogo: '1',
    address: '',
    email: '',
  });
  const [localisationSettings, setLocalisationSettings] = useState({
    id: null,
    language: 'English',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'YYYY-MM-DD',
    timeZone: 'UTC',
  });
  const [emailSettings, setEmailSettings] = useState({
    id: null,
    emailSentAddress: 'support@uprecruit.com',
    smtp: 'smtp.uprecruit.com',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    id: null,
    showNotification: '1',
    enableAnnouncements: true,
  });
  const [featureToggles, setFeatureToggles] = useState({
    messaging: true,
    videoInterviews: true,
    aiRecommendations: true,
  });
  const [emailTemplates, setEmailTemplates] = useState(DEFAULT_EMAIL_TEMPLATES);
  const [notificationTriggers, setNotificationTriggers] = useState(DEFAULT_NOTIFICATION_TRIGGERS);
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);
  const [announcementDraft, setAnnouncementDraft] = useState({ title: '', audience: 'All users' });
  const [matchingWeights, setMatchingWeights] = useState({ skills: 45, experience: 25, location: 15, salary: 10, cultureFit: 5 });
  const [aiGeneratedContent, setAiGeneratedContent] = useState(DEFAULT_AI_CONTENT);
  const [aiMetrics, setAiMetrics] = useState(DEFAULT_AI_METRICS);
  const [aiModels, setAiModels] = useState(DEFAULT_AI_MODELS);
  const [flaggedAiDecisions, setFlaggedAiDecisions] = useState(DEFAULT_FLAGGED_AI_DECISIONS);
  const [securityLogs, setSecurityLogs] = useState(DEFAULT_SECURITY_LOGS);
  const [passwordPolicy, setPasswordPolicy] = useState(DEFAULT_PASSWORD_POLICY);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [retentionPolicies, setRetentionPolicies] = useState(DEFAULT_RETENTION_POLICIES);
  const [gdprRequests, setGdprRequests] = useState(DEFAULT_GDPR_REQUESTS);
  const [contentDraft, setContentDraft] = useState({
    title: '',
    category: 'Blog',
    body: '',
  });
  const [blogPosts, setBlogPosts] = useState(DEFAULT_BLOG_POSTS);
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' });
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [landingPages, setLandingPages] = useState(DEFAULT_LANDING_PAGES);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [customFields, setCustomFields] = useState(DEFAULT_CUSTOM_FIELDS);
  const [customFieldDraft, setCustomFieldDraft] = useState({ target: 'jobs', name: '', type: 'Text', required: false });
  const [pipelineStages, setPipelineStages] = useState(DEFAULT_PIPELINE_STAGES);
  const [stageDraft, setStageDraft] = useState({ name: '', slaHours: 24 });
  const [integrationSettings, setIntegrationSettings] = useState(DEFAULT_INTEGRATION_SETTINGS);
  const [webhooks, setWebhooks] = useState(DEFAULT_WEBHOOKS);
  const [webhookDraft, setWebhookDraft] = useState({ event: 'application.created', url: '' });
  const [indexingSettings, setIndexingSettings] = useState(DEFAULT_INDEXING_SETTINGS);
  const [recommendationRules, setRecommendationRules] = useState(DEFAULT_RECOMMENDATION_RULES);
  const [supportSlas, setSupportSlas] = useState(DEFAULT_SUPPORT_SLAS);
  const [themeSettings, setThemeSettings] = useState(DEFAULT_THEME_SETTINGS);
  const [brandingSettings, setBrandingSettings] = useState(DEFAULT_BRANDING_SETTINGS);
  const [ssoProviders, setSsoProviders] = useState(DEFAULT_SSO_PROVIDERS);
  const [oauthProviders, setOauthProviders] = useState(DEFAULT_OAUTH_PROVIDERS);
  const [ssoProviderDraft, setSsoProviderDraft] = useState({ name: '', entityId: '', ssoUrl: '', certificate: '' });
  const [oauthEditId, setOauthEditId] = useState(null);
  const [aiProviders, setAiProviders] = useState(DEFAULT_AI_PROVIDERS);
  const [rbacRoles, setRbacRoles] = useState(DEFAULT_RBAC_ROLES);
  const [newRoleDraft, setNewRoleDraft] = useState({ name: '', description: '', permissions: [] });
  const [rolePermDraft, setRolePermDraft] = useState({});   // { roleId: permString }
  const [profileSettings, setProfileSettings] = useState(DEFAULT_PROFILE_SETTINGS);
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState(DEFAULT_ANALYTICS_SNAPSHOT);
  const [reportScheduleDraft, setReportScheduleDraft] = useState({
    name: 'Weekly Admin KPI',
    format: 'CSV',
    frequency: 'Weekly',
    email: 'admin@uprecruit.com',
  });
  const [jobPostingTemplates, setJobPostingTemplates] = useState(DEFAULT_ADMIN_JOB_POSTING_TEMPLATES);
  const [adminJobPosts, setAdminJobPosts] = useState([]);
  const [selectedAdminJobId, setSelectedAdminJobId] = useState(null);
  const [jobPostDraft, setJobPostDraft] = useState(EMPTY_ADMIN_JOB_POST_DRAFT);
  const [templateToUse, setTemplateToUse] = useState(DEFAULT_ADMIN_JOB_POSTING_TEMPLATES[0].id);
  const [screeningQuestionDraft, setScreeningQuestionDraft] = useState({ type: 'yes_no', question: '', options: '' });
  const [scheduleDraft, setScheduleDraft] = useState('');
  const [promotionDraft, setPromotionDraft] = useState({ paidPromotion: false, promotionPlan: 'Featured - 7 days' });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const [systemResult, localizationResult, emailResult, notificationResult, emailTemplateResult, dashboardResult, headerResult, analyticsResult, jobPostingResult] = await Promise.allSettled([
        settingsHTTPService.getSystemSettings(),
        settingsHTTPService.getLocalisationSettings(),
        settingsHTTPService.getEmailSettings(),
        settingsHTTPService.getNotificationSettings(),
        settingsHTTPService.getEmailTemplateettings(),
        settingsHTTPService.getDashboardSettings(),
        settingsHTTPService.getHeaderSettings(),
        adminHTTPService.getAnalytics(),
        adminHTTPService.getAdminJobPosting(),
      ]);

      if (!isMounted) {
        return;
      }

      if (systemResult.status === 'fulfilled' && systemResult.value?.data?.[0]) {
        const data = systemResult.value.data[0];
        setSystemSettings((previous) => ({
          ...previous,
          id: data.id,
          platformName: data.appName || previous.platformName,
          enterpriseName: data.appName || previous.enterpriseName,
          showLogo: data.showLogo || previous.showLogo,
          address: data.address || previous.address,
          email: data.email || previous.email,
        }));
      }

      if (localizationResult.status === 'fulfilled' && localizationResult.value?.data?.[0]) {
        const data = localizationResult.value.data[0];
        setLocalisationSettings((previous) => ({
          ...previous,
          id: data.id,
          language: data.language || previous.language,
          currency: data.currency || previous.currency,
          currencySymbol: data.currencySymbol || previous.currencySymbol,
          dateFormat: data.dateFormat || previous.dateFormat,
          timeZone: data.timeZone || previous.timeZone,
        }));
      }

      if (emailResult.status === 'fulfilled' && emailResult.value?.data?.[0]) {
        const data = emailResult.value.data[0];
        setEmailSettings((previous) => ({
          ...previous,
          id: data.id,
          emailSentAddress: data.emailSentAddress || previous.emailSentAddress,
          smtp: data.smtp || previous.smtp,
        }));
      }

      if (notificationResult.status === 'fulfilled' && notificationResult.value?.data?.[0]) {
        const data = notificationResult.value.data[0];
        setNotificationSettings((previous) => ({
          ...previous,
          id: data.id,
          showNotification: data.showNotification || previous.showNotification,
        }));
      }

      if (dashboardResult.status === 'fulfilled' && dashboardResult.value?.data?.[0]) {
        const data = dashboardResult.value.data[0];
        setFeatureToggles((previous) => ({
          ...previous,
          aiRecommendations: data.showSummary === '1' || previous.aiRecommendations,
        }));
      }

      if (headerResult.status === 'fulfilled' && headerResult.value?.data?.[0]) {
        const data = headerResult.value.data[0];
        setFeatureToggles((previous) => ({
          ...previous,
          messaging: data.enbaleSearchBar === '1' || previous.messaging,
        }));
      }

      if (emailTemplateResult.status !== 'fulfilled') {
        showMessage('Info', 'Using local email template defaults in admin configuration.', 'info');
      }

      if (analyticsResult.status === 'fulfilled' && analyticsResult.value?.data) {
        setAnalyticsSnapshot((previous) => ({
          ...previous,
          ...analyticsResult.value.data,
        }));
      }

      if (jobPostingResult.status === 'fulfilled' && jobPostingResult.value?.data) {
        const templates = Array.isArray(jobPostingResult.value.data.templates) && jobPostingResult.value.data.templates.length
          ? jobPostingResult.value.data.templates
          : DEFAULT_ADMIN_JOB_POSTING_TEMPLATES;

        setJobPostingTemplates(templates);
        setTemplateToUse(templates[0]?.id || DEFAULT_ADMIN_JOB_POSTING_TEMPLATES[0].id);
        setAdminJobPosts(Array.isArray(jobPostingResult.value.data.jobs) ? jobPostingResult.value.data.jobs : []);
      }

      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalWeight = useMemo(
    () => Object.values(matchingWeights).reduce((sum, value) => sum + Number(value || 0), 0),
    [matchingWeights]
  );

  const handleSaveGeneralSettings = async () => {
    try {
      if (systemSettings.id) {
        await settingsHTTPService.editSystemSettings(systemSettings.id, {
          appName: systemSettings.platformName,
          showLogo: systemSettings.showLogo,
          address: systemSettings.address,
          email: systemSettings.email,
        });
      }
      if (localisationSettings.id) {
        await settingsHTTPService.editLocalisationSettings(localisationSettings.id, {
          language: localisationSettings.language,
          currency: localisationSettings.currency,
          currencySymbol: localisationSettings.currencySymbol,
          dateFormat: localisationSettings.dateFormat,
          timeZone: localisationSettings.timeZone,
        });
      }
      setActionMessage('General settings saved.');
    } catch (error) {
      setActionMessage('General settings updated locally. Backend save is not available in this environment.');
      console.log(error);
    }
  };

  const handleRestoreGeneralDefaults = async () => {
    try {
      if (systemSettings.id) {
        await settingsHTTPService.restoreSystemSettings(systemSettings.id);
      }
    } catch (error) {
      console.log(error);
    }

    setSystemSettings((previous) => ({
      ...previous,
      platformName: 'UPRECRUIT',
      enterpriseName: 'UPRECRUIT Talent Platform',
      brandingTheme: 'Ocean Blue',
      showLogo: '1',
    }));
    setLocalisationSettings((previous) => ({
      ...previous,
      language: 'English',
      currency: 'USD',
      currencySymbol: '$',
      timeZone: 'UTC',
    }));
    setActionMessage('General settings restored to defaults.');
  };

  const handleToggleFeature = (key) => {
    setFeatureToggles((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setActionMessage(`${key} feature toggle updated.`);
  };

  const handleTemplateChange = (templateId, field, value) => {
    setEmailTemplates((previous) => previous.map((template) => (
      template.id === templateId ? { ...template, [field]: value } : template
    )));
  };

  const handleSaveTemplates = () => {
    setActionMessage('Email templates updated.');
  };

  const handleTriggerToggle = (triggerId) => {
    setNotificationTriggers((previous) => previous.map((trigger) => (
      trigger.id === triggerId ? { ...trigger, enabled: !trigger.enabled } : trigger
    )));
    setActionMessage('Notification trigger updated.');
  };

  const handleSaveNotifications = async () => {
    try {
      if (notificationSettings.id) {
        await settingsHTTPService.editNotificationsSettings(notificationSettings.id, {
          showNotification: notificationSettings.showNotification,
        });
      }
      setActionMessage('Notification settings saved.');
    } catch (error) {
      setActionMessage('Notification settings updated locally.');
      console.log(error);
    }
  };

  const handleSendAnnouncement = () => {
    const title = announcementDraft.title.trim();
    if (!title) {
      setActionMessage('Announcement title is required.');
      return;
    }
    setAnnouncements((previous) => [
      {
        id: previous.length + 1,
        title,
        audience: announcementDraft.audience,
        status: 'Sent',
        sentAt: new Date().toLocaleString(),
      },
      ...previous,
    ]);
    setAnnouncementDraft({ title: '', audience: 'All users' });
    setActionMessage('System-wide announcement sent.');
  };

  const handleWeightChange = (key, value) => {
    setMatchingWeights((previous) => ({
      ...previous,
      [key]: Number(value) || 0,
    }));
  };

  const handleSaveWeights = () => {
    setActionMessage(`Matching weights updated. Current total: ${totalWeight}.`);
  };

  const handleModerateAiContent = (contentId, approved) => {
    setAiGeneratedContent((previous) => previous.map((item) => (
      item.id === contentId ? { ...item, status: approved ? 'Approved' : 'Rejected' } : item
    )));
    setActionMessage(`AI-generated content ${approved ? 'approved' : 'rejected'}.`);
  };

  const handleTrainModel = (modelId) => {
    setAiModels((previous) => previous.map((model) => (
      model.id === modelId
        ? { ...model, status: 'Training', lastTrained: new Date().toISOString().slice(0, 10) }
        : model
    )));
    setAiMetrics((previous) => ({
      ...previous,
      recommendationAccuracy: Math.min(99, previous.recommendationAccuracy + 1),
    }));
    setActionMessage('AI model training started.');
  };

  const handleResolveAiDecision = (decisionId, approved) => {
    setFlaggedAiDecisions((previous) => previous.map((decision) => (
      decision.id === decisionId ? { ...decision, status: approved ? 'Approved Override' : 'Rejected Override' } : decision
    )));
    setActionMessage('Flagged AI decision reviewed.');
  };

  const handleForceLogout = (logId) => {
    setSecurityLogs((previous) => previous.map((log) => (
      log.id === logId ? { ...log, sessionState: 'Forced Logout' } : log
    )));
    setActionMessage('User session terminated.');
  };

  const handleToggleSuspicious = (logId) => {
    setSecurityLogs((previous) => previous.map((log) => (
      log.id === logId
        ? {
            ...log,
            suspicious: !log.suspicious,
            risk: log.suspicious ? 'Low' : 'High',
          }
        : log
    )));
    setActionMessage('Suspicious activity status updated.');
  };

  const handlePasswordPolicyChange = (field, value) => {
    setPasswordPolicy((previous) => ({
      ...previous,
      [field]: typeof previous[field] === 'boolean' ? value : Number(value) || 0,
    }));
  };

  const handleSaveSecuritySettings = () => {
    setActionMessage('Security and compliance settings updated.');
  };

  // NEW: SSO Management
  const handleAddSsoProvider = () => {
    if (!ssoProviderDraft.name.trim() || !ssoProviderDraft.ssoUrl.trim()) {
      setActionMessage('SSO provider name and SSO URL are required.');
      return;
    }
    setSsoProviders((previous) => [...previous, {
      id: `sso-${Date.now()}`,
      name: ssoProviderDraft.name.trim(),
      entityId: ssoProviderDraft.entityId.trim(),
      ssoUrl: ssoProviderDraft.ssoUrl.trim(),
      certificate: ssoProviderDraft.certificate.trim(),
      status: 'Inactive',
    }]);
    setSsoProviderDraft({ name: '', entityId: '', ssoUrl: '', certificate: '' });
    setActionMessage('SSO provider added. Activate it to enable SAML login.');
  };

  const handleToggleSsoProvider = (ssoId) => {
    setSsoProviders((previous) => previous.map((provider) => (
      provider.id === ssoId ? { ...provider, status: provider.status === 'Active' ? 'Inactive' : 'Active' } : provider
    )));
    setActionMessage('SSO provider status updated.');
  };

  const handleRemoveSsoProvider = (ssoId) => {
    setSsoProviders((previous) => previous.filter((provider) => provider.id !== ssoId));
    setActionMessage('SSO provider removed.');
  };

  // NEW: OAuth Management
  const handleToggleOauthProvider = (oauthId) => {
    setOauthProviders((previous) => previous.map((provider) => (
      provider.id === oauthId ? { ...provider, enabled: !provider.enabled } : provider
    )));
    setActionMessage('OAuth provider updated.');
  };

  const handleOauthFieldChange = (oauthId, field, value) => {
    setOauthProviders((previous) => previous.map((provider) => (
      provider.id === oauthId ? { ...provider, [field]: value } : provider
    )));
  };

  // NEW: AI Provider Management
  const handleAiProviderFieldChange = (providerId, field, value) => {
    setAiProviders((previous) => previous.map((p) => (
      p.id === providerId ? { ...p, [field]: value } : p
    )));
  };

  const handleToggleAiProvider = (providerId) => {
    setAiProviders((previous) => previous.map((p) => (
      p.id === providerId ? { ...p, enabled: !p.enabled } : p
    )));
    setActionMessage('AI provider status updated.');
  };

  const handleTestAiProvider = (providerId) => {
    const provider = aiProviders.find((p) => p.id === providerId);
    if (!provider || !provider.apiKey.trim()) {
      setActionMessage('Enter an API key before testing the connection.');
      return;
    }
    setActionMessage(`Connection test initiated for ${provider.name}. Awaiting response…`);
  };

  // NEW: RBAC Roles & Permissions
  const handleCreateRole = () => {
    if (!newRoleDraft.name.trim()) { setActionMessage('Role name is required.'); return; }
    setRbacRoles((previous) => [...previous, {
      id: `role-${Date.now()}`,
      name: newRoleDraft.name.trim(),
      description: newRoleDraft.description.trim(),
      permissions: newRoleDraft.permissions,
    }]);
    setNewRoleDraft({ name: '', description: '', permissions: [] });
    setActionMessage('Role created.');
  };

  const handleToggleRolePermission = (roleId, permission) => {
    setRbacRoles((previous) => previous.map((role) => {
      if (role.id !== roleId) return role;
      const hasAll = role.permissions.includes('all');
      if (hasAll) return role;   // super admin — locked
      const hasPermission = role.permissions.includes(permission);
      const nextPermissions = hasPermission
        ? role.permissions.filter((p) => p !== permission)
        : [...role.permissions, permission];
      return { ...role, permissions: nextPermissions };
    }));
  };

  const handleDeleteRole = (roleId) => {
    setRbacRoles((previous) => previous.filter((r) => r.id !== roleId));
    setActionMessage('Role deleted.');
  };

  const handleRetentionChange = (policyId, field, value) => {
    setRetentionPolicies((previous) => previous.map((policy) => (
      policy.id === policyId ? { ...policy, [field]: field === 'duration' ? Number(value) || 0 : value } : policy
    )));
  };

  const handleResolveGdprRequest = (requestId, status) => {
    setGdprRequests((previous) => previous.map((request) => (
      request.id === requestId ? { ...request, status } : request
    )));
    setActionMessage(`GDPR request marked as ${status.toLowerCase()}.`);
  };

  const handleContentDraftChange = (field, value) => {
    setContentDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePublishContent = () => {
    const trimmedTitle = contentDraft.title.trim();
    if (!trimmedTitle) {
      setActionMessage('Content title is required.');
      return;
    }

    setBlogPosts((previous) => [
      {
        id: previous.length + 1,
        title: trimmedTitle,
        category: contentDraft.category,
        status: 'Published',
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      ...previous,
    ]);
    setContentDraft({ title: '', category: 'Blog', body: '' });
    setActionMessage('Content published to CMS.');
  };

  const handleToggleContentStatus = (postId) => {
    setBlogPosts((previous) => previous.map((post) => (
      post.id === postId
        ? { ...post, status: post.status === 'Published' ? 'Draft' : 'Published', updatedAt: new Date().toISOString().slice(0, 10) }
        : post
    )));
    setActionMessage('Content status updated.');
  };

  const handleSaveFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) {
      setActionMessage('FAQ question and answer are required.');
      return;
    }

    setFaqs((previous) => [
      {
        id: previous.length + 1,
        question: faqDraft.question.trim(),
        answer: faqDraft.answer.trim(),
        status: 'Published',
      },
      ...previous,
    ]);
    setFaqDraft({ question: '', answer: '' });
    setActionMessage('FAQ entry saved.');
  };

  const handleLandingPageChange = (pageId, field, value) => {
    setLandingPages((previous) => previous.map((page) => (
      page.id === pageId ? { ...page, [field]: value } : page
    )));
  };

  const handleSaveLandingPages = () => {
    setActionMessage('Landing page content updated.');
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    setMediaLibrary((previous) => [
      ...files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith('video') ? 'Video' : 'Image',
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      })),
      ...previous,
    ]);
    event.target.value = '';
    setActionMessage('Media uploaded to the CMS library.');
  };

  const handleCustomFieldDraftChange = (field, value) => {
    setCustomFieldDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddCustomField = () => {
    const fieldName = customFieldDraft.name.trim();
    if (!fieldName) {
      setActionMessage('Custom field name is required.');
      return;
    }

    setCustomFields((previous) => ({
      ...previous,
      [customFieldDraft.target]: [
        ...previous[customFieldDraft.target],
        {
          id: Date.now(),
          name: fieldName,
          type: customFieldDraft.type,
          required: customFieldDraft.required,
        },
      ],
    }));
    setCustomFieldDraft({ target: customFieldDraft.target, name: '', type: 'Text', required: false });
    setActionMessage('Custom field added.');
  };

  const handleRemoveCustomField = (target, fieldId) => {
    setCustomFields((previous) => ({
      ...previous,
      [target]: previous[target].filter((field) => field.id !== fieldId),
    }));
    setActionMessage('Custom field removed.');
  };

  const handleAddPipelineStage = () => {
    const stageName = stageDraft.name.trim();
    if (!stageName) {
      setActionMessage('Stage name is required.');
      return;
    }

    setPipelineStages((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: stageName,
        slaHours: Number(stageDraft.slaHours) || 0,
        active: true,
      },
    ]);
    setStageDraft({ name: '', slaHours: 24 });
    setActionMessage('Pipeline stage added.');
  };

  const handleTogglePipelineStage = (stageId) => {
    setPipelineStages((previous) => previous.map((stage) => (
      stage.id === stageId ? { ...stage, active: !stage.active } : stage
    )));
    setActionMessage('Pipeline stage status updated.');
  };

  const handleStageSlaChange = (stageId, value) => {
    setPipelineStages((previous) => previous.map((stage) => (
      stage.id === stageId ? { ...stage, slaHours: Number(value) || 0 } : stage
    )));
  };

  const handleIntegrationSettingChange = (field, value) => {
    setIntegrationSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleToggleWebhook = (webhookId) => {
    setWebhooks((previous) => previous.map((webhook) => (
      webhook.id === webhookId ? { ...webhook, status: webhook.status === 'Active' ? 'Paused' : 'Active' } : webhook
    )));
    setActionMessage('Webhook status updated.');
  };

  const handleAddWebhook = () => {
    const webhookUrl = webhookDraft.url.trim();
    if (!webhookUrl) {
      setActionMessage('Webhook URL is required.');
      return;
    }

    setWebhooks((previous) => [
      ...previous,
      {
        id: Date.now(),
        event: webhookDraft.event,
        url: webhookUrl,
        status: 'Active',
      },
    ]);
    setWebhookDraft({ event: 'application.created', url: '' });
    setActionMessage('Webhook added.');
  };

  const handleToggleIndexingSetting = (field) => {
    setIndexingSettings((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
    setActionMessage('Indexing setting updated.');
  };

  const handleRuleChange = (ruleId, field, value) => {
    setRecommendationRules((previous) => previous.map((rule) => (
      rule.id === ruleId ? { ...rule, [field]: field === 'weight' ? Number(value) || 0 : value } : rule
    )));
  };

  const handleSlaChange = (slaId, field, value) => {
    setSupportSlas((previous) => previous.map((sla) => (
      sla.id === slaId ? { ...sla, [field]: Number(value) || 0 } : sla
    )));
  };

  const handleSaveAdvancedSettings = () => {
    setActionMessage('Advanced admin settings saved.');
  };

  const handleSaveAdminSettings = () => {
    setActionMessage('Admin graphics, integration, branding, and profile settings saved.');
  };

  const handleThemeSettingChange = (field, value) => {
    setThemeSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleBrandingSettingChange = (field, value) => {
    setBrandingSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleProfileSettingChange = (field, value) => {
    setProfileSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleExportReport = async (format) => {
    try {
      const response = await adminHTTPService.exportAnalytics(format);
      setAnalyticsSnapshot((previous) => ({
        ...previous,
        exportActions: {
          ...previous.exportActions,
          exports: [response.data, ...(previous.exportActions?.exports || [])],
        },
      }));
      setActionMessage(`${format.toUpperCase()} report exported successfully.`);
    } catch (error) {
      setActionMessage(`Unable to export ${format.toUpperCase()} report in this environment.`);
      console.log(error);
    }
  };

  const handleScheduleReport = async () => {
    if (!reportScheduleDraft.name.trim() || !reportScheduleDraft.email.trim()) {
      setActionMessage('Report name and destination email are required.');
      return;
    }

    try {
      const response = await adminHTTPService.scheduleAnalyticsReport(reportScheduleDraft);
      setAnalyticsSnapshot((previous) => ({
        ...previous,
        exportActions: {
          ...previous.exportActions,
          scheduledReports: [response.data, ...(previous.exportActions?.scheduledReports || [])],
        },
      }));
      setActionMessage('Automated report schedule created.');
    } catch (error) {
      setActionMessage('Automated report schedule saved locally.');
      console.log(error);
    }
  };

  const loadAdminJobPosting = async () => {
    const response = await adminHTTPService.getAdminJobPosting();
    const payload = response?.data || {};
    const templates = Array.isArray(payload.templates) && payload.templates.length ? payload.templates : DEFAULT_ADMIN_JOB_POSTING_TEMPLATES;
    setJobPostingTemplates(templates);
    setAdminJobPosts(Array.isArray(payload.jobs) ? payload.jobs : []);
    if (!templateToUse && templates[0]) {
      setTemplateToUse(templates[0].id);
    }
  };

  const resetAdminJobDraft = () => {
    setSelectedAdminJobId(null);
    setJobPostDraft(EMPTY_ADMIN_JOB_POST_DRAFT);
    setScreeningQuestionDraft({ type: 'yes_no', question: '', options: '' });
  };

  const hydrateDraftFromJob = (job) => {
    setSelectedAdminJobId(job.id);
    setJobPostDraft({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      salaryMin: job.salaryRange?.min || '',
      salaryMax: job.salaryRange?.max || '',
      locations: Array.isArray(job.locations) ? job.locations.join(', ') : '',
      employmentType: job.employmentType || 'Full-Time',
      applicationDeadline: job.applicationDeadline || '',
      visibility: job.visibility || 'Public',
      screeningQuestions: Array.isArray(job.screeningQuestions) ? job.screeningQuestions : [],
    });
    setScheduleDraft(job.scheduledAt ? String(job.scheduledAt).slice(0, 16) : '');
    setPromotionDraft({
      paidPromotion: Boolean(job.promotion?.paid),
      promotionPlan: job.promotion?.plan || 'Featured - 7 days',
    });
  };

  const handleApplyJobTemplate = () => {
    const template = jobPostingTemplates.find((item) => item.id === templateToUse);
    if (!template) {
      return;
    }

    setJobPostDraft((previous) => ({
      ...previous,
      title: template.title || '',
      description: template.description || '',
      requirements: template.requirements || '',
      salaryMin: template.salaryRange?.min || '',
      salaryMax: template.salaryRange?.max || '',
      locations: Array.isArray(template.locations) ? template.locations.join(', ') : '',
      employmentType: template.employmentType || 'Full-Time',
      visibility: template.visibility || 'Public',
      screeningQuestions: Array.isArray(template.screeningQuestions) ? template.screeningQuestions : [],
    }));
    setActionMessage('Template applied to job draft.');
  };

  const handleJobDraftField = (field, value) => {
    setJobPostDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddScreeningQuestion = () => {
    const questionText = screeningQuestionDraft.question.trim();
    if (!questionText) {
      setActionMessage('Screening question text is required.');
      return;
    }

    const options = screeningQuestionDraft.type === 'mcq'
      ? screeningQuestionDraft.options.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    setJobPostDraft((previous) => ({
      ...previous,
      screeningQuestions: [
        ...previous.screeningQuestions,
        {
          id: Date.now(),
          type: screeningQuestionDraft.type,
          question: questionText,
          options,
        },
      ],
    }));
    setScreeningQuestionDraft({ type: 'yes_no', question: '', options: '' });
  };

  const handleRemoveScreeningQuestion = (questionId) => {
    setJobPostDraft((previous) => ({
      ...previous,
      screeningQuestions: previous.screeningQuestions.filter((question) => question.id !== questionId),
    }));
  };

  const buildAdminJobPayload = (statusValue) => ({
    title: jobPostDraft.title,
    description: jobPostDraft.description,
    requirements: jobPostDraft.requirements,
    salaryMin: Number(jobPostDraft.salaryMin) || 0,
    salaryMax: Number(jobPostDraft.salaryMax) || 0,
    locations: jobPostDraft.locations.split(',').map((item) => item.trim()).filter(Boolean),
    employmentType: jobPostDraft.employmentType,
    applicationDeadline: jobPostDraft.applicationDeadline || null,
    visibility: jobPostDraft.visibility,
    screeningQuestions: jobPostDraft.screeningQuestions,
    status: statusValue,
  });

  const handleSaveAdminJobPost = async (statusValue) => {
    if (!jobPostDraft.title.trim()) {
      setActionMessage('Job title is required.');
      return;
    }

    try {
      const payload = buildAdminJobPayload(statusValue);
      if (selectedAdminJobId) {
        await adminHTTPService.updateAdminJobPost(selectedAdminJobId, payload);
        setActionMessage('Job post updated.');
      } else {
        await adminHTTPService.createAdminJobPost(payload);
        setActionMessage(statusValue === 'Draft' ? 'Draft job created.' : 'Job post created.');
      }
      await loadAdminJobPosting();
      resetAdminJobDraft();
    } catch (error) {
      setActionMessage('Unable to save admin job post right now.');
      console.log(error);
    }
  };

  const handleDuplicateAdminJob = async (jobId) => {
    try {
      await adminHTTPService.duplicateAdminJobPost(jobId);
      await loadAdminJobPosting();
      setActionMessage('Job duplicated successfully.');
    } catch (error) {
      setActionMessage('Unable to duplicate job post.');
      console.log(error);
    }
  };

  const handlePublishAdminJob = async (jobId) => {
    try {
      await adminHTTPService.publishAdminJobPost(jobId);
      await loadAdminJobPosting();
      setActionMessage('Job published.');
    } catch (error) {
      setActionMessage('Unable to publish job post.');
      console.log(error);
    }
  };

  const handleUnpublishAdminJob = async (jobId) => {
    try {
      await adminHTTPService.unpublishAdminJobPost(jobId);
      await loadAdminJobPosting();
      setActionMessage('Job unpublished.');
    } catch (error) {
      setActionMessage('Unable to unpublish job post.');
      console.log(error);
    }
  };

  const handleScheduleAdminJob = async (jobId) => {
    if (!scheduleDraft) {
      setActionMessage('Schedule date/time is required.');
      return;
    }

    try {
      await adminHTTPService.scheduleAdminJobPost(jobId, new Date(scheduleDraft).toISOString());
      await loadAdminJobPosting();
      setActionMessage('Job posting scheduled.');
    } catch (error) {
      setActionMessage('Unable to schedule job posting.');
      console.log(error);
    }
  };

  const handlePromoteAdminJob = async (jobId) => {
    try {
      await adminHTTPService.promoteAdminJobPost(jobId, promotionDraft);
      await loadAdminJobPosting();
      setActionMessage('Job promoted and featured.');
    } catch (error) {
      setActionMessage('Unable to promote job post.');
      console.log(error);
    }
  };

  const handleRefreshAdminJob = async (jobId) => {
    try {
      await adminHTTPService.refreshAdminJobPost(jobId);
      await loadAdminJobPosting();
      setActionMessage('Job listing refreshed and boosted.');
    } catch (error) {
      setActionMessage('Unable to refresh job listing.');
      console.log(error);
    }
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: 'fa-cog' },
    { id: 'toggles', label: 'Feature Toggles', icon: 'fa-toggle-on' },
    { id: 'notifications', label: 'Email & Notifications', icon: 'fa-bell' },
    { id: 'ai', label: 'AI & Matching Control', icon: 'fa-robot' },
    { id: 'security', label: 'Security & Compliance', icon: 'fa-shield' },
    { id: 'cms', label: 'CMS & Content Management', icon: 'fa-pencil-square-o' },
    { id: 'advanced', label: 'Advanced Admin Actions', icon: 'fa-sliders' },
    { id: 'admin-settings', label: 'Admin Settings', icon: 'fa-user-circle-o' },
    { id: 'admin-job-posting', label: 'Admin Job Posting', icon: 'fa-bullhorn' },
    { id: 'analytics', label: 'Analytics & Reporting', icon: 'fa-line-chart' },
  ];

  return (
    <div className="configuration-page">
      <section className="configuration-page__hero card">
        <div className="card-body configuration-page__hero-body">
          <div>
            <span className="configuration-page__eyebrow">Admin Controls</span>
            <h2 className="configuration-page__title">System Configuration</h2>
            <p className="configuration-page__subtitle">
              Manage platform identity, security posture, compliance workflows, notification templates, AI governance, and CMS operations from one console.
            </p>
          </div>
          <div className="configuration-page__hero-stats">
            <div>
              <strong>{featureToggles.messaging ? 'On' : 'Off'}</strong>
              <span>Messaging</span>
            </div>
            <div>
              <strong>{notificationTriggers.filter((trigger) => trigger.enabled).length}</strong>
              <span>Active triggers</span>
            </div>
            <div>
              <strong>{aiMetrics.recommendationAccuracy}%</strong>
              <span>AI accuracy</span>
            </div>
            <div>
              <strong>{securityLogs.filter((log) => log.suspicious).length}</strong>
              <span>Security alerts</span>
            </div>
            <div>
              <strong>{blogPosts.filter((post) => post.status === 'Published').length + mediaLibrary.length}</strong>
              <span>Published assets</span>
            </div>
            <div>
              <strong>{pipelineStages.filter((stage) => stage.active).length}</strong>
              <span>Active stages</span>
            </div>
            <div>
              <strong>{analyticsSnapshot.financial.netRevenue}</strong>
              <span>Net revenue</span>
            </div>
          </div>
        </div>
      </section>

      {actionMessage && <div className="configuration-page__message">{actionMessage}</div>}

      <div className="configuration-page__layout">
        <aside className="configuration-page__sidebar card">
          <div className="card-body configuration-page__nav">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`configuration-page__nav-item${activeSection === section.id ? ' configuration-page__nav-item--active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <i className={`fa ${section.icon}`} aria-hidden="true"></i>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="configuration-page__content">
          {loading && (
            <div className="card">
              <div className="card-body">Loading configuration...</div>
            </div>
          )}

          {!loading && activeSection === 'general' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>General Settings</h4>
                    <p>Configure platform name, branding, default language, currency, and time zone management.</p>
                  </div>
                  <div className="configuration-page__section-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveGeneralSettings}>Save Settings</button>
                    <button type="button" className="btn btn-outline-warning btn-sm" onClick={handleRestoreGeneralDefaults}>Restore Defaults</button>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <label>Platform Name</label>
                    <input className="fo-input" value={systemSettings.platformName} onChange={(event) => setSystemSettings((previous) => ({ ...previous, platformName: event.target.value }))} />
                    <label>Branding Theme</label>
                    <input className="fo-input" value={systemSettings.brandingTheme} onChange={(event) => setSystemSettings((previous) => ({ ...previous, brandingTheme: event.target.value }))} />
                    <label>Enterprise Name</label>
                    <input className="fo-input" value={systemSettings.enterpriseName} onChange={(event) => setSystemSettings((previous) => ({ ...previous, enterpriseName: event.target.value }))} />
                    <label>Contact Email</label>
                    <input className="fo-input" value={systemSettings.email} onChange={(event) => setSystemSettings((previous) => ({ ...previous, email: event.target.value }))} />
                    <label>Address</label>
                    <input className="fo-input" value={systemSettings.address} onChange={(event) => setSystemSettings((previous) => ({ ...previous, address: event.target.value }))} />
                  </div>

                  <div className="configuration-page__panel">
                    <label>Default Language</label>
                    <select className="fo-select" value={localisationSettings.language} onChange={(event) => setLocalisationSettings((previous) => ({ ...previous, language: event.target.value }))}>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                    <label>Default Currency</label>
                    <select className="fo-select" value={localisationSettings.currency} onChange={(event) => setLocalisationSettings((previous) => ({ ...previous, currency: event.target.value }))}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TND">TND</option>
                    </select>
                    <label>Currency Symbol</label>
                    <input className="fo-input" value={localisationSettings.currencySymbol} onChange={(event) => setLocalisationSettings((previous) => ({ ...previous, currencySymbol: event.target.value }))} />
                    <label>Date Format</label>
                    <input className="fo-input" value={localisationSettings.dateFormat} onChange={(event) => setLocalisationSettings((previous) => ({ ...previous, dateFormat: event.target.value }))} />
                    <label>Time Zone</label>
                    <select className="fo-select" value={localisationSettings.timeZone} onChange={(event) => setLocalisationSettings((previous) => ({ ...previous, timeZone: event.target.value }))}>
                      <option value="UTC">UTC</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Africa/Tunis">Africa/Tunis</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'toggles' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Feature Toggles</h4>
                    <p>Enable or disable core experiences like messaging, video interviews, and AI recommendations.</p>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--three">
                  {[
                    { key: 'messaging', title: 'Messaging', description: 'Candidate and recruiter conversations across the platform.' },
                    { key: 'videoInterviews', title: 'Video Interviews', description: 'Remote interview scheduling with video support.' },
                    { key: 'aiRecommendations', title: 'AI Recommendations', description: 'AI-powered job and candidate recommendation flows.' },
                  ].map((toggle) => (
                    <div key={toggle.key} className="configuration-page__toggle-card">
                      <div>
                        <h5>{toggle.title}</h5>
                        <p>{toggle.description}</p>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-sm ${featureToggles[toggle.key] ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleToggleFeature(toggle.key)}
                      >
                        {featureToggles[toggle.key] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'notifications' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Email & Notifications</h4>
                    <p>Edit email templates, configure notification triggers, and send system-wide announcements.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveNotifications}>Save Notification Settings</button>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Delivery Settings</h5>
                    <label>Email From</label>
                    <input className="fo-input" value={emailSettings.emailSentAddress} onChange={(event) => setEmailSettings((previous) => ({ ...previous, emailSentAddress: event.target.value }))} />
                    <label>SMTP Server</label>
                    <input className="fo-input" value={emailSettings.smtp} onChange={(event) => setEmailSettings((previous) => ({ ...previous, smtp: event.target.value }))} />
                    <label>Show Notifications</label>
                    <select className="fo-select" value={notificationSettings.showNotification} onChange={(event) => setNotificationSettings((previous) => ({ ...previous, showNotification: event.target.value }))}>
                      <option value="1">Enabled</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Notification Triggers</h5>
                    <div className="configuration-page__stack-list">
                      {notificationTriggers.map((trigger) => (
                        <div key={trigger.id} className="configuration-page__list-row">
                          <div>
                            <strong>{trigger.label}</strong>
                            <span>{trigger.channel}</span>
                          </div>
                          <button type="button" className={`btn btn-sm ${trigger.enabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleTriggerToggle(trigger.id)}>
                            {trigger.enabled ? 'On' : 'Off'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Email Templates</h5>
                  <div className="configuration-page__stack-list">
                    {emailTemplates.map((template) => (
                      <div key={template.id} className="configuration-page__template-card">
                        <div className="configuration-page__template-header">
                          <strong>{template.name}</strong>
                        </div>
                        <label>Subject</label>
                        <input className="fo-input" value={template.subject} onChange={(event) => handleTemplateChange(template.id, 'subject', event.target.value)} />
                        <label>Body</label>
                        <textarea className="fo-input configuration-page__textarea" value={template.body} onChange={(event) => handleTemplateChange(template.id, 'body', event.target.value)} />
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSaveTemplates}>Save Templates</button>
                </div>

                <div className="configuration-page__subsection">
                  <h5>System-wide Announcements</h5>
                  <div className="configuration-page__announcement-form">
                    <input className="fo-input" placeholder="Announcement title" value={announcementDraft.title} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, title: event.target.value }))} />
                    <select className="fo-select" value={announcementDraft.audience} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, audience: event.target.value }))}>
                      <option value="All users">All users</option>
                      <option value="Recruiters">Recruiters</option>
                      <option value="Candidates">Candidates</option>
                      <option value="Admins">Admins</option>
                    </select>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSendAnnouncement}>Send Announcement</button>
                  </div>

                  <div className="configuration-page__stack-list configuration-page__subsection-list">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="configuration-page__list-row">
                        <div>
                          <strong>{announcement.title}</strong>
                          <span>{announcement.audience} | {announcement.sentAt}</span>
                        </div>
                        <span className="dashboard-pill">{announcement.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'ai' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>AI & Matching Control</h4>
                    <p>Adjust matching weights, approve AI-generated content, monitor recommendation accuracy, and review flagged AI decisions.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveWeights}>Save Matching Weights</button>
                </div>

                <div className="configuration-page__metrics-grid">
                  <div className="configuration-page__metric-card">
                    <strong>{aiMetrics.recommendationAccuracy}%</strong>
                    <span>Recommendation accuracy</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{aiMetrics.recruiterApprovalRate}%</strong>
                    <span>Recruiter approval rate</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{aiMetrics.falsePositiveRate}%</strong>
                    <span>False positive rate</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{aiMetrics.reviewedDecisions}</strong>
                    <span>Reviewed AI decisions</span>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Matching Algorithm Weights</h5>
                    {Object.entries(matchingWeights).map(([key, value]) => (
                      <div key={key} className="configuration-page__weight-row">
                        <label>{key}</label>
                        <input type="number" className="fo-input" value={value} onChange={(event) => handleWeightChange(key, event.target.value)} />
                      </div>
                    ))}
                    <div className="configuration-page__weight-total">Total Weight: {totalWeight}</div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>AI Model Training</h5>
                    <div className="configuration-page__stack-list">
                      {aiModels.map((model) => (
                        <div key={model.id} className="configuration-page__list-row">
                          <div>
                            <strong>{model.name}</strong>
                            <span>Version {model.version} | Last trained {model.lastTrained}</span>
                          </div>
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleTrainModel(model.id)}>
                            {model.status === 'Training' ? 'Training...' : 'Train / Update'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5><i className="fa fa-plug" /> Configure AI Providers</h5>
                  <p>Connect external AI/LLM providers by entering their API endpoint, key, and target model. Credentials are stored in environment configuration — never in the database.</p>
                  <div className="configuration-page__stack-list">
                    {aiProviders.map((provider) => (
                      <div key={provider.id} className="configuration-page__ai-card">
                        <div style={{ flex: 1 }}>
                          <strong>{provider.name}</strong>
                          <span>{provider.usedFor}</span>
                          <div className="configuration-page__inline-controls" style={{ marginTop: '8px', flexWrap: 'wrap' }}>
                            <input
                              className="fo-input"
                              placeholder="API Endpoint URL"
                              value={provider.apiEndpoint}
                              onChange={(event) => handleAiProviderFieldChange(provider.id, 'apiEndpoint', event.target.value)}
                              style={{ flex: '2 1 220px' }}
                            />
                            <input
                              className="fo-input"
                              placeholder="API Key"
                              type="password"
                              value={provider.apiKey}
                              onChange={(event) => handleAiProviderFieldChange(provider.id, 'apiKey', event.target.value)}
                              style={{ flex: '2 1 180px' }}
                            />
                            <input
                              className="fo-input"
                              placeholder="Model (e.g. gpt-4o)"
                              value={provider.model}
                              onChange={(event) => handleAiProviderFieldChange(provider.id, 'model', event.target.value)}
                              style={{ flex: '1 1 140px' }}
                            />
                          </div>
                        </div>
                        <div className="configuration-page__section-actions">
                          <button type="button" className={`btn btn-sm ${provider.enabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleToggleAiProvider(provider.id)}>
                            {provider.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleTestAiProvider(provider.id)}>Test Connection</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Approve or Reject AI-generated Content</h5>
                  <div className="configuration-page__stack-list">
                    {aiGeneratedContent.map((item) => (
                      <div key={item.id} className="configuration-page__ai-card">
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.type} | {item.status}</span>
                          <p>{item.preview}</p>
                        </div>
                        <div className="configuration-page__section-actions">
                          <button type="button" className="btn btn-success btn-sm" onClick={() => handleModerateAiContent(item.id, true)}>Approve</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleModerateAiContent(item.id, false)}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Review Flagged AI Decisions</h5>
                  <div className="configuration-page__stack-list">
                    {flaggedAiDecisions.map((decision) => (
                      <div key={decision.id} className="configuration-page__ai-card">
                        <div>
                          <strong>{decision.area}</strong>
                          <span>{decision.status}</span>
                          <p>{decision.decision}</p>
                          <small>{decision.reason}</small>
                        </div>
                        <div className="configuration-page__section-actions">
                          <button type="button" className="btn btn-success btn-sm" onClick={() => handleResolveAiDecision(decision.id, true)}>Approve Decision</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleResolveAiDecision(decision.id, false)}>Reject Decision</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'security' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Security & Compliance</h4>
                    <p>Review login activity, flag suspicious behavior, control user sessions, enforce password rules, manage 2FA, retention, and GDPR workflows.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveSecuritySettings}>Save Security Settings</button>
                </div>

                <div className="configuration-page__metrics-grid">
                  <div className="configuration-page__metric-card">
                    <strong>{securityLogs.length}</strong>
                    <span>Activity log entries</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{securityLogs.filter((log) => log.suspicious).length}</strong>
                    <span>Suspicious sessions</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</strong>
                    <span>Global 2FA</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{gdprRequests.filter((request) => request.status === 'Open').length}</strong>
                    <span>Open GDPR requests</span>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Login & Activity Logs</h5>
                    <div className="configuration-page__stack-list">
                      {securityLogs.map((log) => (
                        <div key={log.id} className="configuration-page__ai-card">
                          <div>
                            <strong>{log.user}</strong>
                            <span>{log.action}</span>
                            <small>{log.timestamp} | {log.ipAddress} | Risk: {log.risk} | Session: {log.sessionState}</small>
                          </div>
                          <div className="configuration-page__section-actions">
                            <button type="button" className={`btn btn-sm ${log.suspicious ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleToggleSuspicious(log.id)}>
                              {log.suspicious ? 'Marked Suspicious' : 'Mark Suspicious'}
                            </button>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleForceLogout(log.id)}>Force Logout</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Password Policy & 2FA</h5>
                    <div className="configuration-page__weight-row">
                      <label>Minimum Length</label>
                      <input type="number" className="fo-input" value={passwordPolicy.minLength} onChange={(event) => handlePasswordPolicyChange('minLength', event.target.value)} />
                    </div>
                    <div className="configuration-page__weight-row">
                      <label>Password Expiry (days)</label>
                      <input type="number" className="fo-input" value={passwordPolicy.expiryDays} onChange={(event) => handlePasswordPolicyChange('expiryDays', event.target.value)} />
                    </div>
                    <div className="configuration-page__grid configuration-page__grid--three">
                      {[
                        { key: 'requireUppercase', label: 'Require Uppercase' },
                        { key: 'requireNumber', label: 'Require Number' },
                        { key: 'requireSymbol', label: 'Require Symbol' },
                      ].map((rule) => (
                        <div key={rule.key} className="configuration-page__toggle-card">
                          <div>
                            <h5>{rule.label}</h5>
                            <p>Enforce this password rule for all admin and workspace users.</p>
                          </div>
                          <button
                            type="button"
                            className={`btn btn-sm ${passwordPolicy[rule.key] ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => handlePasswordPolicyChange(rule.key, !passwordPolicy[rule.key])}
                          >
                            {passwordPolicy[rule.key] ? 'Required' : 'Optional'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="configuration-page__list-row">
                      <div>
                        <strong>Global Two-Factor Authentication</strong>
                        <span>Enable or disable 2FA across admin and recruiter sign-in flows.</span>
                      </div>
                      <button type="button" className={`btn btn-sm ${twoFactorEnabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setTwoFactorEnabled((previous) => !previous)}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Data Retention Policies</h5>
                    <div className="configuration-page__stack-list">
                      {retentionPolicies.map((policy) => (
                        <div key={policy.id} className="configuration-page__list-row">
                          <div>
                            <strong>{policy.label}</strong>
                            <span>Retention period</span>
                          </div>
                          <div className="configuration-page__retention-controls">
                            <input type="number" className="fo-input" value={policy.duration} onChange={(event) => handleRetentionChange(policy.id, 'duration', event.target.value)} />
                            <select className="fo-select" value={policy.unit} onChange={(event) => handleRetentionChange(policy.id, 'unit', event.target.value)}>
                              <option value="days">Days</option>
                              <option value="months">Months</option>
                              <option value="years">Years</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>GDPR Requests</h5>
                    <div className="configuration-page__stack-list">
                      {gdprRequests.map((request) => (
                        <div key={request.id} className="configuration-page__ai-card">
                          <div>
                            <strong>{request.user}</strong>
                            <span>{request.type} | {request.status}</span>
                            <small>Requested on {request.requestedAt}</small>
                          </div>
                          <div className="configuration-page__section-actions">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleResolveGdprRequest(request.id, 'In Progress')}>Process</button>
                            <button type="button" className="btn btn-success btn-sm" onClick={() => handleResolveGdprRequest(request.id, 'Completed')}>Complete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5><i className="fa fa-shield" /> Manage Roles & Permissions (RBAC)</h5>
                  <p>Define platform roles and grant fine-grained permissions. Super Admin role permissions are locked.</p>

                  <div className="configuration-page__grid configuration-page__grid--two">
                    <div className="configuration-page__panel">
                      <h5>Create Role</h5>
                      <label>Role Name</label>
                      <input className="fo-input" placeholder="e.g. Agency Manager" value={newRoleDraft.name} onChange={(event) => setNewRoleDraft((previous) => ({ ...previous, name: event.target.value }))} />
                      <label>Description</label>
                      <input className="fo-input" placeholder="What this role can do" value={newRoleDraft.description} onChange={(event) => setNewRoleDraft((previous) => ({ ...previous, description: event.target.value }))} />
                      <label>Permissions (select all that apply)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {ALL_PERMISSIONS.filter((p) => p !== 'all').map((perm) => (
                          <button
                            key={perm}
                            type="button"
                            className={`btn btn-sm ${newRoleDraft.permissions.includes(perm) ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '11px', padding: '2px 8px' }}
                            onClick={() => setNewRoleDraft((previous) => ({
                              ...previous,
                              permissions: previous.permissions.includes(perm)
                                ? previous.permissions.filter((p) => p !== perm)
                                : [...previous.permissions, perm],
                            }))}
                          >
                            {perm}
                          </button>
                        ))}
                      </div>
                      <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={handleCreateRole}>Create Role</button>
                    </div>

                    <div className="configuration-page__panel">
                      <h5>Existing Roles</h5>
                      <div className="configuration-page__stack-list">
                        {rbacRoles.map((role) => (
                          <div key={role.id} className="configuration-page__ai-card">
                            <div style={{ flex: 1 }}>
                              <strong>{role.name}</strong>
                              <span>{role.description}</span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                {role.permissions.includes('all')
                                  ? <span className="dashboard-pill dashboard-pill--success">All permissions</span>
                                  : role.permissions.map((perm) => (
                                    <button
                                      key={perm}
                                      type="button"
                                      className="btn btn-sm btn-outline-primary"
                                      style={{ fontSize: '11px', padding: '1px 7px' }}
                                      onClick={() => handleToggleRolePermission(role.id, perm)}
                                      title="Click to revoke"
                                    >
                                      {perm} ×
                                    </button>
                                  ))}
                              </div>
                            </div>
                            {!role.permissions.includes('all') && (
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteRole(role.id)}>Delete</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5><i className="fa fa-key"></i> SSO / SAML Configuration</h5>
                  <p className="configuration-page__description">Configure SAML-based Single Sign-On providers for enterprise workspace login.</p>

                  <div className="configuration-page__grid configuration-page__grid--two">
                    <div className="configuration-page__panel">
                      <h5>Add SSO Provider</h5>
                      <label>Provider Name</label>
                      <input className="fo-input" placeholder="e.g. Okta, Azure AD, OneLogin" value={ssoProviderDraft.name} onChange={(event) => setSsoProviderDraft((previous) => ({ ...previous, name: event.target.value }))} />
                      <label>Entity ID</label>
                      <input className="fo-input" placeholder="https://idp.example.com/saml/metadata" value={ssoProviderDraft.entityId} onChange={(event) => setSsoProviderDraft((previous) => ({ ...previous, entityId: event.target.value }))} />
                      <label>SSO URL</label>
                      <input className="fo-input" placeholder="https://idp.example.com/saml/sso" value={ssoProviderDraft.ssoUrl} onChange={(event) => setSsoProviderDraft((previous) => ({ ...previous, ssoUrl: event.target.value }))} />
                      <label>X.509 Certificate (PEM)</label>
                      <textarea className="fo-input configuration-page__textarea" placeholder="-----BEGIN CERTIFICATE-----..." value={ssoProviderDraft.certificate} onChange={(event) => setSsoProviderDraft((previous) => ({ ...previous, certificate: event.target.value }))} />
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleAddSsoProvider}>Add SSO Provider</button>
                    </div>

                    <div className="configuration-page__panel">
                      <h5>Configured Providers</h5>
                      <div className="configuration-page__stack-list">
                        {ssoProviders.map((provider) => (
                          <div key={provider.id} className="configuration-page__ai-card">
                            <div>
                              <strong>{provider.name}</strong>
                              <span>Entity: {provider.entityId || 'Not set'}</span>
                              <small>SSO URL: {provider.ssoUrl}</small>
                              <small>Certificate: {provider.certificate ? 'Configured' : 'Missing'}</small>
                            </div>
                            <div className="configuration-page__section-actions">
                              <button type="button" className={`btn btn-sm ${provider.status === 'Active' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleToggleSsoProvider(provider.id)}>
                                {provider.status === 'Active' ? 'Active' : 'Activate'}
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveSsoProvider(provider.id)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5><i className="fa fa-sign-in"></i> OAuth 2.0 Providers</h5>
                  <p className="configuration-page__description">Configure social / OAuth login options for job seekers and recruiters. Credentials are stored securely.</p>

                  <div className="configuration-page__stack-list">
                    {oauthProviders.map((provider) => (
                      <div key={provider.id} className="configuration-page__ai-card">
                        <div style={{ flex: 1 }}>
                          <strong>{provider.provider}</strong>
                          <div className="configuration-page__inline-controls" style={{ marginTop: '8px', flexWrap: 'wrap' }}>
                            <input
                              className="fo-input"
                              placeholder="Client ID"
                              value={provider.clientId}
                              onChange={(event) => handleOauthFieldChange(provider.id, 'clientId', event.target.value)}
                              style={{ flex: '1 1 200px' }}
                            />
                            <input
                              className="fo-input"
                              placeholder="Client Secret"
                              type="password"
                              value={provider.clientSecret === '••••••••' ? '' : provider.clientSecret}
                              onChange={(event) => handleOauthFieldChange(provider.id, 'clientSecret', event.target.value)}
                              style={{ flex: '1 1 200px' }}
                            />
                            <input
                              className="fo-input"
                              placeholder="Scopes (comma-separated)"
                              value={provider.scopes}
                              onChange={(event) => handleOauthFieldChange(provider.id, 'scopes', event.target.value)}
                              style={{ flex: '1 1 180px' }}
                            />
                          </div>
                        </div>
                        <div className="configuration-page__section-actions">
                          <button type="button" className={`btn btn-sm ${provider.enabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleToggleOauthProvider(provider.id)}>
                            {provider.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'cms' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>CMS & Content Management</h4>
                    <p>Create blog posts, manage FAQs, publish career resources, edit landing page copy, and upload media assets for public-facing pages.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveLandingPages}>Save Landing Pages</button>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Create Content</h5>
                    <label>Title</label>
                    <input className="fo-input" value={contentDraft.title} onChange={(event) => handleContentDraftChange('title', event.target.value)} />
                    <label>Content Type</label>
                    <select className="fo-select" value={contentDraft.category} onChange={(event) => handleContentDraftChange('category', event.target.value)}>
                      <option value="Blog">Blog Post</option>
                      <option value="Career Resource">Career Resource</option>
                      <option value="Help Center">Help Center Article</option>
                    </select>
                    <label>Body</label>
                    <textarea className="fo-input configuration-page__textarea" value={contentDraft.body} onChange={(event) => handleContentDraftChange('body', event.target.value)} />
                    <button type="button" className="btn btn-primary btn-sm" onClick={handlePublishContent}>Publish Content</button>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Published Content</h5>
                    <div className="configuration-page__stack-list">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="configuration-page__list-row">
                          <div>
                            <strong>{post.title}</strong>
                            <span>{post.category} | {post.status} | Updated {post.updatedAt}</span>
                          </div>
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleToggleContentStatus(post.id)}>
                            {post.status === 'Published' ? 'Move to Draft' : 'Publish'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Help Center & FAQs</h5>
                    <label>Question</label>
                    <input className="fo-input" value={faqDraft.question} onChange={(event) => setFaqDraft((previous) => ({ ...previous, question: event.target.value }))} />
                    <label>Answer</label>
                    <textarea className="fo-input configuration-page__textarea" value={faqDraft.answer} onChange={(event) => setFaqDraft((previous) => ({ ...previous, answer: event.target.value }))} />
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSaveFaq}>Save FAQ</button>

                    <div className="configuration-page__stack-list configuration-page__subsection-list">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="configuration-page__ai-card">
                          <div>
                            <strong>{faq.question}</strong>
                            <span>{faq.status}</span>
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Landing Pages</h5>
                    <div className="configuration-page__stack-list">
                      {landingPages.map((page) => (
                        <div key={page.id} className="configuration-page__template-card">
                          <div className="configuration-page__template-header">
                            <strong>{page.name}</strong>
                          </div>
                          <label>Headline</label>
                          <input className="fo-input" value={page.headline} onChange={(event) => handleLandingPageChange(page.id, 'headline', event.target.value)} />
                          <label>CTA Label</label>
                          <input className="fo-input" value={page.ctaLabel} onChange={(event) => handleLandingPageChange(page.id, 'ctaLabel', event.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Media Library</h5>
                  <div className="configuration-page__media-toolbar">
                    <label className="btn btn-outline-primary btn-sm configuration-page__upload-button">
                      Upload Images or Videos
                      <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} />
                    </label>
                  </div>
                  <div className="configuration-page__grid configuration-page__grid--three">
                    {mediaLibrary.length === 0 && (
                      <div className="configuration-page__panel configuration-page__panel--muted">
                        No media uploaded yet.
                      </div>
                    )}
                    {mediaLibrary.map((asset) => (
                      <div key={asset.id} className="configuration-page__ai-card">
                        <div>
                          <strong>{asset.name}</strong>
                          <span>{asset.type}</span>
                          <small>{asset.size}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'advanced' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Advanced Admin Actions</h4>
                    <p>Configure custom schemas, hiring pipelines, indexing, recommendation rules, and support SLAs.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveAdvancedSettings}>Save Advanced Settings</button>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Custom Fields (Jobs & Applications)</h5>
                    <div className="configuration-page__inline-controls">
                      <select className="fo-select" value={customFieldDraft.target} onChange={(event) => handleCustomFieldDraftChange('target', event.target.value)}>
                        <option value="jobs">Jobs</option>
                        <option value="applications">Applications</option>
                      </select>
                      <input className="fo-input" placeholder="Field name" value={customFieldDraft.name} onChange={(event) => handleCustomFieldDraftChange('name', event.target.value)} />
                      <select className="fo-select" value={customFieldDraft.type} onChange={(event) => handleCustomFieldDraftChange('type', event.target.value)}>
                        <option value="Text">Text</option>
                        <option value="Number">Number</option>
                        <option value="Date">Date</option>
                        <option value="URL">URL</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Select">Select</option>
                      </select>
                      <button type="button" className={`btn btn-sm ${customFieldDraft.required ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleCustomFieldDraftChange('required', !customFieldDraft.required)}>
                        {customFieldDraft.required ? 'Required' : 'Optional'}
                      </button>
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddCustomField}>Add Field</button>
                    </div>

                    <div className="configuration-page__grid configuration-page__grid--two configuration-page__subsection-list">
                      <div className="configuration-page__template-card">
                        <h5>Job Fields</h5>
                        <div className="configuration-page__stack-list">
                          {customFields.jobs.map((field) => (
                            <div key={field.id} className="configuration-page__list-row">
                              <div>
                                <strong>{field.name}</strong>
                                <span>{field.type} | {field.required ? 'Required' : 'Optional'}</span>
                              </div>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveCustomField('jobs', field.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="configuration-page__template-card">
                        <h5>Application Fields</h5>
                        <div className="configuration-page__stack-list">
                          {customFields.applications.map((field) => (
                            <div key={field.id} className="configuration-page__list-row">
                              <div>
                                <strong>{field.name}</strong>
                                <span>{field.type} | {field.required ? 'Required' : 'Optional'}</span>
                              </div>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveCustomField('applications', field.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Hiring Pipelines (Stages)</h5>
                    <div className="configuration-page__inline-controls">
                      <input className="fo-input" placeholder="Stage name" value={stageDraft.name} onChange={(event) => setStageDraft((previous) => ({ ...previous, name: event.target.value }))} />
                      <input type="number" className="fo-input" value={stageDraft.slaHours} onChange={(event) => setStageDraft((previous) => ({ ...previous, slaHours: Number(event.target.value) || 0 }))} />
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddPipelineStage}>Add Stage</button>
                    </div>
                    <div className="configuration-page__stack-list configuration-page__subsection-list">
                      {pipelineStages.map((stage) => (
                        <div key={stage.id} className="configuration-page__list-row">
                          <div>
                            <strong>{stage.name}</strong>
                            <span>{stage.active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div className="configuration-page__retention-controls">
                            <input type="number" className="fo-input" value={stage.slaHours} onChange={(event) => handleStageSlaChange(stage.id, event.target.value)} />
                            <button type="button" className={`btn btn-sm ${stage.active ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleTogglePipelineStage(stage.id)}>
                              {stage.active ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Search Indexing & Recommendation Rules</h5>
                    <div className="configuration-page__stack-list">
                      {[
                        { key: 'allowSearchIndexing', label: 'Allow Search Indexing' },
                        { key: 'includeJobPages', label: 'Include Job Pages' },
                        { key: 'includeCompanyPages', label: 'Include Company Pages' },
                        { key: 'sitemapAutoRefresh', label: 'Auto Refresh Sitemap' },
                      ].map((setting) => (
                        <div key={setting.key} className="configuration-page__list-row">
                          <div>
                            <strong>{setting.label}</strong>
                          </div>
                          <button type="button" className={`btn btn-sm ${indexingSettings[setting.key] ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleToggleIndexingSetting(setting.key)}>
                            {indexingSettings[setting.key] ? 'On' : 'Off'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="configuration-page__subsection">
                      <h5>Recommendation Engine Rules</h5>
                      <div className="configuration-page__stack-list">
                        {recommendationRules.map((rule) => (
                          <div key={rule.id} className="configuration-page__list-row">
                            <div>
                              <strong>{rule.name}</strong>
                            </div>
                            <div className="configuration-page__retention-controls">
                              <input type="number" className="fo-input" value={rule.weight} onChange={(event) => handleRuleChange(rule.id, 'weight', event.target.value)} />
                              <button type="button" className={`btn btn-sm ${rule.enabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleRuleChange(rule.id, 'enabled', !rule.enabled)}>
                                {rule.enabled ? 'Enabled' : 'Disabled'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Support SLAs</h5>
                    <div className="configuration-page__stack-list">
                      {supportSlas.map((sla) => (
                        <div key={sla.id} className="configuration-page__list-row">
                          <div>
                            <strong>{sla.priority}</strong>
                            <span>Response (mins) and resolution (hours)</span>
                          </div>
                          <div className="configuration-page__sla-controls">
                            <input type="number" className="fo-input" value={sla.firstResponseMins} onChange={(event) => handleSlaChange(sla.id, 'firstResponseMins', event.target.value)} />
                            <input type="number" className="fo-input" value={sla.resolutionHours} onChange={(event) => handleSlaChange(sla.id, 'resolutionHours', event.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'admin-settings' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Admin Settings</h4>
                    <p>Manage graphics theme, integration settings, branding settings, and profile settings from one dedicated panel.</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveAdminSettings}>Save Admin Settings</button>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Graphics Theme Settings</h5>
                  <div className="configuration-page__inline-controls">
                    <select className="fo-select" value={themeSettings.themeMode} onChange={(event) => handleThemeSettingChange('themeMode', event.target.value)}>
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                      <option value="System">System</option>
                    </select>
                    <select className="fo-select" value={themeSettings.density} onChange={(event) => handleThemeSettingChange('density', event.target.value)}>
                      <option value="Compact">Compact</option>
                      <option value="Comfortable">Comfortable</option>
                      <option value="Spacious">Spacious</option>
                    </select>
                    <select className="fo-select" value={themeSettings.chartPalette} onChange={(event) => handleThemeSettingChange('chartPalette', event.target.value)}>
                      <option value="Ocean">Ocean</option>
                      <option value="Mono">Mono</option>
                      <option value="Contrast">High Contrast</option>
                    </select>
                    <button type="button" className={`btn btn-sm ${themeSettings.enableAnimations ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleThemeSettingChange('enableAnimations', !themeSettings.enableAnimations)}>
                      {themeSettings.enableAnimations ? 'Animations On' : 'Animations Off'}
                    </button>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Integration Settings</h5>
                  <div className="configuration-page__panel">
                    <div className="configuration-page__list-row">
                      <div>
                        <strong>API Access</strong>
                        <span>Enable or disable external API consumption.</span>
                      </div>
                      <button type="button" className={`btn btn-sm ${integrationSettings.apiAccessEnabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleIntegrationSettingChange('apiAccessEnabled', !integrationSettings.apiAccessEnabled)}>
                        {integrationSettings.apiAccessEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <label>API Base URL</label>
                    <input className="fo-input" value={integrationSettings.apiBaseUrl} onChange={(event) => handleIntegrationSettingChange('apiBaseUrl', event.target.value)} />
                    <div className="configuration-page__list-row">
                      <div>
                        <strong>Webhooks</strong>
                        <span>Enable event pushes to downstream systems.</span>
                      </div>
                      <button type="button" className={`btn btn-sm ${integrationSettings.webhooksEnabled ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => handleIntegrationSettingChange('webhooksEnabled', !integrationSettings.webhooksEnabled)}>
                        {integrationSettings.webhooksEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="configuration-page__inline-controls configuration-page__subsection-list">
                      <select className="fo-select" value={webhookDraft.event} onChange={(event) => setWebhookDraft((previous) => ({ ...previous, event: event.target.value }))}>
                        <option value="application.created">application.created</option>
                        <option value="application.updated">application.updated</option>
                        <option value="job.published">job.published</option>
                        <option value="candidate.matched">candidate.matched</option>
                      </select>
                      <input className="fo-input" placeholder="Webhook URL" value={webhookDraft.url} onChange={(event) => setWebhookDraft((previous) => ({ ...previous, url: event.target.value }))} />
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddWebhook}>Add Webhook</button>
                    </div>

                    <div className="configuration-page__stack-list configuration-page__subsection-list">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="configuration-page__list-row">
                          <div>
                            <strong>{webhook.event}</strong>
                            <span>{webhook.url} | {webhook.status}</span>
                          </div>
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleToggleWebhook(webhook.id)}>
                            {webhook.status === 'Active' ? 'Pause' : 'Activate'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Branding Settings</h5>
                  <div className="configuration-page__inline-controls">
                    <input className="fo-input" value={brandingSettings.primaryColor} onChange={(event) => handleBrandingSettingChange('primaryColor', event.target.value)} />
                    <input className="fo-input" value={brandingSettings.accentColor} onChange={(event) => handleBrandingSettingChange('accentColor', event.target.value)} />
                    <select className="fo-select" value={brandingSettings.logoShape} onChange={(event) => handleBrandingSettingChange('logoShape', event.target.value)}>
                      <option value="Rounded">Rounded</option>
                      <option value="Square">Square</option>
                      <option value="Minimal">Minimal</option>
                    </select>
                    <input className="fo-input" value={brandingSettings.landingHeadingFont} onChange={(event) => handleBrandingSettingChange('landingHeadingFont', event.target.value)} />
                  </div>
                </div>

                <div className="configuration-page__subsection">
                  <h5>Profile Settings</h5>
                  <div className="configuration-page__inline-controls">
                    <input className="fo-input" value={profileSettings.adminDisplayName} onChange={(event) => handleProfileSettingChange('adminDisplayName', event.target.value)} />
                    <select className="fo-select" value={profileSettings.profileVisibility} onChange={(event) => handleProfileSettingChange('profileVisibility', event.target.value)}>
                      <option value="Private">Private</option>
                      <option value="Internal">Internal</option>
                      <option value="Public">Public</option>
                    </select>
                    <select className="fo-select" value={profileSettings.timezonePreference} onChange={(event) => handleProfileSettingChange('timezonePreference', event.target.value)}>
                      <option value="UTC">UTC</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Africa/Tunis">Africa/Tunis</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                    <select className="fo-select" value={profileSettings.localePreference} onChange={(event) => handleProfileSettingChange('localePreference', event.target.value)}>
                      <option value="en-US">en-US</option>
                      <option value="fr-FR">fr-FR</option>
                      <option value="ar-TN">ar-TN</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'admin-job-posting' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Job Posting Actions (Core Revenue Driver)</h4>
                    <p>Create, configure, publish, schedule, promote, and refresh admin-managed job posts.</p>
                  </div>
                  <div className="configuration-page__section-actions">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetAdminJobDraft}>New Job</button>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadAdminJobPosting}>Refresh List</button>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Creation</h5>
                    <label>Use Job Template</label>
                    <div className="configuration-page__inline-controls">
                      <select className="fo-select" value={templateToUse} onChange={(event) => setTemplateToUse(event.target.value)}>
                        {jobPostingTemplates.map((template) => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleApplyJobTemplate}>Use Template</button>
                    </div>

                    <div className="configuration-page__subsection">
                      <h5>Define Job Configuration</h5>
                      <label>Job Title</label>
                      <input className="fo-input" value={jobPostDraft.title} onChange={(event) => handleJobDraftField('title', event.target.value)} />
                      <label>Description</label>
                      <textarea className="configuration-page__textarea" value={jobPostDraft.description} onChange={(event) => handleJobDraftField('description', event.target.value)} />
                      <label>Requirements</label>
                      <textarea className="configuration-page__textarea" value={jobPostDraft.requirements} onChange={(event) => handleJobDraftField('requirements', event.target.value)} />

                      <div className="configuration-page__inline-controls">
                        <input className="fo-input" type="number" placeholder="Salary min" value={jobPostDraft.salaryMin} onChange={(event) => handleJobDraftField('salaryMin', event.target.value)} />
                        <input className="fo-input" type="number" placeholder="Salary max" value={jobPostDraft.salaryMax} onChange={(event) => handleJobDraftField('salaryMax', event.target.value)} />
                      </div>

                      <label>Location(s) (comma separated)</label>
                      <input className="fo-input" placeholder="Remote, Tunis" value={jobPostDraft.locations} onChange={(event) => handleJobDraftField('locations', event.target.value)} />

                      <div className="configuration-page__inline-controls">
                        <select className="fo-select" value={jobPostDraft.employmentType} onChange={(event) => handleJobDraftField('employmentType', event.target.value)}>
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Internship">Internship</option>
                        </select>
                        <select className="fo-select" value={jobPostDraft.visibility} onChange={(event) => handleJobDraftField('visibility', event.target.value)}>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                          <option value="Invite-only">Invite-only</option>
                        </select>
                      </div>

                      <label>Application Deadline</label>
                      <input className="fo-input" type="date" value={jobPostDraft.applicationDeadline || ''} onChange={(event) => handleJobDraftField('applicationDeadline', event.target.value)} />
                    </div>

                    <div className="configuration-page__subsection">
                      <h5>Add Screening Questions</h5>
                      <div className="configuration-page__inline-controls">
                        <select className="fo-select" value={screeningQuestionDraft.type} onChange={(event) => setScreeningQuestionDraft((previous) => ({ ...previous, type: event.target.value }))}>
                          <option value="yes_no">Yes / No</option>
                          <option value="mcq">Multiple Choice</option>
                          <option value="custom">Custom</option>
                        </select>
                        <input className="fo-input" placeholder="Question text" value={screeningQuestionDraft.question} onChange={(event) => setScreeningQuestionDraft((previous) => ({ ...previous, question: event.target.value }))} />
                      </div>
                      {screeningQuestionDraft.type === 'mcq' && (
                        <input className="fo-input" placeholder="MCQ options (comma separated)" value={screeningQuestionDraft.options} onChange={(event) => setScreeningQuestionDraft((previous) => ({ ...previous, options: event.target.value }))} />
                      )}
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddScreeningQuestion}>Add Question</button>

                      <div className="configuration-page__stack-list configuration-page__subsection-list">
                        {jobPostDraft.screeningQuestions.map((question) => (
                          <div key={question.id} className="configuration-page__list-row">
                            <div>
                              <strong>{question.question}</strong>
                              <span>{question.type}{question.options?.length ? ` | ${question.options.join(' / ')}` : ''}</span>
                            </div>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveScreeningQuestion(question.id)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="configuration-page__section-actions">
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleSaveAdminJobPost('Draft')}>Save Draft Job</button>
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleSaveAdminJobPost('Published')}>Create & Publish</button>
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Publishing</h5>
                    <label>Schedule Job Posting</label>
                    <div className="configuration-page__inline-controls">
                      <input className="fo-input" type="datetime-local" value={scheduleDraft} onChange={(event) => setScheduleDraft(event.target.value)} />
                      <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => selectedAdminJobId && handleScheduleAdminJob(selectedAdminJobId)} disabled={!selectedAdminJobId}>Schedule</button>
                    </div>

                    <label>Promote / Feature Job (Paid)</label>
                    <div className="configuration-page__inline-controls">
                      <select className="fo-select" value={promotionDraft.promotionPlan} onChange={(event) => setPromotionDraft((previous) => ({ ...previous, promotionPlan: event.target.value }))}>
                        <option value="Featured - 7 days">Featured - 7 days</option>
                        <option value="Top Slot - 14 days">Top Slot - 14 days</option>
                        <option value="Homepage Spotlight">Homepage Spotlight</option>
                      </select>
                      <button type="button" className={`btn btn-sm ${promotionDraft.paidPromotion ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setPromotionDraft((previous) => ({ ...previous, paidPromotion: !previous.paidPromotion }))}>
                        {promotionDraft.paidPromotion ? 'Paid Promotion On' : 'Paid Promotion Off'}
                      </button>
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => selectedAdminJobId && handlePromoteAdminJob(selectedAdminJobId)} disabled={!selectedAdminJobId}>Promote</button>
                    </div>

                    <div className="configuration-page__subsection">
                      <h5>Existing Job Posts</h5>
                      <div className="configuration-page__stack-list">
                        {adminJobPosts.map((job) => (
                          <div key={job.id} className="configuration-page__list-row">
                            <div>
                              <strong>{job.title || 'Untitled job'}</strong>
                              <span>
                                {job.status} | {job.visibility} | {job.employmentType} | Boosts: {job.boostCount || 0}
                              </span>
                            </div>
                            <div className="configuration-page__inline-controls">
                              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => hydrateDraftFromJob(job)}>Edit</button>
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleDuplicateAdminJob(job.id)}>Duplicate</button>
                              <button type="button" className="btn btn-success btn-sm" onClick={() => handlePublishAdminJob(job.id)}>Publish</button>
                              <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => handleUnpublishAdminJob(job.id)}>Unpublish</button>
                              <button type="button" className="btn btn-outline-info btn-sm" onClick={() => handleRefreshAdminJob(job.id)}>Refresh</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!adminJobPosts.length && <p>No admin job posts yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'analytics' && (
            <section className="card">
              <div className="card-body configuration-page__section">
                <div className="configuration-page__section-header">
                  <div>
                    <h4>Analytics & Reporting</h4>
                    <p>Track platform, hiring, and financial KPIs, then export or schedule automated admin reports.</p>
                  </div>
                  <div className="configuration-page__section-actions">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleExportReport('CSV')}>Export CSV</button>
                    <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleExportReport('EXCEL')}>Export Excel</button>
                  </div>
                </div>

                <div className="configuration-page__metrics-grid">
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.platform.totalUsers}</strong>
                    <span>Total users</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.platform.activeUsersDaily}</strong>
                    <span>Active users (daily)</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.platform.jobPostingsVolume}</strong>
                    <span>Job postings volume</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.platform.applicationsPerJob}</strong>
                    <span>Applications per job</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.hiring.timeToHireDays} days</strong>
                    <span>Time-to-hire</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.hiring.conversionRateViewToApply}%</strong>
                    <span>View to apply conversion</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.financial.netRevenue}</strong>
                    <span>Net revenue</span>
                  </div>
                  <div className="configuration-page__metric-card">
                    <strong>{analyticsSnapshot.financial.churnRate}%</strong>
                    <span>Churn rate</span>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Top Performing Companies</h5>
                    <div className="configuration-page__stack-list">
                      {(analyticsSnapshot.hiring.topPerformingCompanies || []).map((company) => (
                        <div key={company} className="configuration-page__list-row">
                          <strong>{company}</strong>
                        </div>
                      ))}
                      {(analyticsSnapshot.hiring.topPerformingCompanies || []).length === 0 && (
                        <div className="configuration-page__panel configuration-page__panel--muted">No company data available.</div>
                      )}
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Top Performing Jobs</h5>
                    <div className="configuration-page__stack-list">
                      {(analyticsSnapshot.hiring.topPerformingJobs || []).map((job) => (
                        <div key={job} className="configuration-page__list-row">
                          <strong>{job}</strong>
                        </div>
                      ))}
                      {(analyticsSnapshot.hiring.topPerformingJobs || []).length === 0 && (
                        <div className="configuration-page__panel configuration-page__panel--muted">No job data available.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="configuration-page__grid configuration-page__grid--two">
                  <div className="configuration-page__panel">
                    <h5>Schedule Automated Reports</h5>
                    <div className="configuration-page__inline-controls">
                      <input className="fo-input" value={reportScheduleDraft.name} onChange={(event) => setReportScheduleDraft((previous) => ({ ...previous, name: event.target.value }))} />
                      <select className="fo-select" value={reportScheduleDraft.format} onChange={(event) => setReportScheduleDraft((previous) => ({ ...previous, format: event.target.value }))}>
                        <option value="CSV">CSV</option>
                        <option value="EXCEL">Excel</option>
                      </select>
                      <select className="fo-select" value={reportScheduleDraft.frequency} onChange={(event) => setReportScheduleDraft((previous) => ({ ...previous, frequency: event.target.value }))}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <input className="fo-input" value={reportScheduleDraft.email} onChange={(event) => setReportScheduleDraft((previous) => ({ ...previous, email: event.target.value }))} />
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleScheduleReport}>Schedule Report</button>
                    </div>

                    <div className="configuration-page__stack-list configuration-page__subsection-list">
                      {(analyticsSnapshot.exportActions.scheduledReports || []).map((schedule) => (
                        <div key={schedule.id} className="configuration-page__list-row">
                          <div>
                            <strong>{schedule.name}</strong>
                            <span>{schedule.frequency} | {schedule.format} | {schedule.email}</span>
                          </div>
                          <span className="dashboard-pill">{schedule.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="configuration-page__panel">
                    <h5>Recent Report Exports</h5>
                    <div className="configuration-page__stack-list">
                      {(analyticsSnapshot.exportActions.exports || []).map((item) => (
                        <div key={item.id} className="configuration-page__list-row">
                          <div>
                            <strong>{item.format}</strong>
                            <span>{item.createdAt}</span>
                          </div>
                          <span className="dashboard-pill">{item.status}</span>
                        </div>
                      ))}
                      {(analyticsSnapshot.exportActions.exports || []).length === 0 && (
                        <div className="configuration-page__panel configuration-page__panel--muted">No export history yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

Configuration.propTypes = {};
Configuration.defaultProps = {};

export default Configuration;