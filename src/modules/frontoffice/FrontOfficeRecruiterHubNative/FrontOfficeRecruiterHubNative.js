import '../../../modules/shared/DashBoard/DashBoard.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import FrontOfficeLayout from '../shared/FrontOfficeLayout';
import useSeo from '../shared/useSeo';
import recruiterHTTPService from '../../../main/services/recruiterHTTPService';

const RECRUITER_MENU = [
  { id: 'overview', label: 'Recruiter Overview', icon: 'fa-tachometer' },
  { id: 'account', label: 'Account & Workspace', icon: 'fa-id-card' },
  { id: 'team', label: 'Team Management', icon: 'fa-users' },
  { id: 'company', label: 'Company Profile', icon: 'fa-building' },
  { id: 'media', label: 'Branding & Visibility', icon: 'fa-picture-o' },
  { id: 'reviews', label: 'Reviews & Reputation', icon: 'fa-comments' },
  { id: 'jobs', label: 'Job Management', icon: 'fa-briefcase' },
  { id: 'ats', label: 'Application Management', icon: 'fa-sitemap' },
  { id: 'sourcing', label: 'Candidate Search & Sourcing', icon: 'fa-search' },
  { id: 'communication', label: 'Communication Actions', icon: 'fa-envelope' },
  { id: 'interviews', label: 'Interview Management', icon: 'fa-calendar' },
  { id: 'evaluation', label: 'Candidate Evaluation', icon: 'fa-star-half-o' },
  { id: 'offers', label: 'Offer & Hiring Actions', icon: 'fa-handshake-o' },
  { id: 'analytics', label: 'Analytics & Reporting', icon: 'fa-line-chart' },
  { id: 'billing', label: 'Subscription & Billing', icon: 'fa-credit-card' },
  { id: 'notifications', label: 'Notification Actions', icon: 'fa-bell-o' },
  { id: 'ai', label: 'AI-Powered Actions', icon: 'fa-magic' },
  { id: 'crm', label: 'Talent Pool & CRM', icon: 'fa-folder-open-o' },
  { id: 'settings', label: 'Settings & Controls', icon: 'fa-cog' },
  { id: 'automation', label: 'Automation Actions', icon: 'fa-refresh' },
];

const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const emptyRegisterForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'Recruiter',
  contactPhone: '',
  companyName: '',
};

const emptyCreateCompanyForm = {
  name: '',
  description: '',
};

const emptyInviteForm = {
  name: '',
  email: '',
  role: 'HR',
  permissions: 'post_jobs,review_candidates',
};

const emptyProfileForm = {
  fullName: '',
  role: '',
  contactPhone: '',
};

const emptyCompanyProfile = {
  name: '',
  description: '',
  culture: '',
  benefits: '',
  logoUrl: '',
  bannerUrl: '',
};

const emptyTemplateForm = {
  name: '',
  subject: '',
  body: '',
};

const emptySequenceForm = {
  name: '',
  stepsText: '0|Initial outreach|Hi {{candidateName}},\n3|Follow up|Hi {{candidateName}}, checking in on the previous message.',
};

const emptyInterviewForm = {
  applicationId: '',
  interviewType: 'Video',
  proposedSlots: '',
  selectedSlot: '',
  calendarProvider: 'None',
  notes: '',
  interviewerName: '',
  interviewerEmail: '',
  meetingLink: '',
};

const emptyAssessmentForm = {
  applicationId: '',
  testTitle: '',
  testType: 'Technical',
  dueDate: '',
  maxScore: '100',
};

const emptyAssessmentTemplateForm = {
  title: '',
  type: 'Technical',
  description: '',
  durationMinutes: '60',
  maxScore: '100',
};

const emptyJobForm = {
  title: '',
  description: '',
  requirements: '',
  salary: '',
  location: '',
  employmentType: 'Full-time',
  skills: '',
  benefits: '',
  applicationDeadline: '',
};

const emptyOfferForm = {
  applicationId: '',
  compensation: '',
  proposedStartDate: '',
  notes: '',
  offerLetterUrl: '',
};

const emptyCloseJobForm = {
  jobId: '',
  reason: '',
};

const emptyManagerFeedbackForm = {
  hiringManagerName: '',
  recruiterId: '',
  recruiterName: '',
  feedback: '',
  score: '',
};

const emptyPlanForm = {
  planName: 'Standard',
  billingCycle: 'Monthly',
};

const emptyCreditsForm = {
  credits: '',
  unitPrice: '15',
};

const emptyFeaturedListingForm = {
  jobId: '',
  quantity: '1',
  unitPrice: '50',
};

const emptyPaymentMethodForm = {
  methodType: 'Card',
  provider: '',
  last4: '',
  cardHolder: '',
  expiryMonth: '',
  expiryYear: '',
  billingEmail: '',
  isDefault: true,
};

const getStoredRecruiter = () => {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const FrontOfficeRecruiterHubNative = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [actionMessage, setActionMessage] = useState('');
  const [workspace, setWorkspace] = useState({
    recruiter: null,
    companies: [],
    activeCompany: null,
    teamMembers: [],
    invitations: [],
  });

  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [createCompanyForm, setCreateCompanyForm] = useState(emptyCreateCompanyForm);
  const [joinCompanyName, setJoinCompanyName] = useState('');
  const [inviteForm, setInviteForm] = useState(emptyInviteForm);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [companyProfileForm, setCompanyProfileForm] = useState(emptyCompanyProfile);
  const [mediaUrl, setMediaUrl] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [reviewResponses, setReviewResponses] = useState({});
  const [atsJobs, setAtsJobs] = useState([]);
  const [atsApplicants, setAtsApplicants] = useState([]);
  const [atsFilters, setAtsFilters] = useState({
    skills: '',
    minExperience: '',
    screening: '',
    stage: '',
    sortBy: 'relevance',
  });
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [bulkStage, setBulkStage] = useState('Screening');
  const [candidateProfiles, setCandidateProfiles] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});
  const [tagDrafts, setTagDrafts] = useState({});
  const [candidateFilters, setCandidateFilters] = useState({
    keyword: '',
    skills: '',
    location: '',
    minExperience: '',
    booleanQuery: '',
    salary: '',
    education: '',
    industry: '',
    availability: '',
  });
  const [candidateSearchResult, setCandidateSearchResult] = useState({
    candidates: [],
    shortlist: { candidateIds: [] },
    talentPools: [],
  });
  const [candidateSearchProfiles, setCandidateSearchProfiles] = useState({});
  const [poolDrafts, setPoolDrafts] = useState({});
  const [outreachDrafts, setOutreachDrafts] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [templateForm, setTemplateForm] = useState(emptyTemplateForm);
  const [messageForm, setMessageForm] = useState({ candidateId: '', subject: '', body: '', attachments: '' });
  const [bulkMessageForm, setBulkMessageForm] = useState({ candidateIds: '', subject: '', body: '', attachments: '' });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [automationForm, setAutomationForm] = useState({
    candidateId: '',
    interviewDate: '',
    interviewMode: 'Online',
    reason: '',
    followUpBody: '',
    attachments: '',
  });
  const [sequenceForm, setSequenceForm] = useState(emptySequenceForm);
  const [sequences, setSequences] = useState([]);
  const [interviewForm, setInterviewForm] = useState(emptyInterviewForm);
  const [interviews, setInterviews] = useState([]);
  const [interviewFeedbackDrafts, setInterviewFeedbackDrafts] = useState({});
  const [interviewShareDrafts, setInterviewShareDrafts] = useState({});
  const [interviewNoteDrafts, setInterviewNoteDrafts] = useState({});
  const [ratingDrafts, setRatingDrafts] = useState({});
  const [structuredFeedbackDrafts, setStructuredFeedbackDrafts] = useState({});
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [compareIdsInput, setCompareIdsInput] = useState('');
  const [compareResult, setCompareResult] = useState([]);
  const [assessmentForm, setAssessmentForm] = useState(emptyAssessmentForm);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [assessmentReviewDrafts, setAssessmentReviewDrafts] = useState({});
  const [offers, setOffers] = useState([]);
  const [offerForm, setOfferForm] = useState(emptyOfferForm);
  const [offerLetterDrafts, setOfferLetterDrafts] = useState({});
  const [closeJobForm, setCloseJobForm] = useState(emptyCloseJobForm);
  const [jobPerformanceReport, setJobPerformanceReport] = useState([]);
  const [hiringMetrics, setHiringMetrics] = useState({ averageTimeToHire: 0, averageCostPerHire: 0, sourceOfCandidates: [] });
  const [teamPerformance, setTeamPerformance] = useState({ recruiterActivityStats: [], hiringManagerFeedback: [] });
  const [managerFeedbackForm, setManagerFeedbackForm] = useState(emptyManagerFeedbackForm);
  const [subscription, setSubscription] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [creditsForm, setCreditsForm] = useState(emptyCreditsForm);
  const [featuredListingForm, setFeaturedListingForm] = useState(emptyFeaturedListingForm);
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodForm, setPaymentMethodForm] = useState(emptyPaymentMethodForm);
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    alerts: {
      newApplicants: true,
      messages: true,
      interviewConfirmations: true,
    },
  });
  const [notifications, setNotifications] = useState([]);
  const [aiJobForm, setAiJobForm] = useState({ jobTitle: '', seniority: 'Mid-level', location: '', requiredSkills: '', minExperience: '' });
  const [aiCandidateForm, setAiCandidateForm] = useState({ candidateId: '', requiredSkills: '', minExperience: '', location: '' });
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState('');
  const [aiRecommendedCandidates, setAiRecommendedCandidates] = useState([]);
  const [aiMatchScore, setAiMatchScore] = useState(null);
  const [aiRankedApplicants, setAiRankedApplicants] = useState([]);
  const [aiInterviewQuestions, setAiInterviewQuestions] = useState([]);
  const [aiOutreachMessage, setAiOutreachMessage] = useState({ subject: '', body: '' });
  const [aiSuccessPrediction, setAiSuccessPrediction] = useState(null);
  const [crmPoolForm, setCrmPoolForm] = useState({ name: 'Frontend Developers' });
  const [crmActionForm, setCrmActionForm] = useState({ candidateId: '', poolName: 'General Talent Pool', tags: 'Strong,React' });
  const [crmHistory, setCrmHistory] = useState(null);

  // 15. Settings & Control Actions state
  const [pipelineConfig, setPipelineConfig] = useState(null);
  const [pipelineStagesInput, setPipelineStagesInput] = useState('Applied,Screening,Interview,Assessment,Offer,Hired,Rejected');
  const [appFormConfig, setAppFormConfig] = useState(null);
  const [teamPermissions, setTeamPermissions] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [emailTemplateForm, setEmailTemplateForm] = useState({ id: '', name: '', subject: '', body: '' });
  const [integrationsList, setIntegrationsList] = useState([]);
  const [integrationForm, setIntegrationForm] = useState({ id: '', name: '', type: 'ATS', apiKey: '', webhookUrl: '' });
  const [settingsActionMsg, setSettingsActionMsg] = useState('');

  // 16. Automation Actions state
  const [automationRules, setAutomationRules] = useState([]);
  const [autoMoveForm, setAutoMoveForm] = useState({ targetStage: 'Interview', criteria: 'minExperienceYears:3' });
  const [autoRejectForm, setAutoRejectForm] = useState({ screeningConditions: 'requiredDegree:Bachelor', rejectMessage: '' });
  const [followUpForm, setFollowUpForm] = useState({ candidateId: '', jobId: '', subject: 'Following up on your application', sendAt: '' });
  const [reminderForm, setReminderForm] = useState({ inactiveDaysThreshold: 7, stage: 'Screening', message: '' });
  const [hiringWorkflows, setHiringWorkflows] = useState([]);
  const [workflowForm, setWorkflowForm] = useState({ name: '', description: '', steps: 'Source,Screen,Interview,Offer' });
  const [automationActionMsg, setAutomationActionMsg] = useState('');

  // NEW: Job Management
  const [companyJobs, setCompanyJobs] = useState([]);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [editingJobId, setEditingJobId] = useState(null);

  // NEW: Assessment Templates
  const [assessmentTemplates, setAssessmentTemplates] = useState([]);
  const [assessmentTemplateForm, setAssessmentTemplateForm] = useState(emptyAssessmentTemplateForm);

  // NEW: Assign Recruiter drafts (keyed by applicationId)
  const [assignRecruiterDrafts, setAssignRecruiterDrafts] = useState({});

  // NEW: Negotiate offer drafts (keyed by offerId)
  const [negotiateDrafts, setNegotiateDrafts] = useState({});

  const recruiterId = useMemo(() => {
    const recruiter = getStoredRecruiter();
    return recruiter && recruiter.id ? recruiter.id : null;
  }, []);

  useSeo('UPRECRUIT Recruiter Workspace', 'Manage recruiter account, teams, company profile, and employer branding actions.');

  const loadWorkspace = () => {
    if (!recruiterId) {
      setIsLoading(false);
      return;
    }

    recruiterHTTPService.getWorkspace(recruiterId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setWorkspace({
          recruiter: data.recruiter || null,
          companies: data.companies || [],
          activeCompany: data.activeCompany || null,
          teamMembers: data.teamMembers || [],
          invitations: data.invitations || [],
        });

        if (data.recruiter) {
          setProfileForm({
            fullName: data.recruiter.fullName || '',
            role: data.recruiter.role || '',
            contactPhone: data.recruiter.contactPhone || '',
          });
        }

        if (data.activeCompany) {
          setCompanyProfileForm({
            name: data.activeCompany.name || '',
            description: data.activeCompany.description || '',
            culture: data.activeCompany.culture || '',
            benefits: data.activeCompany.benefits || '',
            logoUrl: data.activeCompany.logoUrl || '',
            bannerUrl: data.activeCompany.bannerUrl || '',
          });
        }
      })
      .catch(() => {
        setActionMessage('Unable to load recruiter workspace right now.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const connected = localStorage.getItem('connected') === 'true';
    const role = localStorage.getItem('frontofficeRole');

    if (!connected || role !== 'recruiter') {
      history.replace('/frontoffice/login?redirect=/frontoffice/recruiter');
      return;
    }

    loadWorkspace();
  }, [history]);

  const loadApplicants = (companyId, filters = atsFilters) => {
    if (!companyId) {
      setAtsJobs([]);
      setAtsApplicants([]);
      return;
    }

    recruiterHTTPService.getApplicants(companyId, filters)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        const jobs = Array.isArray(data.jobs) ? data.jobs : [];
        setAtsJobs(jobs);
        setAtsApplicants(jobs.flatMap((job) => Array.isArray(job.applicants) ? job.applicants.map((item) => ({ ...item, jobTitle: job.jobTitle || item.jobTitle })) : []));
      })
      .catch(() => {
        setActionMessage('Unable to load applicants right now.');
      });
  };

  const loadCandidateSearch = (companyId, filters = candidateFilters) => {
    if (!companyId) {
      setCandidateSearchResult({ candidates: [], shortlist: { candidateIds: [] }, talentPools: [] });
      return;
    }

    recruiterHTTPService.searchCandidates(companyId, filters)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setCandidateSearchResult({
          candidates: data.candidates || [],
          shortlist: data.shortlist || { candidateIds: [] },
          talentPools: data.talentPools || [],
        });
      })
      .catch(() => setActionMessage('Unable to search candidate database right now.'));
  };

  const loadCommunication = (companyId) => {
    if (!companyId) {
      setMessages([]);
      setMessageTemplates([]);
      setSequences([]);
      return;
    }

    recruiterHTTPService.getCandidateMessages(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setMessages(data.messages || []);
      })
      .catch(() => setActionMessage('Unable to load candidate messages.'));

    recruiterHTTPService.getMessageTemplates(companyId)
      .then((response) => setMessageTemplates(response && response.data ? response.data : []))
      .catch(() => setActionMessage('Unable to load message templates.'));

    recruiterHTTPService.getAutomatedSequences(companyId)
      .then((response) => setSequences(response && response.data ? response.data : []))
      .catch(() => setActionMessage('Unable to load email sequences.'));
  };

  const loadInterviews = (companyId) => {
    if (!companyId) {
      setInterviews([]);
      return;
    }

    recruiterHTTPService.getInterviews(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setInterviews(data.interviews || []);
      })
      .catch(() => setActionMessage('Unable to load interview schedules.'));
  };

  const loadAssessmentResults = (companyId) => {
    if (!companyId) {
      setAssessmentResults([]);
      return;
    }

    recruiterHTTPService.getAssessmentResults(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAssessmentResults(data.assessments || []);
      })
      .catch(() => setActionMessage('Unable to load assessment results.'));
  };

  const loadOffers = (companyId) => {
    if (!companyId) {
      setOffers([]);
      return;
    }

    recruiterHTTPService.getJobOffers(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setOffers(data.offers || []);
      })
      .catch(() => setActionMessage('Unable to load offers.'));
  };

  const loadAnalytics = (companyId) => {
    if (!companyId) {
      setJobPerformanceReport([]);
      setHiringMetrics({ averageTimeToHire: 0, averageCostPerHire: 0, sourceOfCandidates: [] });
      setTeamPerformance({ recruiterActivityStats: [], hiringManagerFeedback: [] });
      return;
    }

    recruiterHTTPService.getJobPerformanceReport(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setJobPerformanceReport(data.jobs || []);
      })
      .catch(() => setActionMessage('Unable to load job performance report.'));

    recruiterHTTPService.getHiringMetricsReport(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setHiringMetrics({
          averageTimeToHire: data.averageTimeToHire || 0,
          averageCostPerHire: data.averageCostPerHire || 0,
          sourceOfCandidates: data.sourceOfCandidates || [],
        });
      })
      .catch(() => setActionMessage('Unable to load hiring metrics.'));

    recruiterHTTPService.getTeamPerformanceReport(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setTeamPerformance({
          recruiterActivityStats: data.recruiterActivityStats || [],
          hiringManagerFeedback: data.hiringManagerFeedback || [],
        });
      })
      .catch(() => setActionMessage('Unable to load team performance.'));
  };

  const loadBilling = (companyId) => {    if (!companyId) {
      setSubscription(null);
      setInvoices([]);
      setPaymentMethods([]);
      return;
    }

    recruiterHTTPService.getSubscription(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setSubscription(data.subscription || null);
        if (data.subscription) {
          setPlanForm({
            planName: data.subscription.planName || 'Standard',
            billingCycle: data.subscription.billingCycle || 'Monthly',
          });
        }
      })
      .catch(() => setActionMessage('Unable to load subscription details.'));

    recruiterHTTPService.getBillingInvoices(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setInvoices(data.invoices || []);
      })
      .catch(() => setActionMessage('Unable to load invoices.'));

    recruiterHTTPService.getPaymentMethods(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setPaymentMethods(data.paymentMethods || []);
      })
      .catch(() => setActionMessage('Unable to load payment methods.'));
  };

  const loadNotifications = (companyId) => {
    if (!companyId) {
      setNotifications([]);
      setNotificationSettings({
        emailEnabled: true,
        pushEnabled: true,
        alerts: {
          newApplicants: true,
          messages: true,
          interviewConfirmations: true,
        },
      });
      return;
    }

    recruiterHTTPService.getNotifications(companyId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setNotifications(data.notifications || []);
        if (data.settings) {
          setNotificationSettings({
            emailEnabled: data.settings.emailEnabled !== false,
            pushEnabled: data.settings.pushEnabled !== false,
            alerts: {
              newApplicants: !!(data.settings.alerts && data.settings.alerts.newApplicants),
              messages: !!(data.settings.alerts && data.settings.alerts.messages),
              interviewConfirmations: !!(data.settings.alerts && data.settings.alerts.interviewConfirmations),
            },
          });
        }
      })
      .catch(() => setActionMessage('Unable to load notifications.'));
  };

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setAtsJobs([]);
      setAtsApplicants([]);
      return;
    }

    loadApplicants(workspace.activeCompany.id, atsFilters);
  }, [workspace.activeCompany && workspace.activeCompany.id, atsFilters]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setCandidateSearchResult({ candidates: [], shortlist: { candidateIds: [] }, talentPools: [] });
      return;
    }

    loadCandidateSearch(workspace.activeCompany.id, candidateFilters);
  }, [workspace.activeCompany && workspace.activeCompany.id, candidateFilters]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setMessages([]);
      setMessageTemplates([]);
      setSequences([]);
      return;
    }

    loadCommunication(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setInterviews([]);
      return;
    }

    loadInterviews(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setAssessmentResults([]);
      return;
    }

    loadAssessmentResults(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setOffers([]);
      return;
    }

    loadOffers(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setJobPerformanceReport([]);
      setHiringMetrics({ averageTimeToHire: 0, averageCostPerHire: 0, sourceOfCandidates: [] });
      setTeamPerformance({ recruiterActivityStats: [], hiringManagerFeedback: [] });
      return;
    }

    loadAnalytics(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setSubscription(null);
      setInvoices([]);
      setPaymentMethods([]);
      return;
    }

    loadBilling(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) {
      setNotifications([]);
      return;
    }

    loadNotifications(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) { setCompanyJobs([]); return; }
    loadCompanyJobs(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  useEffect(() => {
    if (!workspace.activeCompany || !workspace.activeCompany.id) { setAssessmentTemplates([]); return; }
    loadAssessmentTemplates(workspace.activeCompany.id);
  }, [workspace.activeCompany && workspace.activeCompany.id]);

  const parseCsvIds = (value) => String(value || '')
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));

  // NEW: Load company jobs
  const loadCompanyJobs = (companyId) => {
    if (!companyId) { setCompanyJobs([]); return; }
    recruiterHTTPService.listCompanyJobs(companyId)
      .then((response) => setCompanyJobs(Array.isArray(response && response.data) ? response.data : []))
      .catch(() => setActionMessage('Unable to load company jobs.'));
  };

  // NEW: Load assessment templates
  const loadAssessmentTemplates = (companyId) => {
    if (!companyId) { setAssessmentTemplates([]); return; }
    recruiterHTTPService.listAssessmentTemplates(companyId)
      .then((response) => setAssessmentTemplates(Array.isArray(response && response.data) ? response.data : []))
      .catch(() => setActionMessage('Unable to load assessment templates.'));
  };

  // NEW: Remove team member
  const handleRemoveMember = (memberId) => {
    if (!workspace.activeCompany) return;
    if (!window.confirm('Remove this team member?')) return;
    recruiterHTTPService.removeTeamMember(workspace.activeCompany.id, memberId)
      .then(() => { setActionMessage('Team member removed.'); loadWorkspace(); })
      .catch(() => setActionMessage('Unable to remove team member.'));
  };

  // NEW: Job Management handlers
  const handleCreateOrUpdateJob = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) { setActionMessage('No active company selected.'); return; }
    const payload = {
      title: jobForm.title,
      description: jobForm.description,
      requirements: jobForm.requirements,
      salary: jobForm.salary,
      location: jobForm.location,
      employmentType: jobForm.employmentType,
      skills: jobForm.skills,
      benefits: jobForm.benefits,
      applicationDeadline: jobForm.applicationDeadline,
    };
    const action = editingJobId
      ? recruiterHTTPService.updateCompanyJob(workspace.activeCompany.id, editingJobId, payload)
      : recruiterHTTPService.createCompanyJob(workspace.activeCompany.id, payload);
    action
      .then(() => {
        setActionMessage(editingJobId ? 'Job updated.' : 'Job created.');
        setJobForm(emptyJobForm);
        setEditingJobId(null);
        loadCompanyJobs(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to save job.'));
  };

  const handlePublishJob = (jobId) => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.publishCompanyJob(workspace.activeCompany.id, jobId)
      .then(() => { setActionMessage('Job published.'); loadCompanyJobs(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to publish job.'));
  };

  const handlePauseJob = (jobId) => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.pauseCompanyJob(workspace.activeCompany.id, jobId)
      .then(() => { setActionMessage('Job paused.'); loadCompanyJobs(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to pause job.'));
  };

  const handleDeleteJob = (jobId) => {
    if (!workspace.activeCompany) return;
    if (!window.confirm('Delete this job posting?')) return;
    recruiterHTTPService.deleteCompanyJob(workspace.activeCompany.id, jobId)
      .then(() => { setActionMessage('Job deleted.'); loadCompanyJobs(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to delete job.'));
  };

  const handleDuplicateJob = (jobId) => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.duplicateCompanyJob(workspace.activeCompany.id, jobId)
      .then(() => { setActionMessage('Job duplicated.'); loadCompanyJobs(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to duplicate job.'));
  };

  const handleEditJob = (job) => {
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      salary: job.salary || '',
      location: job.location || '',
      employmentType: job.employmentType || 'Full-time',
      skills: (job.skills || []).join(', '),
      benefits: job.benefits || '',
      applicationDeadline: job.applicationDeadline || '',
    });
    setEditingJobId(job.id);
    setActiveSection('jobs');
  };

  // NEW: Assign recruiter to applicant
  const handleAssignRecruiter = (applicationId) => {
    if (!workspace.activeCompany) return;
    const recruiterId = (assignRecruiterDrafts[applicationId] || '').trim();
    if (!recruiterId) { setActionMessage('Enter recruiter ID to assign.'); return; }
    recruiterHTTPService.assignRecruiterToApplicant(workspace.activeCompany.id, applicationId, Number(recruiterId))
      .then(() => { setAssignRecruiterDrafts((prev) => ({ ...prev, [applicationId]: '' })); loadApplicants(workspace.activeCompany.id); setActionMessage('Recruiter assigned to candidate.'); })
      .catch(() => setActionMessage('Unable to assign recruiter.'));
  };

  // NEW: Create assessment template
  const handleCreateAssessmentTemplate = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;
    recruiterHTTPService.createAssessmentTemplate(workspace.activeCompany.id, {
      title: assessmentTemplateForm.title,
      type: assessmentTemplateForm.type,
      description: assessmentTemplateForm.description,
      durationMinutes: Number(assessmentTemplateForm.durationMinutes || 60),
      maxScore: Number(assessmentTemplateForm.maxScore || 100),
    })
      .then(() => { setAssessmentTemplateForm(emptyAssessmentTemplateForm); setActionMessage('Assessment template created.'); loadAssessmentTemplates(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to create assessment template.'));
  };

  // NEW: Negotiate offer
  const handleNegotiateOffer = (offerId) => {
    if (!workspace.activeCompany) return;
    const draft = negotiateDrafts[offerId] || {};
    if (!draft.counterCompensation) { setActionMessage('Enter counter-offer compensation before negotiating.'); return; }
    recruiterHTTPService.negotiateJobOffer(workspace.activeCompany.id, offerId, {
      counterCompensation: draft.counterCompensation,
      counterNotes: draft.counterNotes || '',
    })
      .then(() => { setNegotiateDrafts((prev) => ({ ...prev, [offerId]: {} })); setActionMessage('Counter-offer sent — status set to Negotiating.'); loadOffers(workspace.activeCompany.id); })
      .catch(() => setActionMessage('Unable to send counter-offer.'));
  };



  const handleRegisterRecruiter = (event) => {
    event.preventDefault();

    recruiterHTTPService.register(registerForm)
      .then((response) => {
        const payload = response && response.data ? response.data : {};
        if (!payload.recruiter) {
          setActionMessage('Recruiter registration did not complete.');
          return;
        }

        localStorage.setItem('connected', 'true');
        localStorage.setItem('frontofficeRole', 'recruiter');
        localStorage.setItem('currentUser', JSON.stringify(payload.recruiter));
        setActionMessage('Recruiter registered and signed in successfully.');
        setRegisterForm(emptyRegisterForm);
        window.location.reload();
      })
      .catch((error) => {
        const apiMessage = error && error.response && error.response.data && error.response.data.message;
        setActionMessage(apiMessage || 'Unable to register recruiter right now.');
      });
  };

  const handleCreateCompany = (event) => {
    event.preventDefault();

    recruiterHTTPService.createCompanyAccount(recruiterId, createCompanyForm)
      .then(() => {
        setActionMessage('Company account created and activated.');
        setCreateCompanyForm(emptyCreateCompanyForm);
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to create company account.'));
  };

  const handleJoinCompany = (event) => {
    event.preventDefault();

    recruiterHTTPService.joinCompanyAccount(recruiterId, { companyName: joinCompanyName })
      .then(() => {
        setActionMessage('Joined company successfully.');
        setJoinCompanyName('');
        loadWorkspace();
      })
      .catch((error) => {
        const apiMessage = error && error.response && error.response.data && error.response.data.message;
        setActionMessage(apiMessage || 'Unable to join company.');
      });
  };

  const handleInvite = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      setActionMessage('Select an active company first.');
      return;
    }

    recruiterHTTPService.inviteTeamMember(workspace.activeCompany.id, inviteForm)
      .then(() => {
        setActionMessage('Team invitation sent.');
        setInviteForm(emptyInviteForm);
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to invite team member.'));
  };

  const handleAssignRole = (memberId, role, permissions) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.assignRolePermission(workspace.activeCompany.id, memberId, { role, permissions })
      .then(() => {
        setActionMessage('Role and permissions updated.');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to update role/permissions.'));
  };

  const handleSwitchCompany = (companyId) => {
    recruiterHTTPService.switchCompany(recruiterId, Number(companyId))
      .then(() => {
        setActionMessage('Switched active company.');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to switch company.'));
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();

    recruiterHTTPService.updateRecruiterProfile(recruiterId, profileForm)
      .then((response) => {
        const updated = response && response.data ? response.data : null;
        if (updated) {
          localStorage.setItem('currentUser', JSON.stringify(updated));
        }
        setActionMessage('Recruiter profile updated.');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to update recruiter profile.'));
  };

  const handleUpdateCompanyProfile = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      setActionMessage('No active company selected.');
      return;
    }

    recruiterHTTPService.updateCompanyProfile(workspace.activeCompany.id, companyProfileForm)
      .then(() => {
        setActionMessage('Company profile updated.');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to update company profile.'));
  };

  const handleUploadMedia = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      setActionMessage('No active company selected.');
      return;
    }

    recruiterHTTPService.uploadCompanyMedia(workspace.activeCompany.id, {
      logoUrl: companyProfileForm.logoUrl,
      bannerUrl: companyProfileForm.bannerUrl,
      url: mediaUrl,
    })
      .then(() => {
        setActionMessage('Company media updated.');
        setMediaUrl('');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to upload media.'));
  };

  const handleAddLocation = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      setActionMessage('No active company selected.');
      return;
    }

    recruiterHTTPService.addOfficeLocation(workspace.activeCompany.id, locationInput)
      .then(() => {
        setActionMessage('Office location added.');
        setLocationInput('');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to add office location.'));
  };

  const handleVisibility = (visibility) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.updateCompanyVisibility(workspace.activeCompany.id, visibility)
      .then(() => {
        setActionMessage('Company visibility updated.');
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to update company visibility.'));
  };

  const handleRespondReview = (reviewId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.respondToCompanyReview(workspace.activeCompany.id, reviewId, reviewResponses[reviewId] || '')
      .then(() => {
        setActionMessage('Review response submitted.');
        setReviewResponses((previous) => ({ ...previous, [reviewId]: '' }));
        loadWorkspace();
      })
      .catch(() => setActionMessage('Unable to respond to review.'));
  };

  const handleOpenCandidateProfile = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.openApplicantProfile(workspace.activeCompany.id, applicationId)
      .then((response) => {
        const profile = response && response.data ? response.data : null;
        if (!profile) {
          setActionMessage('Candidate profile not found.');
          return;
        }

        setCandidateProfiles((prev) => ({ ...prev, [applicationId]: profile }));
      })
      .catch(() => setActionMessage('Unable to open candidate profile.'));
  };

  const handleDownloadResume = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.downloadApplicantResume(workspace.activeCompany.id, applicationId)
      .then((response) => {
        const payload = response && response.data ? response.data : null;
        if (!payload || !payload.resumeUrl) {
          setActionMessage('Resume not available for this candidate.');
          return;
        }

        window.open(payload.resumeUrl, '_blank', 'noopener,noreferrer');
      })
      .catch(() => setActionMessage('Unable to fetch resume download link.'));
  };

  const handleAddNote = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const note = (noteDrafts[applicationId] || '').trim();
    if (!note) {
      setActionMessage('Write a note before saving.');
      return;
    }

    recruiterHTTPService.addApplicantNote(workspace.activeCompany.id, applicationId, note)
      .then(() => {
        setNoteDrafts((prev) => ({ ...prev, [applicationId]: '' }));
        loadApplicants(workspace.activeCompany.id);
        setActionMessage('Note added to candidate.');
      })
      .catch(() => setActionMessage('Unable to add note.'));
  };

  const handleTagCandidate = (applicationId, mode = 'add') => {
    if (!workspace.activeCompany) {
      return;
    }

    const tag = (tagDrafts[applicationId] || '').trim();
    if (!tag) {
      setActionMessage('Enter a tag first (e.g., Strong, Backup).');
      return;
    }

    recruiterHTTPService.tagApplicant(workspace.activeCompany.id, applicationId, { tag, mode })
      .then(() => {
        if (mode === 'add') {
          setTagDrafts((prev) => ({ ...prev, [applicationId]: '' }));
        }
        loadApplicants(workspace.activeCompany.id);
        setActionMessage(mode === 'remove' ? 'Tag removed from candidate.' : 'Tag added to candidate.');
      })
      .catch(() => setActionMessage('Unable to update tag.'));
  };

  const handleMoveStage = (applicationId, stage) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.moveApplicantStage(workspace.activeCompany.id, applicationId, stage)
      .then(() => {
        loadApplicants(workspace.activeCompany.id);
        setActionMessage(`Candidate moved to ${stage}.`);
      })
      .catch(() => setActionMessage('Unable to move candidate stage.'));
  };

  const handleBulkMove = () => {
    if (!workspace.activeCompany) {
      return;
    }

    if (!selectedApplicants.length) {
      setActionMessage('Select at least one candidate for bulk move.');
      return;
    }

    recruiterHTTPService.bulkMoveApplicants(workspace.activeCompany.id, {
      applicationIds: selectedApplicants,
      stage: bulkStage,
    })
      .then((response) => {
        const movedCount = response && response.data ? response.data.movedCount : 0;
        setSelectedApplicants([]);
        loadApplicants(workspace.activeCompany.id);
        setActionMessage(`${movedCount} candidates moved to ${bulkStage}.`);
      })
      .catch(() => setActionMessage('Unable to bulk move candidates.'));
  };

  const handleRejectCandidate = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const reason = window.prompt('Provide rejection reason', 'Insufficient role fit');
    if (reason === null) {
      return;
    }

    recruiterHTTPService.rejectApplicant(workspace.activeCompany.id, applicationId, reason)
      .then(() => {
        loadApplicants(workspace.activeCompany.id);
        setActionMessage('Candidate rejected with reason.');
      })
      .catch(() => setActionMessage('Unable to reject candidate.'));
  };

  const handleReopenCandidate = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.reopenApplicant(workspace.activeCompany.id, applicationId, 'Screening')
      .then(() => {
        loadApplicants(workspace.activeCompany.id);
        setActionMessage('Rejected candidate reopened to Screening.');
      })
      .catch(() => setActionMessage('Unable to reopen candidate.'));
  };

  const handleOpenSourcingProfile = (candidateId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.openCandidateProfile(workspace.activeCompany.id, candidateId)
      .then((response) => {
        const profile = response && response.data ? response.data : null;
        if (!profile) {
          setActionMessage('Candidate profile not found in database.');
          return;
        }

        setCandidateSearchProfiles((prev) => ({ ...prev, [candidateId]: profile }));
      })
      .catch(() => setActionMessage('Unable to open candidate profile.'));
  };

  const handleShortlistCandidate = (candidateId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.shortlistCandidate(workspace.activeCompany.id, candidateId)
      .then(() => {
        setActionMessage('Candidate saved to shortlist.');
        loadCandidateSearch(workspace.activeCompany.id, candidateFilters);
      })
      .catch(() => setActionMessage('Unable to save candidate to shortlist.'));
  };

  const handleAddToTalentPool = (candidateId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const poolName = (poolDrafts[candidateId] || '').trim() || 'General Talent Pool';
    recruiterHTTPService.addCandidateToTalentPool(workspace.activeCompany.id, candidateId, poolName)
      .then(() => {
        setActionMessage(`Candidate added to ${poolName}.`);
        setPoolDrafts((prev) => ({ ...prev, [candidateId]: '' }));
        loadCandidateSearch(workspace.activeCompany.id, candidateFilters);
      })
      .catch(() => setActionMessage('Unable to add candidate to talent pool.'));
  };

  const handleOutreachCandidate = (candidateId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const body = (outreachDrafts[candidateId] || '').trim();
    if (!body) {
      setActionMessage('Write outreach content before sending.');
      return;
    }

    recruiterHTTPService.contactPassiveCandidate(workspace.activeCompany.id, candidateId, {
      subject: 'Opportunity at our company',
      body,
      attachments: automationForm.attachments,
    })
      .then(() => {
        setOutreachDrafts((prev) => ({ ...prev, [candidateId]: '' }));
        setActionMessage('Outreach sent to passive candidate.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to contact passive candidate.'));
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.sendCandidateMessage(workspace.activeCompany.id, messageForm)
      .then(() => {
        setActionMessage('Message sent to candidate.');
        setMessageForm({ candidateId: '', subject: '', body: '', attachments: '' });
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to send message to candidate.'));
  };

  const handleReplyMessage = (messageId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const body = (replyDrafts[messageId] || '').trim();
    if (!body) {
      setActionMessage('Write a reply before sending.');
      return;
    }

    recruiterHTTPService.replyCandidateMessage(workspace.activeCompany.id, messageId, { body })
      .then(() => {
        setReplyDrafts((prev) => ({ ...prev, [messageId]: '' }));
        setActionMessage('Reply sent to candidate message.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to reply to candidate message.'));
  };

  const handleSaveTemplate = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.saveMessageTemplate(workspace.activeCompany.id, templateForm)
      .then(() => {
        setTemplateForm(emptyTemplateForm);
        setActionMessage('Message template saved.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to save message template.'));
  };

  const handleSendBulkMessages = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.sendBulkMessages(workspace.activeCompany.id, {
      candidateIds: parseCsvIds(bulkMessageForm.candidateIds),
      subject: bulkMessageForm.subject,
      body: bulkMessageForm.body,
      attachments: bulkMessageForm.attachments,
    })
      .then((response) => {
        const count = response && response.data ? response.data.sentCount : 0;
        setActionMessage(`Bulk message sent to ${count} candidates.`);
        setBulkMessageForm({ candidateIds: '', subject: '', body: '', attachments: '' });
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to send bulk messages.'));
  };

  const handleInterviewInvite = () => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.sendInterviewInvitation(workspace.activeCompany.id, {
      candidateId: Number(automationForm.candidateId),
      interviewDate: automationForm.interviewDate,
      interviewMode: automationForm.interviewMode,
      attachments: automationForm.attachments,
    })
      .then(() => {
        setActionMessage('Interview invitation email sent.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to send interview invitation.'));
  };

  const handleRejectionEmail = () => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.sendRejectionEmail(workspace.activeCompany.id, {
      candidateId: Number(automationForm.candidateId),
      reason: automationForm.reason,
      attachments: automationForm.attachments,
    })
      .then(() => {
        setActionMessage('Rejection email sent.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to send rejection email.'));
  };

  const handleFollowUpEmail = () => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.sendFollowUpEmail(workspace.activeCompany.id, {
      candidateId: Number(automationForm.candidateId),
      body: automationForm.followUpBody,
      attachments: automationForm.attachments,
    })
      .then(() => {
        setActionMessage('Follow-up email sent.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to send follow-up email.'));
  };

  const handleCreateSequence = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    const steps = String(sequenceForm.stepsText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|');
        return {
          delayDays: Number(parts[0] || 0),
          subject: parts[1] || '',
          body: parts.slice(2).join('|') || '',
        };
      });

    recruiterHTTPService.createAutomatedSequence(workspace.activeCompany.id, {
      name: sequenceForm.name,
      steps,
    })
      .then(() => {
        setSequenceForm(emptySequenceForm);
        setActionMessage('Automated sequence created.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to create automated sequence.'));
  };

  const handleAssignSequence = (sequenceId) => {
    if (!workspace.activeCompany) {
      return;
    }

    if (!automationForm.candidateId) {
      setActionMessage('Enter candidate ID before assigning sequence.');
      return;
    }

    recruiterHTTPService.assignAutomatedSequence(workspace.activeCompany.id, sequenceId, Number(automationForm.candidateId))
      .then(() => {
        setActionMessage('Sequence assigned to candidate.');
        loadCommunication(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to assign sequence.'));
  };

  const handleScheduleInterview = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.scheduleInterview(workspace.activeCompany.id, {
      applicationId: Number(interviewForm.applicationId),
      interviewType: interviewForm.interviewType,
      proposedSlots: interviewForm.proposedSlots,
      selectedSlot: interviewForm.selectedSlot,
      calendarProvider: interviewForm.calendarProvider,
      notes: interviewForm.notes,
    })
      .then(() => {
        setActionMessage('Interview scheduled successfully.');
        setInterviewForm(emptyInterviewForm);
        loadInterviews(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to schedule interview.'));
  };

  const handleSyncInterview = (interviewId, provider) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.syncInterviewCalendar(workspace.activeCompany.id, interviewId, provider)
      .then(() => {
        setActionMessage(`Interview synced with ${provider}.`);
        loadInterviews(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to sync interview calendar.'));
  };

  const handleRescheduleInterview = (interview) => {
    if (!workspace.activeCompany) {
      return;
    }

    const selectedSlot = window.prompt('Enter the new selected slot (ISO datetime):', interview.selectedSlot || '');
    if (selectedSlot === null) {
      return;
    }

    recruiterHTTPService.rescheduleInterview(workspace.activeCompany.id, interview.id, {
      selectedSlot,
      proposedSlots: interview.proposedSlots,
      interviewType: interview.interviewType,
    })
      .then(() => {
        setActionMessage('Interview rescheduled.');
        loadInterviews(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to reschedule interview.'));
  };

  const handleCancelInterview = (interviewId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const reason = window.prompt('Provide cancellation reason:', 'Panel unavailable');
    if (reason === null) {
      return;
    }

    recruiterHTTPService.cancelInterview(workspace.activeCompany.id, interviewId, reason)
      .then(() => {
        setActionMessage('Interview canceled.');
        loadInterviews(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to cancel interview.'));
  };

  const handleSaveInterviewNotes = (interviewId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const notes = (interviewNoteDrafts[interviewId] || '').trim();
    recruiterHTTPService.updateInterviewNotes(workspace.activeCompany.id, interviewId, notes)
      .then(() => {
        setActionMessage('Interview notes updated.');
        loadInterviews(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update interview notes.'));
  };

  const handleSaveInterviewFeedback = (interviewId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const draft = interviewFeedbackDrafts[interviewId] || {};
    recruiterHTTPService.saveInterviewFeedback(workspace.activeCompany.id, interviewId, {
      feedback: draft.feedback || '',
      rating: Number(draft.rating || 0),
      sharedWithTeam: false,
    })
      .then(() => {
        setInterviewFeedbackDrafts((prev) => ({ ...prev, [interviewId]: { feedback: '', rating: '' } }));
        setActionMessage('Interview feedback saved.');
      })
      .catch(() => setActionMessage('Unable to save interview feedback.'));
  };

  const handleShareInterviewFeedback = (interviewId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const members = parseCsvIds(interviewShareDrafts[interviewId] || '');
    recruiterHTTPService.shareInterviewFeedback(workspace.activeCompany.id, interviewId, {
      sharedTeamMembers: members,
    })
      .then(() => {
        setActionMessage(`Interview feedback shared with ${members.length} team members.`);
      })
      .catch(() => setActionMessage('Unable to share interview feedback.'));
  };

  const handleReviewScreeningAnswers = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.getScreeningAnswers(workspace.activeCompany.id, applicationId)
      .then((response) => {
        const data = response && response.data ? response.data : null;
        if (!data) {
          return;
        }

        setScreeningAnswers((prev) => ({ ...prev, [applicationId]: data.screeningAnswers || {} }));
      })
      .catch(() => setActionMessage('Unable to fetch screening answers.'));
  };

  const handleRateCandidate = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const rating = Number(ratingDrafts[applicationId] || 0);
    recruiterHTTPService.updateCandidateRating(workspace.activeCompany.id, applicationId, rating)
      .then(() => {
        setActionMessage('Candidate rating updated.');
        loadApplicants(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update candidate rating.'));
  };

  const handleSaveStructuredFeedback = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const draft = structuredFeedbackDrafts[applicationId] || {};
    recruiterHTTPService.saveStructuredFeedback(workspace.activeCompany.id, applicationId, {
      strengths: draft.strengths || '',
      concerns: draft.concerns || '',
      recommendation: draft.recommendation || '',
      overallScore: Number(draft.overallScore || 0),
    })
      .then(() => setActionMessage('Structured feedback saved.'))
      .catch(() => setActionMessage('Unable to save structured feedback.'));
  };

  const handleCompareCandidates = () => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.compareCandidates(workspace.activeCompany.id, parseCsvIds(compareIdsInput))
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setCompareResult(data.candidates || []);
      })
      .catch(() => setActionMessage('Unable to compare candidates.'));
  };

  const handleAssignAssessment = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.assignAssessment(workspace.activeCompany.id, Number(assessmentForm.applicationId), {
      testTitle: assessmentForm.testTitle,
      testType: assessmentForm.testType,
      dueDate: assessmentForm.dueDate,
      maxScore: Number(assessmentForm.maxScore || 100),
    })
      .then(() => {
        setActionMessage('Assessment assigned to candidate.');
        setAssessmentForm(emptyAssessmentForm);
        loadAssessmentResults(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to assign assessment.'));
  };

  const handleReviewAssessmentResult = (assessmentId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const draft = assessmentReviewDrafts[assessmentId] || {};
    recruiterHTTPService.reviewAssessmentResult(workspace.activeCompany.id, assessmentId, {
      score: Number(draft.score || 0),
      status: draft.status || 'Reviewed',
      resultNotes: draft.resultNotes || '',
    })
      .then(() => {
        setActionMessage('Assessment review saved.');
        loadAssessmentResults(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to review assessment result.'));
  };

  const handleMarkSelected = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.markCandidateSelected(workspace.activeCompany.id, applicationId)
      .then(() => {
        setActionMessage('Candidate marked as Selected.');
        loadApplicants(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to mark candidate as selected.'));
  };

  const handleCreateOffer = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.createJobOffer(workspace.activeCompany.id, Number(offerForm.applicationId), {
      compensation: offerForm.compensation,
      proposedStartDate: offerForm.proposedStartDate,
      notes: offerForm.notes,
      offerLetterUrl: offerForm.offerLetterUrl,
      status: 'Sent',
    })
      .then(() => {
        setActionMessage('Job offer created and sent.');
        setOfferForm(emptyOfferForm);
        loadOffers(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to create job offer.'));
  };

  const handleAttachOfferLetter = (offerId) => {
    if (!workspace.activeCompany) {
      return;
    }

    const letterUrl = (offerLetterDrafts[offerId] || '').trim();
    if (!letterUrl) {
      setActionMessage('Add an offer letter URL before attaching.');
      return;
    }

    recruiterHTTPService.attachOfferLetter(workspace.activeCompany.id, offerId, letterUrl)
      .then(() => {
        setActionMessage('Offer letter attached successfully.');
        setOfferLetterDrafts((prev) => ({ ...prev, [offerId]: '' }));
        loadOffers(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to attach offer letter.'));
  };

  const handleOfferStatus = (offerId, status) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.updateOfferStatus(workspace.activeCompany.id, offerId, status)
      .then(() => {
        setActionMessage(`Offer status updated to ${status}.`);
        loadOffers(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update offer status.'));
  };

  const handleMarkHired = (applicationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.markCandidateHired(workspace.activeCompany.id, applicationId)
      .then(() => {
        setActionMessage('Candidate marked as Hired.');
        loadApplicants(workspace.activeCompany.id);
        loadOffers(workspace.activeCompany.id);
        loadAnalytics(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to mark candidate as hired.'));
  };

  const handleCloseJobPosting = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.closeJobPosting(workspace.activeCompany.id, Number(closeJobForm.jobId), {
      reason: closeJobForm.reason,
    })
      .then(() => {
        setActionMessage('Job posting closed.');
        setCloseJobForm(emptyCloseJobForm);
      })
      .catch(() => setActionMessage('Unable to close job posting.'));
  };

  const handleSaveManagerFeedback = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.saveHiringManagerFeedback(workspace.activeCompany.id, {
      hiringManagerName: managerFeedbackForm.hiringManagerName,
      recruiterId: Number(managerFeedbackForm.recruiterId || 0),
      recruiterName: managerFeedbackForm.recruiterName,
      feedback: managerFeedbackForm.feedback,
      score: Number(managerFeedbackForm.score || 0),
    })
      .then(() => {
        setActionMessage('Hiring manager feedback saved.');
        setManagerFeedbackForm(emptyManagerFeedbackForm);
        loadAnalytics(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to save hiring manager feedback.'));
  };

  const handleUpdateSubscriptionPlan = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.updateSubscriptionPlan(workspace.activeCompany.id, {
      planName: planForm.planName,
      billingCycle: planForm.billingCycle,
    })
      .then(() => {
        setActionMessage('Subscription plan updated.');
        loadBilling(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update subscription plan.'));
  };

  const handlePurchaseCredits = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.purchaseJobCredits(workspace.activeCompany.id, {
      credits: Number(creditsForm.credits || 0),
      unitPrice: Number(creditsForm.unitPrice || 0),
    })
      .then(() => {
        setActionMessage('Job credits purchased successfully.');
        setCreditsForm(emptyCreditsForm);
        loadBilling(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to purchase job credits.'));
  };

  const handlePayFeaturedListing = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.payFeaturedListing(workspace.activeCompany.id, {
      jobId: Number(featuredListingForm.jobId || 0),
      quantity: Number(featuredListingForm.quantity || 1),
      unitPrice: Number(featuredListingForm.unitPrice || 0),
    })
      .then(() => {
        setActionMessage('Featured listing payment completed.');
        setFeaturedListingForm(emptyFeaturedListingForm);
        loadBilling(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to process featured listing payment.'));
  };

  const handleAddPaymentMethod = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.addPaymentMethod(workspace.activeCompany.id, {
      methodType: paymentMethodForm.methodType,
      provider: paymentMethodForm.provider,
      last4: paymentMethodForm.last4,
      cardHolder: paymentMethodForm.cardHolder,
      expiryMonth: paymentMethodForm.expiryMonth,
      expiryYear: paymentMethodForm.expiryYear,
      billingEmail: paymentMethodForm.billingEmail,
      isDefault: paymentMethodForm.isDefault,
    })
      .then(() => {
        setActionMessage('Payment method saved.');
        setPaymentMethodForm(emptyPaymentMethodForm);
        loadBilling(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to save payment method.'));
  };

  const handleRemovePaymentMethod = (methodId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.removePaymentMethod(workspace.activeCompany.id, methodId)
      .then(() => {
        setActionMessage('Payment method removed.');
        loadBilling(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to remove payment method.'));
  };

  const handleDownloadInvoice = (invoiceId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.downloadInvoice(workspace.activeCompany.id, invoiceId)
      .then((response) => {
        const data = response && response.data ? response.data : {};
        const name = data.invoice && data.invoice.invoiceNumber ? data.invoice.invoiceNumber : `INV-${invoiceId}`;
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
          setActionMessage(`Invoice ${name} download started.`);
          return;
        }

        if (data.invoice) {
          const blob = new Blob([JSON.stringify(data.invoice, null, 2)], { type: 'application/json' });
          const objectUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = objectUrl;
          anchor.download = `${name}.json`;
          anchor.click();
          window.URL.revokeObjectURL(objectUrl);
          setActionMessage(`Invoice ${name} downloaded.`);
          return;
        }

        setActionMessage('Invoice download is not available for this item.');
      })
      .catch(() => setActionMessage('Unable to download invoice.'));
  };

  const handleSaveNotificationSettings = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.updateNotificationSettings(workspace.activeCompany.id, {
      alerts: notificationSettings.alerts,
    })
      .then(() => {
        setActionMessage('Notification alert settings updated.');
        loadNotifications(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update notification settings.'));
  };

  const handleToggleNotificationChannels = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.updateNotificationChannels(workspace.activeCompany.id, {
      emailEnabled: notificationSettings.emailEnabled,
      pushEnabled: notificationSettings.pushEnabled,
    })
      .then(() => {
        setActionMessage('Notification channels updated.');
        loadNotifications(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to update notification channels.'));
  };

  const handleMarkNotificationRead = (notificationId) => {
    if (!workspace.activeCompany) {
      return;
    }

    recruiterHTTPService.markNotificationAsRead(workspace.activeCompany.id, notificationId)
      .then(() => {
        setActionMessage('Notification marked as read.');
        loadNotifications(workspace.activeCompany.id);
      })
      .catch(() => setActionMessage('Unable to mark notification as read.'));
  };

  const parseSkills = (value) => String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const handleAIGenerateJobDescription = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.generateAIJobDescription(workspace.activeCompany.id, {
      jobTitle: aiJobForm.jobTitle,
      seniority: aiJobForm.seniority,
      location: aiJobForm.location,
      requiredSkills: parseSkills(aiJobForm.requiredSkills),
      minExperience: Number(aiJobForm.minExperience || 0),
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiGeneratedDescription(data.generatedDescription || '');
        setActionMessage('AI generated job description.');
      })
      .catch(() => setActionMessage('Unable to generate AI job description.'));
  };

  const handleAIRecommendCandidates = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.getRecommendedCandidatesForJob(workspace.activeCompany.id, {
      requiredSkills: parseSkills(aiCandidateForm.requiredSkills),
      minExperience: Number(aiCandidateForm.minExperience || 0),
      location: aiCandidateForm.location,
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiRecommendedCandidates(data.recommendedCandidates || []);
        setActionMessage('AI recommended candidates loaded.');
      })
      .catch(() => setActionMessage('Unable to load AI recommended candidates.'));
  };

  const handleAICandidateMatchScore = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.getCandidateMatchScoreAI(workspace.activeCompany.id, {
      candidateId: Number(aiCandidateForm.candidateId || 0),
      requiredSkills: parseSkills(aiCandidateForm.requiredSkills),
      minExperience: Number(aiCandidateForm.minExperience || 0),
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiMatchScore(data.matchScore || null);
        setActionMessage('AI match score generated.');
      })
      .catch(() => setActionMessage('Unable to generate candidate match score.'));
  };

  const handleAIAutoRank = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.autoRankApplicantsAI(workspace.activeCompany.id, {
      requiredSkills: parseSkills(aiCandidateForm.requiredSkills),
      minExperience: Number(aiCandidateForm.minExperience || 0),
      location: aiCandidateForm.location,
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiRankedApplicants(data.rankedApplicants || []);
        setActionMessage('Applicants ranked by AI.');
      })
      .catch(() => setActionMessage('Unable to rank applicants with AI.'));
  };

  const handleAIInterviewQuestions = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.generateInterviewQuestionsAI(workspace.activeCompany.id, {
      jobTitle: aiJobForm.jobTitle,
      requiredSkills: parseSkills(aiCandidateForm.requiredSkills),
      count: 5,
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiInterviewQuestions(data.questions || []);
        setActionMessage('AI interview questions generated.');
      })
      .catch(() => setActionMessage('Unable to generate interview questions.'));
  };

  const handleAIOutreachMessage = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.generateOutreachMessageAI(workspace.activeCompany.id, {
      candidateId: Number(aiCandidateForm.candidateId || 0),
      role: aiJobForm.jobTitle,
      tone: 'Professional',
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiOutreachMessage(data.message || { subject: '', body: '' });
        setActionMessage('AI outreach message generated.');
      })
      .catch(() => setActionMessage('Unable to generate outreach message.'));
  };

  const handleAIPredictSuccess = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.predictCandidateSuccessAI(workspace.activeCompany.id, {
      candidateId: Number(aiCandidateForm.candidateId || 0),
      role: aiJobForm.jobTitle,
    })
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setAiSuccessPrediction(data.prediction || null);
        setActionMessage('AI success prediction ready.');
      })
      .catch(() => setActionMessage('Unable to predict candidate success.'));
  };

  const handleCreatePool = (event) => {
    event.preventDefault();
    if (!workspace.activeCompany) return;

    recruiterHTTPService.createTalentPool(workspace.activeCompany.id, { name: crmPoolForm.name })
      .then(() => {
        setActionMessage('Talent pool created.');
        loadCandidateSearch(workspace.activeCompany.id, candidateFilters);
      })
      .catch(() => setActionMessage('Unable to create talent pool.'));
  };

  const handleRemoveFromPool = () => {
    if (!workspace.activeCompany) return;

    recruiterHTTPService.removeCandidateFromTalentPool(
      workspace.activeCompany.id,
      Number(crmActionForm.candidateId || 0),
      crmActionForm.poolName,
    )
      .then(() => {
        setActionMessage('Candidate removed from talent pool.');
        loadCandidateSearch(workspace.activeCompany.id, candidateFilters);
      })
      .catch(() => setActionMessage('Unable to remove candidate from talent pool.'));
  };

  const handleTagCandidateCRM = () => {
    if (!workspace.activeCompany) return;

    recruiterHTTPService.tagCandidateCRM(workspace.activeCompany.id, Number(crmActionForm.candidateId || 0), {
      tags: parseSkills(crmActionForm.tags),
    })
      .then(() => setActionMessage('Candidate CRM tags updated.'))
      .catch(() => setActionMessage('Unable to update candidate CRM tags.'));
  };

  const handleViewCandidateHistory = () => {
    if (!workspace.activeCompany) return;

    recruiterHTTPService.getCandidateHistory(workspace.activeCompany.id, Number(crmActionForm.candidateId || 0))
      .then((response) => {
        const data = response && response.data ? response.data : {};
        setCrmHistory(data.history || null);
        setActionMessage('Candidate history loaded.');
      })
      .catch(() => setActionMessage('Unable to load candidate history.'));
  };

  const handleReengageCandidate = () => {
    if (!workspace.activeCompany) return;

    recruiterHTTPService.reengageCandidate(workspace.activeCompany.id, Number(crmActionForm.candidateId || 0), {
      channel: 'email',
      message: 'We have a role that aligns with your previous profile. Interested in reconnecting?',
    })
      .then(() => setActionMessage('Re-engagement sent to candidate.'))
      .catch(() => setActionMessage('Unable to re-engage candidate.'));
  };

  // ── 15. Settings & Control handlers ─────────────────────────────────────────

  const handleLoadPipelineSettings = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getPipelineSettings(workspace.activeCompany.id)
      .then(r => { setPipelineConfig(r.data); setPipelineStagesInput((r.data.stages || []).join(',')); setSettingsActionMsg('Pipeline settings loaded.'); })
      .catch(() => setSettingsActionMsg('Failed to load pipeline settings.'));
  };

  const handleSavePipelineStages = () => {
    if (!workspace.activeCompany) return;
    const stages = pipelineStagesInput.split(',').map(s => s.trim()).filter(Boolean);
    recruiterHTTPService.configurePipelineStages(workspace.activeCompany.id, { stages })
      .then(r => { setPipelineConfig(r.data); setSettingsActionMsg('Pipeline stages saved.'); })
      .catch(() => setSettingsActionMsg('Failed to save pipeline stages.'));
  };

  const handleLoadAppForm = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getApplicationFormConfig(workspace.activeCompany.id)
      .then(r => { setAppFormConfig(r.data); setSettingsActionMsg('Application form config loaded.'); })
      .catch(() => setSettingsActionMsg('Failed to load application form config.'));
  };

  const handleLoadTeamPermissions = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getTeamPermissions(workspace.activeCompany.id)
      .then(r => { setTeamPermissions(r.data || []); setSettingsActionMsg('Team permissions loaded.'); })
      .catch(() => setSettingsActionMsg('Failed to load team permissions.'));
  };

  const handleLoadEmailTemplates = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getDefaultEmailTemplates(workspace.activeCompany.id)
      .then(r => { setEmailTemplates(r.data || []); setSettingsActionMsg('Email templates loaded.'); })
      .catch(() => setSettingsActionMsg('Failed to load email templates.'));
  };

  const handleSaveEmailTemplate = () => {
    if (!workspace.activeCompany || !emailTemplateForm.id) return;
    recruiterHTTPService.saveDefaultEmailTemplate(workspace.activeCompany.id, emailTemplateForm)
      .then(r => { setEmailTemplates(r.data || []); setSettingsActionMsg('Email template saved.'); })
      .catch(() => setSettingsActionMsg('Failed to save email template.'));
  };

  const handleLoadIntegrations = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getIntegrations(workspace.activeCompany.id)
      .then(r => { setIntegrationsList(r.data || []); setSettingsActionMsg('Integrations loaded.'); })
      .catch(() => setSettingsActionMsg('Failed to load integrations.'));
  };

  const handleSaveIntegration = () => {
    if (!workspace.activeCompany || !integrationForm.name) return;
    recruiterHTTPService.saveIntegration(workspace.activeCompany.id, integrationForm)
      .then(r => { setIntegrationsList(r.data || []); setSettingsActionMsg('Integration saved.'); })
      .catch(() => setSettingsActionMsg('Failed to save integration.'));
  };

  const handleRemoveIntegration = (integrationId) => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.removeIntegration(workspace.activeCompany.id, integrationId)
      .then(() => { setIntegrationsList(prev => prev.filter(i => i.id !== integrationId)); setSettingsActionMsg('Integration removed.'); })
      .catch(() => setSettingsActionMsg('Failed to remove integration.'));
  };

  // ── 16. Automation handlers ──────────────────────────────────────────────────

  const handleLoadAutomationRules = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getAutomationRules(workspace.activeCompany.id)
      .then(r => { setAutomationRules(r.data || []); setAutomationActionMsg('Automation rules loaded.'); })
      .catch(() => setAutomationActionMsg('Failed to load automation rules.'));
  };

  const handleCreateAutoMoveRule = () => {
    if (!workspace.activeCompany) return;
    const criteriaObj = {};
    String(autoMoveForm.criteria).split(',').forEach(p => {
      const [k, v] = p.split(':');
      if (k) criteriaObj[k.trim()] = v ? v.trim() : true;
    });
    recruiterHTTPService.createAutoMoveRule(workspace.activeCompany.id, { targetStage: autoMoveForm.targetStage, criteria: criteriaObj })
      .then(r => { setAutomationRules(prev => [r.data, ...prev]); setAutomationActionMsg('Auto-move rule created.'); })
      .catch(() => setAutomationActionMsg('Failed to create auto-move rule.'));
  };

  const handleCreateAutoRejectRule = () => {
    if (!workspace.activeCompany) return;
    const conditions = String(autoRejectForm.screeningConditions).split(',').map(s => s.trim()).filter(Boolean);
    recruiterHTTPService.createAutoRejectRule(workspace.activeCompany.id, { screeningConditions: conditions, rejectMessage: autoRejectForm.rejectMessage })
      .then(r => { setAutomationRules(prev => [r.data, ...prev]); setAutomationActionMsg('Auto-reject rule created.'); })
      .catch(() => setAutomationActionMsg('Failed to create auto-reject rule.'));
  };

  const handleScheduleFollowUp = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.scheduleFollowUpEmailAutomation(workspace.activeCompany.id, followUpForm)
      .then(() => setAutomationActionMsg('Follow-up email scheduled.'))
      .catch(() => setAutomationActionMsg('Failed to schedule follow-up.'));
  };

  const handleTriggerReminder = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.triggerReminderForInactive(workspace.activeCompany.id, reminderForm)
      .then(() => setAutomationActionMsg('Reminder triggered.'))
      .catch(() => setAutomationActionMsg('Failed to trigger reminder.'));
  };

  const handleLoadWorkflows = () => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.getHiringWorkflows(workspace.activeCompany.id)
      .then(r => { setHiringWorkflows(r.data || []); setAutomationActionMsg('Hiring workflows loaded.'); })
      .catch(() => setAutomationActionMsg('Failed to load workflows.'));
  };

  const handleCreateWorkflow = () => {
    if (!workspace.activeCompany || !workflowForm.name) return;
    const steps = workflowForm.steps.split(',').map(s => s.trim()).filter(Boolean);
    recruiterHTTPService.createHiringWorkflow(workspace.activeCompany.id, { name: workflowForm.name, description: workflowForm.description, steps })
      .then(r => { setHiringWorkflows(prev => [r.data, ...prev]); setAutomationActionMsg('Hiring workflow created.'); })
      .catch(() => setAutomationActionMsg('Failed to create workflow.'));
  };

  const handleDeleteAutomationRule = (ruleId) => {
    if (!workspace.activeCompany) return;
    recruiterHTTPService.deleteAutomationRule(workspace.activeCompany.id, ruleId)
      .then(() => { setAutomationRules(prev => prev.filter(r => r.id !== ruleId)); setAutomationActionMsg('Rule deleted.'); })
      .catch(() => setAutomationActionMsg('Failed to delete rule.'));
  };

  const recruiterName = workspace.recruiter ? workspace.recruiter.fullName : 'Recruiter';
  const activeCompanyName = workspace.activeCompany ? workspace.activeCompany.name : 'No company selected';
  const reviewCount = workspace.activeCompany && workspace.activeCompany.reviews ? workspace.activeCompany.reviews.length : 0;
  const locationCount = workspace.activeCompany && workspace.activeCompany.locations ? workspace.activeCompany.locations.length : 0;
  const mediaCount = workspace.activeCompany && workspace.activeCompany.media ? workspace.activeCompany.media.length : 0;

  const renderOverview = () => (
    <div className="fo-member-admin__main">
      <section className="dashboard-hero card">
        <div className="dashboard-hero__content">
          <div>
            <span className="dashboard-hero__eyebrow">Recruiter workspace</span>
            <h2 className="dashboard-hero__title">{recruiterName}</h2>
            <p className="dashboard-hero__subtitle">{workspace.recruiter ? workspace.recruiter.role : 'Recruiter'} at {activeCompanyName}</p>
          </div>
          <div className="dashboard-hero__stats">
            <div><strong>{workspace.companies.length}</strong><span>Managed companies</span></div>
            <div><strong>{workspace.teamMembers.length}</strong><span>Team members</span></div>
            <div><strong>{workspace.invitations.length}</strong><span>Pending invites</span></div>
            <div><strong>{reviewCount}</strong><span>Company reviews</span></div>
          </div>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px' }}>Key Hiring Metrics</h4>
        <div className="fo-grid cols-2" style={{ gap: '10px' }}>
          <div className="fo-list-item"><strong>Active Jobs</strong><br />{companyJobs.filter((j) => j.status === 'Published').length}</div>
          <div className="fo-list-item"><strong>Total Applicants</strong><br />{atsApplicants.length}</div>
          <div className="fo-list-item"><strong>Interviews Scheduled</strong><br />{interviews.length}</div>
          <div className="fo-list-item"><strong>Offers Sent</strong><br />{offers.length}</div>
          <div className="fo-list-item"><strong>Hires</strong><br />{atsApplicants.filter((a) => a.stage === 'Hired').length}</div>
          <div className="fo-list-item"><strong>Time to Hire (avg days)</strong><br />{hiringMetrics.averageTimeToHire || '—'}</div>
          <div className="fo-list-item"><strong>Cost per Hire (avg)</strong><br />{hiringMetrics.averageCostPerHire || '—'}</div>
          <div className="fo-list-item"><strong>Rejected Candidates</strong><br />{atsApplicants.filter((a) => a.stage === 'Rejected').length}</div>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px' }}>Quick Actions</h4>
        <div className="fo-grid cols-2" style={{ gap: '10px' }}>
          <button type="button" className="fo-btn" onClick={() => setActiveSection('jobs')}>Post a Job</button>
          <button type="button" className="fo-btn" onClick={() => setActiveSection('sourcing')}>Search Candidates</button>
          <button type="button" className="fo-btn" onClick={() => setActiveSection('analytics')}>View Analytics</button>
          <button type="button" className="fo-btn" onClick={() => setActiveSection('ats')}>Manage Applications</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px' }}>Quick Navigation</h4>
        <div className="fo-grid cols-2" style={{ gap: '10px' }}>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('account')}>Open Account & Workspace</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('team')}>Open Team Management</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('company')}>Open Company Profile</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('media')}>Open Branding & Visibility</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('ats')}>Open Application Management</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('sourcing')}>Open Candidate Search & Sourcing</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('communication')}>Open Communication Actions</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('interviews')}>Open Interview Management</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('evaluation')}>Open Candidate Evaluation</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('offers')}>Open Offer & Hiring Actions</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('analytics')}>Open Analytics & Reporting</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('billing')}>Open Subscription & Billing</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('notifications')}>Open Notification Actions</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('ai')}>Open AI-Powered Actions</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('crm')}>Open Talent Pool & CRM</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('settings')}>Open Settings & Controls</button>
          <button type="button" className="fo-btn-outline" onClick={() => setActiveSection('automation')}>Open Automation Actions</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px' }}>Active Company Snapshot</h4>
        {workspace.activeCompany ? (
          <div className="fo-grid cols-2" style={{ gap: '10px' }}>
            <div className="fo-list-item"><strong>Name:</strong> {workspace.activeCompany.name}</div>
            <div className="fo-list-item"><strong>Visibility:</strong> {workspace.activeCompany.visibility}</div>
            <div className="fo-list-item"><strong>Locations:</strong> {locationCount}</div>
            <div className="fo-list-item"><strong>Media Assets:</strong> {mediaCount}</div>
          </div>
        ) : <p className="fo-muted">No active company selected.</p>}
      </section>
    </div>
  );

  const renderAccountWorkspace = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Register as Recruiter</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleRegisterRecruiter}>
          <input className="fo-input" placeholder="Full name" value={registerForm.fullName} onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))} />
          <input className="fo-input" placeholder="Work email" value={registerForm.email} onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))} />
          <input className="fo-input" placeholder="Password" type="password" value={registerForm.password} onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))} />
          <input className="fo-input" placeholder="Role" value={registerForm.role} onChange={(event) => setRegisterForm((prev) => ({ ...prev, role: event.target.value }))} />
          <input className="fo-input" placeholder="Contact phone" value={registerForm.contactPhone} onChange={(event) => setRegisterForm((prev) => ({ ...prev, contactPhone: event.target.value }))} />
          <input className="fo-input" placeholder="Initial company name" value={registerForm.companyName} onChange={(event) => setRegisterForm((prev) => ({ ...prev, companyName: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Register Recruiter</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Join or Create Company Account</h3>
        <div className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }}>
          <form className="fo-grid" style={{ gap: '8px' }} onSubmit={handleCreateCompany}>
            <input className="fo-input" placeholder="New company name" value={createCompanyForm.name} onChange={(event) => setCreateCompanyForm((prev) => ({ ...prev, name: event.target.value }))} />
            <textarea className="fo-input" placeholder="Company short description" value={createCompanyForm.description} onChange={(event) => setCreateCompanyForm((prev) => ({ ...prev, description: event.target.value }))} />
            <button type="submit" className="fo-btn">Create Company</button>
          </form>

          <form className="fo-grid" style={{ gap: '8px' }} onSubmit={handleJoinCompany}>
            <input className="fo-input" placeholder="Existing company name" value={joinCompanyName} onChange={(event) => setJoinCompanyName(event.target.value)} />
            <button type="submit" className="fo-btn">Join Existing Company</button>
            <label className="fo-label">Switch between companies</label>
            <select className="fo-select" value={workspace.activeCompany ? workspace.activeCompany.id : ''} onChange={(event) => handleSwitchCompany(event.target.value)}>
              {(workspace.companies || []).map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </form>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Update Recruiter Profile</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleUpdateProfile}>
          <input className="fo-input" placeholder="Full name" value={profileForm.fullName} onChange={(event) => setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))} />
          <input className="fo-input" placeholder="Role" value={profileForm.role} onChange={(event) => setProfileForm((prev) => ({ ...prev, role: event.target.value }))} />
          <input className="fo-input" placeholder="Contact phone" value={profileForm.contactPhone} onChange={(event) => setProfileForm((prev) => ({ ...prev, contactPhone: event.target.value }))} />
          <button type="submit" className="fo-btn">Save Profile</button>
        </form>
      </section>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Invite Team Members</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleInvite}>
          <input className="fo-input" placeholder="Name" value={inviteForm.name} onChange={(event) => setInviteForm((prev) => ({ ...prev, name: event.target.value }))} />
          <input className="fo-input" placeholder="Email" value={inviteForm.email} onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))} />
          <select className="fo-select" value={inviteForm.role} onChange={(event) => setInviteForm((prev) => ({ ...prev, role: event.target.value }))}>
            <option value="Owner">Owner</option>
            <option value="Recruiter">Recruiter</option>
            <option value="HR">Hiring Manager</option>
            <option value="Interviewer">Interviewer</option>
          </select>
          <input className="fo-input" placeholder="Permissions comma-separated" value={inviteForm.permissions} onChange={(event) => setInviteForm((prev) => ({ ...prev, permissions: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Send Invite</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Team Members</h3>
        {(workspace.teamMembers || []).map((member) => (
          <div key={member.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div>
                <strong>{member.name}</strong>
                <p style={{ margin: '4px 0 8px' }}>{member.email} · {member.role}</p>
              </div>
              <button type="button" className="fo-btn-outline" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleRemoveMember(member.id)}>Remove</button>
            </div>
            <div className="fo-grid cols-2" style={{ gap: '8px' }}>
              <select
                className="fo-select"
                defaultValue={member.role}
                onChange={(event) => handleAssignRole(member.id, event.target.value, (member.permissions || []).join(','))}
              >
                <option value="Owner">Owner</option>
                <option value="Recruiter">Recruiter</option>
                <option value="HR">Hiring Manager</option>
                <option value="Interviewer">Interviewer</option>
              </select>
              <input
                className="fo-input"
                defaultValue={(member.permissions || []).join(',')}
                onBlur={(event) => handleAssignRole(member.id, member.role, event.target.value)}
              />
            </div>
          </div>
        ))}
        {(workspace.teamMembers || []).length === 0 ? <p className="fo-muted">No team members yet.</p> : null}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Invitation Queue</h3>
        {(workspace.invitations || []).length === 0 ? (
          <p className="fo-muted">No pending invitations.</p>
        ) : (
          <ul className="fo-list">
            {workspace.invitations.map((invitation) => (
              <li key={invitation.id} className="fo-list-item">
                <strong>{invitation.name}</strong>
                <p style={{ margin: '4px 0' }}>{invitation.email}</p>
                <span className="fo-muted">{invitation.role} | {invitation.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );

  const renderCompanyProfile = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Create/Edit Company Profile</h3>
        <form className="fo-grid" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleUpdateCompanyProfile}>
          <input className="fo-input" placeholder="Company name" value={companyProfileForm.name} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, name: event.target.value }))} />
          <textarea className="fo-input" placeholder="Company description" value={companyProfileForm.description} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, description: event.target.value }))} />
          <textarea className="fo-input" placeholder="Culture" value={companyProfileForm.culture} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, culture: event.target.value }))} />
          <textarea className="fo-input" placeholder="Benefits" value={companyProfileForm.benefits} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, benefits: event.target.value }))} />
          <button type="submit" className="fo-btn">Save Company Profile</button>
        </form>
      </section>
    </div>
  );

  const renderBrandingVisibility = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Upload Logo, Banner, Media</h3>
        <form className="fo-grid" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleUploadMedia}>
          <input className="fo-input" placeholder="Logo URL" value={companyProfileForm.logoUrl} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, logoUrl: event.target.value }))} />
          <input className="fo-input" placeholder="Banner URL" value={companyProfileForm.bannerUrl} onChange={(event) => setCompanyProfileForm((prev) => ({ ...prev, bannerUrl: event.target.value }))} />
          <input className="fo-input" placeholder="Media URL" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
          <button type="submit" className="fo-btn">Save Media</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Add Office Locations</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleAddLocation}>
          <input className="fo-input" placeholder="Office location" value={locationInput} onChange={(event) => setLocationInput(event.target.value)} />
          <button type="submit" className="fo-btn">Add Location</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Manage Company Visibility</h3>
        <select className="fo-select" value={workspace.activeCompany ? workspace.activeCompany.visibility : 'Public'} onChange={(event) => handleVisibility(event.target.value)}>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="Limited">Limited</option>
        </select>
      </section>
    </div>
  );

  const renderReviews = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Respond to Company Reviews</h3>
        {(workspace.activeCompany && workspace.activeCompany.reviews ? workspace.activeCompany.reviews : []).map((review) => (
          <div key={review.id} className="fo-list-item" style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0 }}><strong>{review.author}</strong> ({review.rating}/5)</p>
            <p style={{ margin: '6px 0' }}>{review.comment}</p>
            <textarea
              className="fo-input"
              placeholder="Write response"
              value={reviewResponses[review.id] !== undefined ? reviewResponses[review.id] : (review.response || '')}
              onChange={(event) => setReviewResponses((prev) => ({ ...prev, [review.id]: event.target.value }))}
            />
            <button type="button" className="fo-btn" style={{ marginTop: '8px' }} onClick={() => handleRespondReview(review.id)}>
              Respond to Review
            </button>
          </div>
        ))}
        {(!workspace.activeCompany || !(workspace.activeCompany.reviews || []).length) ? <p className="fo-muted">No company reviews yet.</p> : null}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Current Company Snapshot</h3>
        {workspace.activeCompany ? (
          <div className="fo-grid cols-2" style={{ gap: '10px' }}>
            <div className="fo-list-item"><strong>Name:</strong> {workspace.activeCompany.name}</div>
            <div className="fo-list-item"><strong>Visibility:</strong> {workspace.activeCompany.visibility}</div>
            <div className="fo-list-item"><strong>Locations:</strong> {(workspace.activeCompany.locations || []).join(', ') || 'None'}</div>
            <div className="fo-list-item"><strong>Media Items:</strong> {(workspace.activeCompany.media || []).length}</div>
          </div>
        ) : <p className="fo-muted">No active company selected.</p>}
      </section>
    </div>
  );

  const renderJobManagement = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>{editingJobId ? `Edit Job #${editingJobId}` : 'Create New Job Posting'}</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleCreateOrUpdateJob}>
          <input className="fo-input" placeholder="Job title *" required value={jobForm.title} onChange={(event) => setJobForm((prev) => ({ ...prev, title: event.target.value }))} />
          <select className="fo-select" value={jobForm.employmentType} onChange={(event) => setJobForm((prev) => ({ ...prev, employmentType: event.target.value }))}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
          <input className="fo-input" placeholder="Location" value={jobForm.location} onChange={(event) => setJobForm((prev) => ({ ...prev, location: event.target.value }))} />
          <input className="fo-input" placeholder="Salary (e.g. 50,000 – 70,000 USD)" value={jobForm.salary} onChange={(event) => setJobForm((prev) => ({ ...prev, salary: event.target.value }))} />
          <input className="fo-input" placeholder="Required skills (comma-separated)" value={jobForm.skills} onChange={(event) => setJobForm((prev) => ({ ...prev, skills: event.target.value }))} />
          <input className="fo-input" placeholder="Application deadline (YYYY-MM-DD)" value={jobForm.applicationDeadline} onChange={(event) => setJobForm((prev) => ({ ...prev, applicationDeadline: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Job description *" rows={4} required value={jobForm.description} onChange={(event) => setJobForm((prev) => ({ ...prev, description: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Requirements" rows={3} value={jobForm.requirements} onChange={(event) => setJobForm((prev) => ({ ...prev, requirements: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Benefits" rows={2} value={jobForm.benefits} onChange={(event) => setJobForm((prev) => ({ ...prev, benefits: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>{editingJobId ? 'Update Job' : 'Create Job'}</button>
          {editingJobId ? (
            <button type="button" className="fo-btn-outline" style={{ gridColumn: '1 / -1' }} onClick={() => { setJobForm(emptyJobForm); setEditingJobId(null); }}>Cancel Edit</button>
          ) : null}
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Job Postings</h3>
        {companyJobs.length === 0 ? <p className="fo-muted">No jobs created yet. Create one above.</p> : null}
        {companyJobs.map((job) => (
          <article key={job.id} className="fo-list-item" style={{ marginBottom: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{job.title}</p>
                <p className="fo-muted" style={{ margin: '4px 0' }}>{job.location} · {job.employmentType} · {job.salary || 'Salary not specified'}</p>
              </div>
              <span className="fo-pill" style={{ backgroundColor: job.status === 'Published' ? '#dcfce7' : job.status === 'Paused' ? '#fef9c3' : '#f3f4f6' }}>{job.status}</span>
            </div>
            {(job.skills || []).length ? (
              <div className="fo-cta-row" style={{ margin: '8px 0' }}>
                {job.skills.map((skill) => <span key={skill} className="fo-chip">{skill}</span>)}
              </div>
            ) : null}
            <p className="fo-muted" style={{ margin: '4px 0', fontSize: '0.85em' }}>Deadline: {job.applicationDeadline || 'No deadline'} · Created: {new Date(job.createdAt).toLocaleDateString()}</p>
            <div className="fo-cta-row" style={{ marginTop: '8px' }}>
              <button type="button" className="fo-btn-outline" onClick={() => handleEditJob(job)}>Edit</button>
              <button type="button" className="fo-btn-outline" onClick={() => handlePublishJob(job.id)}>Publish</button>
              <button type="button" className="fo-btn-outline" onClick={() => handlePauseJob(job.id)}>Pause</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleDuplicateJob(job.id)}>Duplicate</button>
              <button type="button" className="fo-btn-outline" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleDeleteJob(job.id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  const renderAts = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Application Management Actions (ATS Core)</h3>
        <div className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }}>
          <input
            className="fo-input"
            placeholder="Filter by skills"
            value={atsFilters.skills}
            onChange={(event) => setAtsFilters((prev) => ({ ...prev, skills: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Min experience (years)"
            value={atsFilters.minExperience}
            onChange={(event) => setAtsFilters((prev) => ({ ...prev, minExperience: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Filter by screening answer"
            value={atsFilters.screening}
            onChange={(event) => setAtsFilters((prev) => ({ ...prev, screening: event.target.value }))}
          />
          <select
            className="fo-select"
            value={atsFilters.sortBy}
            onChange={(event) => setAtsFilters((prev) => ({ ...prev, sortBy: event.target.value }))}
          >
            <option value="relevance">Sort by relevance</option>
            <option value="date">Sort by date</option>
            <option value="rating">Sort by rating</option>
          </select>
          <select
            className="fo-select"
            value={atsFilters.stage}
            onChange={(event) => setAtsFilters((prev) => ({ ...prev, stage: event.target.value }))}
          >
            <option value="">All stages</option>
            {PIPELINE_STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            <option value="Rejected">Rejected</option>
          </select>
          <button
            type="button"
            className="fo-btn-outline"
            onClick={() => setAtsFilters({ skills: '', minExperience: '', screening: '', stage: '', sortBy: 'relevance' })}
          >
            Reset Filters
          </button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Pipeline Management</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select className="fo-select" style={{ minWidth: '180px' }} value={bulkStage} onChange={(event) => setBulkStage(event.target.value)}>
              {PIPELINE_STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            </select>
            <button type="button" className="fo-btn" onClick={handleBulkMove}>Bulk Move Selected</button>
          </div>
        </div>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Select candidates then bulk move through Applied → Screening → Interview → Offer → Hired.</p>
      </section>

      {atsJobs.length === 0 ? (
        <section className="fo-card" style={{ padding: '16px' }}>
          <p className="fo-muted" style={{ margin: 0 }}>No applicants found for this company with current filters.</p>
        </section>
      ) : null}

      {atsJobs.map((job) => (
        <section key={job.jobId} className="fo-card" style={{ padding: '16px' }}>
          <h3 style={{ marginTop: 0 }}>{job.jobTitle} <span className="fo-muted">({(job.applicants || []).length} applicants)</span></h3>
          <div className="fo-grid" style={{ gap: '12px' }}>
            {(job.applicants || []).map((applicant) => {
              const isSelected = selectedApplicants.includes(applicant.id);
              const candidateProfile = candidateProfiles[applicant.id];
              return (
                <article key={applicant.id} className="fo-list-item" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 700 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedApplicants((prev) => Array.from(new Set([...prev, applicant.id])));
                          } else {
                            setSelectedApplicants((prev) => prev.filter((id) => id !== applicant.id));
                          }
                        }}
                      />
                      {applicant.candidateName}
                    </label>
                    <div className="fo-cta-row">
                      <span className="fo-pill">Stage: {applicant.stage}</span>
                      <span className="fo-pill">Rating: {applicant.rating}</span>
                      <span className="fo-pill">Exp: {applicant.experienceYears}y</span>
                    </div>
                  </div>

                  <p className="fo-muted" style={{ margin: '6px 0' }}>{applicant.candidateEmail} • Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</p>

                  <div className="fo-cta-row" style={{ marginBottom: '8px' }}>
                    {(applicant.skills || []).map((skill) => <span key={`${applicant.id}-${skill}`} className="fo-chip">{skill}</span>)}
                    {(applicant.tags || []).map((tag) => <span key={`${applicant.id}-tag-${tag}`} className="fo-pill">{tag}</span>)}
                  </div>

                  {applicant.stage === 'Rejected' && applicant.rejectedReason ? (
                    <p className="fo-muted" style={{ margin: '0 0 8px' }}><strong>Rejected reason:</strong> {applicant.rejectedReason}</p>
                  ) : null}

                  <div className="fo-grid cols-2" style={{ gap: '8px', marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Add note/comment"
                      value={noteDrafts[applicant.id] || ''}
                      onChange={(event) => setNoteDrafts((prev) => ({ ...prev, [applicant.id]: event.target.value }))}
                    />
                    <button type="button" className="fo-btn-outline" onClick={() => handleAddNote(applicant.id)}>Save Note</button>
                    <input
                      className="fo-input"
                      placeholder="Tag candidate (Strong, Backup...)"
                      value={tagDrafts[applicant.id] || ''}
                      onChange={(event) => setTagDrafts((prev) => ({ ...prev, [applicant.id]: event.target.value }))}
                    />
                    <div className="fo-cta-row">
                      <button type="button" className="fo-btn-outline" onClick={() => handleTagCandidate(applicant.id, 'add')}>Add Tag</button>
                      <button type="button" className="fo-btn-outline" onClick={() => handleTagCandidate(applicant.id, 'remove')}>Remove Tag</button>
                    </div>
                  </div>

                  <div className="fo-cta-row" style={{ marginBottom: '8px' }}>
                    <button type="button" className="fo-btn-outline" onClick={() => handleOpenCandidateProfile(applicant.id)}>Open Profile</button>
                    <button type="button" className="fo-btn-outline" onClick={() => handleDownloadResume(applicant.id)}>Download Resume</button>
                    {PIPELINE_STAGES.map((stage) => (
                      <button key={`${applicant.id}-stage-${stage}`} type="button" className="fo-btn-outline" onClick={() => handleMoveStage(applicant.id, stage)}>
                        Move to {stage}
                      </button>
                    ))}
                    <button type="button" className="fo-btn-outline" onClick={() => handleRejectCandidate(applicant.id)}>Reject (with reason)</button>
                    {applicant.stage === 'Rejected' ? (
                      <button type="button" className="fo-btn-outline" onClick={() => handleReopenCandidate(applicant.id)}>Reopen Candidate</button>
                    ) : null}
                  </div>

                  <div className="fo-grid cols-2" style={{ gap: '8px', marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Assign recruiter ID"
                      value={assignRecruiterDrafts[applicant.id] || ''}
                      onChange={(event) => setAssignRecruiterDrafts((prev) => ({ ...prev, [applicant.id]: event.target.value }))}
                    />
                    <button type="button" className="fo-btn-outline" onClick={() => handleAssignRecruiter(applicant.id)}>
                      Assign Recruiter {applicant.assignedRecruiterId ? `(currently #${applicant.assignedRecruiterId})` : ''}
                    </button>
                  </div>

                  {candidateProfile ? (
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>Candidate Profile</p>
                      <p className="fo-muted" style={{ margin: '4px 0 0' }}>
                        {candidateProfile.candidateName} • {candidateProfile.candidateEmail} • {candidateProfile.experienceYears} years
                      </p>
                      <p className="fo-muted" style={{ margin: '4px 0 0' }}>
                        Screening Answers: {Object.entries(candidateProfile.screeningAnswers || {}).map(([key, value]) => `${key}: ${value}`).join(' | ')}
                      </p>
                    </div>
                  ) : null}

                  {(applicant.notes || []).length ? (
                    <div style={{ marginTop: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>Notes</p>
                      <ul style={{ margin: '6px 0 0 16px' }}>
                        {applicant.notes.map((note) => <li key={note.id}>{note.text}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );

  const renderSourcing = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Candidate Search & Sourcing Actions</h3>
        <div className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }}>
          <input
            className="fo-input"
            placeholder="Search candidate database"
            value={candidateFilters.keyword}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, keyword: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Skills (comma separated)"
            value={candidateFilters.skills}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, skills: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Location"
            value={candidateFilters.location}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, location: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Min experience"
            value={candidateFilters.minExperience}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, minExperience: event.target.value }))}
          />
          <input
            className="fo-input"
            placeholder="Salary expectation (e.g. 3000 TND)"
            value={candidateFilters.salary}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, salary: event.target.value }))}
          />
          <select
            className="fo-select"
            value={candidateFilters.education}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, education: event.target.value }))}
          >
            <option value="">Any education level</option>
            <option value="High School">High School</option>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Bootcamp">Bootcamp / Certification</option>
          </select>
          <input
            className="fo-input"
            placeholder="Industry (e.g. FinTech, Healthcare)"
            value={candidateFilters.industry}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, industry: event.target.value }))}
          />
          <select
            className="fo-select"
            value={candidateFilters.availability}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, availability: event.target.value }))}
          >
            <option value="">Any availability</option>
            <option value="Immediately">Immediately available</option>
            <option value="2 weeks">2 weeks notice</option>
            <option value="1 month">1 month notice</option>
            <option value="3 months">3 months notice</option>
            <option value="Not looking">Not actively looking</option>
          </select>
          <input
            className="fo-input"
            style={{ gridColumn: '1 / -1' }}
            placeholder="Boolean search (example: React AND TypeScript NOT Angular)"
            value={candidateFilters.booleanQuery}
            onChange={(event) => setCandidateFilters((prev) => ({ ...prev, booleanQuery: event.target.value }))}
          />
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Shortlist & Talent Pools</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>
          Shortlisted candidates: {(candidateSearchResult.shortlist && candidateSearchResult.shortlist.candidateIds ? candidateSearchResult.shortlist.candidateIds : []).length}
        </p>
        <div className="fo-cta-row">
          {(candidateSearchResult.talentPools || []).map((pool) => (
            <span key={pool.id} className="fo-pill">{pool.name}: {(pool.candidateIds || []).length}</span>
          ))}
        </div>
      </section>

      {(candidateSearchResult.candidates || []).length === 0 ? (
        <section className="fo-card" style={{ padding: '16px' }}>
          <p className="fo-muted" style={{ margin: 0 }}>No candidates matched your current sourcing filters.</p>
        </section>
      ) : null}

      {(candidateSearchResult.candidates || []).map((candidate) => {
        const profile = candidateSearchProfiles[candidate.id];
        return (
          <section key={candidate.id} className="fo-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{candidate.fullName}</h3>
              <div className="fo-cta-row">
                <span className="fo-pill">{candidate.location}</span>
                <span className="fo-pill">{candidate.experienceYears} years</span>
                {candidate.shortlisted ? <span className="fo-pill">Shortlisted</span> : null}
              </div>
            </div>
            <p className="fo-muted" style={{ marginTop: '6px' }}>{candidate.email}</p>

            <div className="fo-cta-row" style={{ marginBottom: '8px' }}>
              {(candidate.skills || []).map((skill) => <span key={`${candidate.id}-${skill}`} className="fo-chip">{skill}</span>)}
              {(candidate.pools || []).map((poolName) => <span key={`${candidate.id}-${poolName}`} className="fo-pill">{poolName}</span>)}
            </div>

            <div className="fo-grid cols-2" style={{ gap: '8px' }}>
              <button type="button" className="fo-btn-outline" onClick={() => handleOpenSourcingProfile(candidate.id)}>View Candidate Profile</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleShortlistCandidate(candidate.id)}>Save to Shortlist</button>
              <input
                className="fo-input"
                placeholder="Talent pool name"
                value={poolDrafts[candidate.id] || ''}
                onChange={(event) => setPoolDrafts((prev) => ({ ...prev, [candidate.id]: event.target.value }))}
              />
              <button type="button" className="fo-btn-outline" onClick={() => handleAddToTalentPool(candidate.id)}>Add to Talent Pool</button>
              <textarea
                className="fo-input"
                style={{ gridColumn: '1 / -1' }}
                placeholder="Outreach message to passive candidate"
                value={outreachDrafts[candidate.id] || ''}
                onChange={(event) => setOutreachDrafts((prev) => ({ ...prev, [candidate.id]: event.target.value }))}
              />
              <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={() => handleOutreachCandidate(candidate.id)}>Contact Passive Candidate</button>
            </div>

            {profile ? (
              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '10px', paddingTop: '10px' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Profile</p>
                <p className="fo-muted" style={{ margin: '4px 0 0' }}>{profile.summary || 'No summary provided.'}</p>
                <p className="fo-muted" style={{ margin: '4px 0 0' }}>Source: {profile.source || 'Talent DB'}</p>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );

  const renderCommunication = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Communication Actions</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleSendMessage}>
          <input className="fo-input" placeholder="Candidate ID" value={messageForm.candidateId} onChange={(event) => setMessageForm((prev) => ({ ...prev, candidateId: event.target.value }))} />
          <input className="fo-input" placeholder="Message subject" value={messageForm.subject} onChange={(event) => setMessageForm((prev) => ({ ...prev, subject: event.target.value }))} />
          <textarea className="fo-input" placeholder="Message body" value={messageForm.body} onChange={(event) => setMessageForm((prev) => ({ ...prev, body: event.target.value }))} />
          <input className="fo-input" placeholder="Attachments (comma-separated URLs)" value={messageForm.attachments} onChange={(event) => setMessageForm((prev) => ({ ...prev, attachments: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Send Message to Candidate</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Message Templates</h3>
        <form className="fo-grid" style={{ gap: '8px', marginTop: '8px' }} onSubmit={handleSaveTemplate}>
          <input className="fo-input" placeholder="Template name" value={templateForm.name} onChange={(event) => setTemplateForm((prev) => ({ ...prev, name: event.target.value }))} />
          <input className="fo-input" placeholder="Template subject" value={templateForm.subject} onChange={(event) => setTemplateForm((prev) => ({ ...prev, subject: event.target.value }))} />
          <textarea className="fo-input" placeholder="Template body" value={templateForm.body} onChange={(event) => setTemplateForm((prev) => ({ ...prev, body: event.target.value }))} />
          <button type="submit" className="fo-btn">Save Message Template</button>
        </form>
        <div className="fo-cta-row" style={{ marginTop: '10px' }}>
          {messageTemplates.map((template) => (
            <span key={template.id} className="fo-pill">{template.name}</span>
          ))}
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Send Bulk Messages</h3>
        <form className="fo-grid" style={{ gap: '8px', marginTop: '8px' }} onSubmit={handleSendBulkMessages}>
          <input className="fo-input" placeholder="Candidate IDs (e.g. 201,202)" value={bulkMessageForm.candidateIds} onChange={(event) => setBulkMessageForm((prev) => ({ ...prev, candidateIds: event.target.value }))} />
          <input className="fo-input" placeholder="Bulk subject" value={bulkMessageForm.subject} onChange={(event) => setBulkMessageForm((prev) => ({ ...prev, subject: event.target.value }))} />
          <textarea className="fo-input" placeholder="Bulk message body" value={bulkMessageForm.body} onChange={(event) => setBulkMessageForm((prev) => ({ ...prev, body: event.target.value }))} />
          <input className="fo-input" placeholder="Attachments" value={bulkMessageForm.attachments} onChange={(event) => setBulkMessageForm((prev) => ({ ...prev, attachments: event.target.value }))} />
          <button type="submit" className="fo-btn">Send Bulk Messages</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Email Automation</h3>
        <div className="fo-grid cols-2" style={{ gap: '10px' }}>
          <input className="fo-input" placeholder="Candidate ID" value={automationForm.candidateId} onChange={(event) => setAutomationForm((prev) => ({ ...prev, candidateId: event.target.value }))} />
          <input className="fo-input" placeholder="Interview date/time" value={automationForm.interviewDate} onChange={(event) => setAutomationForm((prev) => ({ ...prev, interviewDate: event.target.value }))} />
          <select className="fo-select" value={automationForm.interviewMode} onChange={(event) => setAutomationForm((prev) => ({ ...prev, interviewMode: event.target.value }))}>
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
            <option value="Phone">Phone</option>
          </select>
          <input className="fo-input" placeholder="Rejection reason" value={automationForm.reason} onChange={(event) => setAutomationForm((prev) => ({ ...prev, reason: event.target.value }))} />
          <textarea className="fo-input" placeholder="Follow-up message" value={automationForm.followUpBody} onChange={(event) => setAutomationForm((prev) => ({ ...prev, followUpBody: event.target.value }))} />
          <input className="fo-input" placeholder="Attachments" value={automationForm.attachments} onChange={(event) => setAutomationForm((prev) => ({ ...prev, attachments: event.target.value }))} />
        </div>
        <div className="fo-cta-row" style={{ marginTop: '10px' }}>
          <button type="button" className="fo-btn-outline" onClick={handleInterviewInvite}>Send Interview Invitation</button>
          <button type="button" className="fo-btn-outline" onClick={handleRejectionEmail}>Send Rejection Email</button>
          <button type="button" className="fo-btn-outline" onClick={handleFollowUpEmail}>Send Follow-up</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Create Automated Sequences</h3>
        <form className="fo-grid" style={{ gap: '8px' }} onSubmit={handleCreateSequence}>
          <input className="fo-input" placeholder="Sequence name" value={sequenceForm.name} onChange={(event) => setSequenceForm((prev) => ({ ...prev, name: event.target.value }))} />
          <textarea
            className="fo-input"
            placeholder="Steps (one per line: delayDays|subject|body)"
            value={sequenceForm.stepsText}
            onChange={(event) => setSequenceForm((prev) => ({ ...prev, stepsText: event.target.value }))}
          />
          <button type="submit" className="fo-btn">Create Automated Sequence</button>
        </form>

        {(sequences || []).map((sequence) => (
          <div key={sequence.id} className="fo-list-item" style={{ marginTop: '8px' }}>
            <strong>{sequence.name}</strong>
            <p className="fo-muted" style={{ margin: '4px 0' }}>Steps: {(sequence.steps || []).length} | Assignments: {(sequence.assignments || []).length}</p>
            <button type="button" className="fo-btn-outline" onClick={() => handleAssignSequence(sequence.id)}>
              Assign Sequence to Candidate ID {automationForm.candidateId || '(set candidate id above)'}
            </button>
          </div>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Message Center</h3>
        {(messages || []).length === 0 ? <p className="fo-muted">No candidate messages yet.</p> : null}
        {(messages || []).map((message) => (
          <article key={message.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              #{message.id} [{message.direction}] Candidate {message.candidateId} - {message.subject || message.type}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>{message.body}</p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>Attachments: {(message.attachments || []).join(', ') || 'None'}</p>
            <textarea
              className="fo-input"
              placeholder="Reply to candidate message"
              value={replyDrafts[message.id] || ''}
              onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [message.id]: event.target.value }))}
            />
            <button type="button" className="fo-btn-outline" style={{ marginTop: '8px' }} onClick={() => handleReplyMessage(message.id)}>
              Reply to Candidate Message
            </button>
          </article>
        ))}
      </section>
    </div>
  );

  const renderInterviewManagement = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Interview Management Actions</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleScheduleInterview}>
          <input className="fo-input" placeholder="Application ID" value={interviewForm.applicationId} onChange={(event) => setInterviewForm((prev) => ({ ...prev, applicationId: event.target.value }))} />
          <select className="fo-select" value={interviewForm.interviewType} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewType: event.target.value }))}>
            <option value="Phone">Phone</option>
            <option value="Video">Video</option>
            <option value="On-site">On-site</option>
          </select>
          <input className="fo-input" placeholder="Interviewer name" value={interviewForm.interviewerName} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewerName: event.target.value }))} />
          <input className="fo-input" placeholder="Interviewer email" value={interviewForm.interviewerEmail} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewerEmail: event.target.value }))} />
          <input className="fo-input" placeholder="Meeting link (Zoom / Teams / Google Meet URL)" value={interviewForm.meetingLink} onChange={(event) => setInterviewForm((prev) => ({ ...prev, meetingLink: event.target.value }))} style={{ gridColumn: '1 / -1' }} />
          <input className="fo-input" placeholder="Proposed slots (comma-separated ISO datetimes)" value={interviewForm.proposedSlots} onChange={(event) => setInterviewForm((prev) => ({ ...prev, proposedSlots: event.target.value }))} />
          <input className="fo-input" placeholder="Selected slot" value={interviewForm.selectedSlot} onChange={(event) => setInterviewForm((prev) => ({ ...prev, selectedSlot: event.target.value }))} />
          <select className="fo-select" value={interviewForm.calendarProvider} onChange={(event) => setInterviewForm((prev) => ({ ...prev, calendarProvider: event.target.value }))}>
            <option value="None">No calendar sync</option>
            <option value="Google">Google Calendar</option>
            <option value="Outlook">Outlook Calendar</option>
          </select>
          <textarea className="fo-input" placeholder="Interview context notes" value={interviewForm.notes} onChange={(event) => setInterviewForm((prev) => ({ ...prev, notes: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Invite Candidate to Interview</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Interview Queue</h3>
        {(interviews || []).length === 0 ? <p className="fo-muted">No interview schedules found.</p> : null}
        {(interviews || []).map((interview) => (
          <article key={interview.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              #{interview.id} Candidate {interview.candidateName} • {interview.interviewType} • {interview.status}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>
              Proposed: {(interview.proposedSlots || []).join(', ') || 'None'}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>
              Selected: {interview.selectedSlot || 'Not selected'} • Calendar: {interview.calendarProvider} ({interview.calendarSynced ? 'synced' : 'not synced'})
            </p>
            <div className="fo-cta-row" style={{ marginBottom: '8px' }}>
              <button type="button" className="fo-btn-outline" onClick={() => handleSyncInterview(interview.id, 'Google')}>Sync Google</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleSyncInterview(interview.id, 'Outlook')}>Sync Outlook</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleRescheduleInterview(interview)}>Reschedule</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleCancelInterview(interview.id)}>Cancel</button>
            </div>
            <div className="fo-grid cols-2" style={{ gap: '8px' }}>
              <textarea className="fo-input" placeholder="Interview notes" value={interviewNoteDrafts[interview.id] || interview.notes || ''} onChange={(event) => setInterviewNoteDrafts((prev) => ({ ...prev, [interview.id]: event.target.value }))} />
              <button type="button" className="fo-btn-outline" onClick={() => handleSaveInterviewNotes(interview.id)}>Save Notes</button>
              <textarea className="fo-input" placeholder="Feedback summary" value={(interviewFeedbackDrafts[interview.id] && interviewFeedbackDrafts[interview.id].feedback) || ''} onChange={(event) => setInterviewFeedbackDrafts((prev) => ({ ...prev, [interview.id]: { ...(prev[interview.id] || {}), feedback: event.target.value } }))} />
              <input className="fo-input" placeholder="Rating (0-5)" value={(interviewFeedbackDrafts[interview.id] && interviewFeedbackDrafts[interview.id].rating) || ''} onChange={(event) => setInterviewFeedbackDrafts((prev) => ({ ...prev, [interview.id]: { ...(prev[interview.id] || {}), rating: event.target.value } }))} />
              <button type="button" className="fo-btn-outline" onClick={() => handleSaveInterviewFeedback(interview.id)}>Save Feedback</button>
              <div className="fo-cta-row">
                <input className="fo-input" placeholder="Share with team member IDs (comma-separated)" value={interviewShareDrafts[interview.id] || ''} onChange={(event) => setInterviewShareDrafts((prev) => ({ ...prev, [interview.id]: event.target.value }))} />
                <button type="button" className="fo-btn-outline" onClick={() => handleShareInterviewFeedback(interview.id)}>Share with Team</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  const renderCandidateEvaluation = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Candidate Evaluation Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>
          Review screening answers, set ratings, submit structured feedback, compare candidates, and manage assessments.
        </p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Create Assessment Template (Test Builder)</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleCreateAssessmentTemplate}>
          <input className="fo-input" placeholder="Test title *" required value={assessmentTemplateForm.title} onChange={(event) => setAssessmentTemplateForm((prev) => ({ ...prev, title: event.target.value }))} />
          <select className="fo-select" value={assessmentTemplateForm.type} onChange={(event) => setAssessmentTemplateForm((prev) => ({ ...prev, type: event.target.value }))}>
            <option value="Technical">Technical / Coding</option>
            <option value="Aptitude">Aptitude</option>
            <option value="Language">Language</option>
            <option value="Personality">Personality</option>
            <option value="Behavioral">Behavioral</option>
          </select>
          <input className="fo-input" placeholder="Duration (minutes)" value={assessmentTemplateForm.durationMinutes} onChange={(event) => setAssessmentTemplateForm((prev) => ({ ...prev, durationMinutes: event.target.value }))} />
          <input className="fo-input" placeholder="Max score" value={assessmentTemplateForm.maxScore} onChange={(event) => setAssessmentTemplateForm((prev) => ({ ...prev, maxScore: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Test description / instructions" value={assessmentTemplateForm.description} onChange={(event) => setAssessmentTemplateForm((prev) => ({ ...prev, description: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Create Assessment Template</button>
        </form>
        {assessmentTemplates.length > 0 ? (
          <div style={{ marginTop: '12px' }}>
            <p className="fo-muted">Saved templates:</p>
            <div className="fo-cta-row">
              {assessmentTemplates.map((t) => <span key={t.id} className="fo-pill">{t.title} ({t.type})</span>)}
            </div>
          </div>
        ) : null}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Assign Assessment/Test</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleAssignAssessment}>
          <input className="fo-input" placeholder="Application ID" value={assessmentForm.applicationId} onChange={(event) => setAssessmentForm((prev) => ({ ...prev, applicationId: event.target.value }))} />
          <input className="fo-input" placeholder="Assessment title" value={assessmentForm.testTitle} onChange={(event) => setAssessmentForm((prev) => ({ ...prev, testTitle: event.target.value }))} />
          <select className="fo-select" value={assessmentForm.testType} onChange={(event) => setAssessmentForm((prev) => ({ ...prev, testType: event.target.value }))}>
            <option value="Technical">Technical / Coding</option>
            <option value="Aptitude">Aptitude</option>
            <option value="Language">Language</option>
            <option value="Personality">Personality</option>
            <option value="Behavioral">Behavioral</option>
          </select>
          <input className="fo-input" placeholder="Due date" value={assessmentForm.dueDate} onChange={(event) => setAssessmentForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
          <input className="fo-input" placeholder="Max score" value={assessmentForm.maxScore} onChange={(event) => setAssessmentForm((prev) => ({ ...prev, maxScore: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Assign Assessment</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Compare Candidates Side-by-Side</h3>
        <div className="fo-cta-row">
          <input className="fo-input" placeholder="Application IDs (e.g. 101,102)" value={compareIdsInput} onChange={(event) => setCompareIdsInput(event.target.value)} />
          <button type="button" className="fo-btn-outline" onClick={handleCompareCandidates}>Compare</button>
        </div>
        {(compareResult || []).map((candidate) => (
          <div key={candidate.applicationId} className="fo-list-item" style={{ marginTop: '8px' }}>
            <strong>{candidate.candidateName}</strong>
            <p className="fo-muted" style={{ margin: '4px 0' }}>App #{candidate.applicationId} • Stage: {candidate.stage} • Rating: {candidate.rating}</p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>Skills: {(candidate.skills || []).join(', ') || 'None'}</p>
          </div>
        ))}
      </section>

      {(atsApplicants || []).map((applicant) => {
        const answers = screeningAnswers[applicant.id];
        const feedbackDraft = structuredFeedbackDrafts[applicant.id] || {};
        return (
          <section key={applicant.id} className="fo-card" style={{ padding: '16px' }}>
            <h4 style={{ marginTop: 0 }}>{applicant.candidateName} <span className="fo-muted">(Application #{applicant.id})</span></h4>
            <p className="fo-muted" style={{ margin: '4px 0' }}>{applicant.candidateEmail} • {applicant.jobTitle}</p>

            <div className="fo-cta-row" style={{ marginBottom: '8px' }}>
              <button type="button" className="fo-btn-outline" onClick={() => handleReviewScreeningAnswers(applicant.id)}>Review Screening Answers</button>
              <input className="fo-input" style={{ maxWidth: '130px' }} placeholder="Rating 0-5" value={ratingDrafts[applicant.id] || ''} onChange={(event) => setRatingDrafts((prev) => ({ ...prev, [applicant.id]: event.target.value }))} />
              <button type="button" className="fo-btn-outline" onClick={() => handleRateCandidate(applicant.id)}>Save Rating</button>
            </div>

            {answers ? (
              <p className="fo-muted" style={{ margin: '4px 0' }}>
                Answers: {Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join(' | ')}
              </p>
            ) : null}

            <div className="fo-grid cols-2" style={{ gap: '8px' }}>
              <input className="fo-input" placeholder="Strengths (comma-separated)" value={feedbackDraft.strengths || ''} onChange={(event) => setStructuredFeedbackDrafts((prev) => ({ ...prev, [applicant.id]: { ...(prev[applicant.id] || {}), strengths: event.target.value } }))} />
              <input className="fo-input" placeholder="Concerns (comma-separated)" value={feedbackDraft.concerns || ''} onChange={(event) => setStructuredFeedbackDrafts((prev) => ({ ...prev, [applicant.id]: { ...(prev[applicant.id] || {}), concerns: event.target.value } }))} />
              <input className="fo-input" placeholder="Recommendation" value={feedbackDraft.recommendation || ''} onChange={(event) => setStructuredFeedbackDrafts((prev) => ({ ...prev, [applicant.id]: { ...(prev[applicant.id] || {}), recommendation: event.target.value } }))} />
              <input className="fo-input" placeholder="Overall score" value={feedbackDraft.overallScore || ''} onChange={(event) => setStructuredFeedbackDrafts((prev) => ({ ...prev, [applicant.id]: { ...(prev[applicant.id] || {}), overallScore: event.target.value } }))} />
              <button type="button" className="fo-btn-outline" style={{ gridColumn: '1 / -1' }} onClick={() => handleSaveStructuredFeedback(applicant.id)}>Save Structured Feedback</button>
            </div>
          </section>
        );
      })}

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Assessment Results Review</h3>
        {(assessmentResults || []).length === 0 ? <p className="fo-muted">No assessments assigned yet.</p> : null}
        {(assessmentResults || []).map((assessment) => {
          const reviewDraft = assessmentReviewDrafts[assessment.id] || {};
          return (
            <article key={assessment.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>
                #{assessment.id} {assessment.testTitle} • {assessment.candidateName} • Status: {assessment.status}
              </p>
              <p className="fo-muted" style={{ margin: '4px 0' }}>Score: {assessment.score === null ? 'Pending' : assessment.score} / {assessment.maxScore}</p>
              <div className="fo-grid cols-2" style={{ gap: '8px' }}>
                <input className="fo-input" placeholder="Score" value={reviewDraft.score || ''} onChange={(event) => setAssessmentReviewDrafts((prev) => ({ ...prev, [assessment.id]: { ...(prev[assessment.id] || {}), score: event.target.value } }))} />
                <input className="fo-input" placeholder="Status (Reviewed/Passed/Failed)" value={reviewDraft.status || ''} onChange={(event) => setAssessmentReviewDrafts((prev) => ({ ...prev, [assessment.id]: { ...(prev[assessment.id] || {}), status: event.target.value } }))} />
                <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Review notes" value={reviewDraft.resultNotes || ''} onChange={(event) => setAssessmentReviewDrafts((prev) => ({ ...prev, [assessment.id]: { ...(prev[assessment.id] || {}), resultNotes: event.target.value } }))} />
                <button type="button" className="fo-btn-outline" style={{ gridColumn: '1 / -1' }} onClick={() => handleReviewAssessmentResult(assessment.id)}>Save Test Result Review</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );

  const renderOfferHiring = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Offer & Hiring Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>
          Mark candidates selected, send offers, attach offer letters, track offer decisions, mark hires, and close job postings.
        </p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Create and Send Offer</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleCreateOffer}>
          <input className="fo-input" placeholder="Application ID" value={offerForm.applicationId} onChange={(event) => setOfferForm((prev) => ({ ...prev, applicationId: event.target.value }))} />
          <input className="fo-input" placeholder="Compensation (e.g. 85,000 USD)" value={offerForm.compensation} onChange={(event) => setOfferForm((prev) => ({ ...prev, compensation: event.target.value }))} />
          <input className="fo-input" placeholder="Proposed start date" value={offerForm.proposedStartDate} onChange={(event) => setOfferForm((prev) => ({ ...prev, proposedStartDate: event.target.value }))} />
          <input className="fo-input" placeholder="Offer letter URL (optional)" value={offerForm.offerLetterUrl} onChange={(event) => setOfferForm((prev) => ({ ...prev, offerLetterUrl: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Offer notes" value={offerForm.notes} onChange={(event) => setOfferForm((prev) => ({ ...prev, notes: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Create / Send Offer</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Applicant Offer/Hiring Actions</h3>
        {(atsApplicants || []).length === 0 ? <p className="fo-muted">No applicants available for offer actions.</p> : null}
        {(atsApplicants || []).map((applicant) => (
          <article key={applicant.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              #{applicant.id} {applicant.candidateName} • Stage: {applicant.stage || 'Applied'}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>{applicant.candidateEmail} • {applicant.jobTitle}</p>
            <div className="fo-cta-row">
              <button type="button" className="fo-btn-outline" onClick={() => handleMarkSelected(applicant.id)}>Mark Selected</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleMarkHired(applicant.id)}>Mark Hired</button>
            </div>
          </article>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Offer Status Tracking</h3>
        {(offers || []).length === 0 ? <p className="fo-muted">No offers created yet.</p> : null}
        {(offers || []).map((offer) => (
          <article key={offer.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              Offer #{offer.id} • {offer.candidateName} • Status: {offer.status}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>
              Application #{offer.applicationId} • Compensation: {offer.compensation || 'N/A'} • Start: {offer.proposedStartDate || 'N/A'}
            </p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>Offer letter: {offer.offerLetterUrl || 'Not attached'}</p>
            <div className="fo-grid cols-2" style={{ gap: '8px' }}>
              <input className="fo-input" placeholder="Offer letter URL" value={offerLetterDrafts[offer.id] || ''} onChange={(event) => setOfferLetterDrafts((prev) => ({ ...prev, [offer.id]: event.target.value }))} />
              <button type="button" className="fo-btn-outline" onClick={() => handleAttachOfferLetter(offer.id)}>Attach Offer Letter</button>
            </div>
            <div className="fo-cta-row" style={{ marginTop: '8px' }}>
              <button type="button" className="fo-btn-outline" onClick={() => handleOfferStatus(offer.id, 'Sent')}>Set Sent</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleOfferStatus(offer.id, 'Accepted')}>Set Accepted</button>
              <button type="button" className="fo-btn-outline" onClick={() => handleOfferStatus(offer.id, 'Declined')}>Set Declined</button>
              <button type="button" className="fo-btn-outline" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleOfferStatus(offer.id, 'Withdrawn')}>Withdraw Offer</button>
            </div>
            <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '8px' }}>
              <input
                className="fo-input"
                placeholder="Counter-offer compensation"
                value={(negotiateDrafts[offer.id] && negotiateDrafts[offer.id].counterCompensation) || ''}
                onChange={(event) => setNegotiateDrafts((prev) => ({ ...prev, [offer.id]: { ...(prev[offer.id] || {}), counterCompensation: event.target.value } }))}
              />
              <input
                className="fo-input"
                placeholder="Negotiation notes"
                value={(negotiateDrafts[offer.id] && negotiateDrafts[offer.id].counterNotes) || ''}
                onChange={(event) => setNegotiateDrafts((prev) => ({ ...prev, [offer.id]: { ...(prev[offer.id] || {}), counterNotes: event.target.value } }))}
              />
              <button type="button" className="fo-btn-outline" style={{ gridColumn: '1 / -1' }} onClick={() => handleNegotiateOffer(offer.id)}>Negotiate Salary (Send Counter-Offer)</button>
            </div>
          </article>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Close Job Posting</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleCloseJobPosting}>
          <input className="fo-input" placeholder="Job ID" value={closeJobForm.jobId} onChange={(event) => setCloseJobForm((prev) => ({ ...prev, jobId: event.target.value }))} />
          <input className="fo-input" placeholder="Close reason" value={closeJobForm.reason} onChange={(event) => setCloseJobForm((prev) => ({ ...prev, reason: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Close Job Posting</button>
        </form>
      </section>
    </div>
  );

  const renderAnalyticsReporting = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Analytics & Reporting Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>
          Monitor job performance, hiring metrics, recruiter activity, and hiring manager feedback.
        </p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Hiring Funnel</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Stage-by-stage drop-off across all applicants.</p>
        {atsApplicants.length === 0 ? <p className="fo-muted">No applicant data available.</p> : (
          <div className="fo-grid" style={{ gap: '8px', marginTop: '8px' }}>
            {['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map((stage) => {
              const count = atsApplicants.filter((a) => a.stage === stage).length;
              const pct = atsApplicants.length > 0 ? Math.round((count / atsApplicants.length) * 100) : 0;
              return (
                <div key={stage} className="fo-list-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ minWidth: '130px', fontWeight: 600 }}>{stage}</span>
                  <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '4px', height: '18px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, background: stage === 'Hired' ? '#16a34a' : stage === 'Rejected' ? '#dc2626' : '#3b82f6', height: '100%', transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.9em' }}>{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Job Performance</h3>
        {(jobPerformanceReport || []).length === 0 ? <p className="fo-muted">No job performance data yet.</p> : null}
        {(jobPerformanceReport || []).map((job) => (
          <div key={job.jobId} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{job.jobTitle}</p>
            <p className="fo-muted" style={{ margin: '4px 0' }}>
              Views: {job.views} • Applications: {job.applicationsCount} • Conversion: {job.conversionRate}%
            </p>
          </div>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Hiring Metrics</h3>
        <div className="fo-grid cols-2" style={{ gap: '10px' }}>
          <div className="fo-list-item"><strong>Time-to-hire (avg days):</strong> {hiringMetrics.averageTimeToHire}</div>
          <div className="fo-list-item"><strong>Cost-per-hire (avg):</strong> {hiringMetrics.averageCostPerHire}</div>
        </div>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Source of candidates</p>
        {(hiringMetrics.sourceOfCandidates || []).length === 0 ? <p className="fo-muted">No source data yet.</p> : null}
        {(hiringMetrics.sourceOfCandidates || []).map((source) => (
          <div key={source.source} className="fo-list-item" style={{ marginBottom: '8px' }}>
            {source.source}: {source.count}
          </div>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Team Performance</h3>
        <p className="fo-muted">Recruiter activity stats</p>
        {(teamPerformance.recruiterActivityStats || []).length === 0 ? <p className="fo-muted">No recruiter activity recorded.</p> : null}
        {(teamPerformance.recruiterActivityStats || []).map((stat) => (
          <div key={`${stat.recruiterId}-${stat.action}`} className="fo-list-item" style={{ marginBottom: '8px' }}>
            Recruiter #{stat.recruiterId} • {stat.action}: {stat.count}
          </div>
        ))}

        <p className="fo-muted" style={{ marginTop: '10px' }}>Hiring manager feedback</p>
        {(teamPerformance.hiringManagerFeedback || []).length === 0 ? <p className="fo-muted">No hiring manager feedback yet.</p> : null}
        {(teamPerformance.hiringManagerFeedback || []).map((item) => (
          <div key={item.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <strong>{item.hiringManagerName}</strong> on {item.recruiterName || `Recruiter #${item.recruiterId}`} • Score: {item.score}
            <p className="fo-muted" style={{ margin: '4px 0 0' }}>{item.feedback}</p>
          </div>
        ))}

        <form className="fo-grid cols-2" style={{ gap: '10px', marginTop: '10px' }} onSubmit={handleSaveManagerFeedback}>
          <input className="fo-input" placeholder="Hiring manager name" value={managerFeedbackForm.hiringManagerName} onChange={(event) => setManagerFeedbackForm((prev) => ({ ...prev, hiringManagerName: event.target.value }))} />
          <input className="fo-input" placeholder="Recruiter ID" value={managerFeedbackForm.recruiterId} onChange={(event) => setManagerFeedbackForm((prev) => ({ ...prev, recruiterId: event.target.value }))} />
          <input className="fo-input" placeholder="Recruiter name" value={managerFeedbackForm.recruiterName} onChange={(event) => setManagerFeedbackForm((prev) => ({ ...prev, recruiterName: event.target.value }))} />
          <input className="fo-input" placeholder="Score (1-5)" value={managerFeedbackForm.score} onChange={(event) => setManagerFeedbackForm((prev) => ({ ...prev, score: event.target.value }))} />
          <textarea className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Feedback" value={managerFeedbackForm.feedback} onChange={(event) => setManagerFeedbackForm((prev) => ({ ...prev, feedback: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Submit Hiring Manager Feedback</button>
        </form>
      </section>
    </div>
  );

  const renderSubscriptionBilling = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Subscription & Billing Actions</h3>
        {subscription ? (
          <div className="fo-grid cols-2" style={{ gap: '10px', marginTop: '8px' }}>
            <div className="fo-list-item"><strong>Plan:</strong> {subscription.planName}</div>
            <div className="fo-list-item"><strong>Billing Cycle:</strong> {subscription.billingCycle}</div>
            <div className="fo-list-item"><strong>Status:</strong> {subscription.status}</div>
            <div className="fo-list-item"><strong>Job Credits:</strong> {subscription.jobCredits || 0}</div>
          </div>
        ) : <p className="fo-muted" style={{ marginTop: '8px' }}>No subscription data available.</p>}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Change Plan</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleUpdateSubscriptionPlan}>
          <select className="fo-select" value={planForm.planName} onChange={(event) => setPlanForm((prev) => ({ ...prev, planName: event.target.value }))}>
            <option value="Starter">Starter</option>
            <option value="Standard">Standard</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select className="fo-select" value={planForm.billingCycle} onChange={(event) => setPlanForm((prev) => ({ ...prev, billingCycle: event.target.value }))}>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Update Subscription Plan</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Purchase Job Credits</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handlePurchaseCredits}>
          <input className="fo-input" placeholder="Credits" value={creditsForm.credits} onChange={(event) => setCreditsForm((prev) => ({ ...prev, credits: event.target.value }))} />
          <input className="fo-input" placeholder="Unit price" value={creditsForm.unitPrice} onChange={(event) => setCreditsForm((prev) => ({ ...prev, unitPrice: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Buy Job Credits</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Pay for Featured Listings</h3>
        <form className="fo-grid cols-3" style={{ gap: '10px' }} onSubmit={handlePayFeaturedListing}>
          <input className="fo-input" placeholder="Job ID" value={featuredListingForm.jobId} onChange={(event) => setFeaturedListingForm((prev) => ({ ...prev, jobId: event.target.value }))} />
          <input className="fo-input" placeholder="Quantity" value={featuredListingForm.quantity} onChange={(event) => setFeaturedListingForm((prev) => ({ ...prev, quantity: event.target.value }))} />
          <input className="fo-input" placeholder="Unit price" value={featuredListingForm.unitPrice} onChange={(event) => setFeaturedListingForm((prev) => ({ ...prev, unitPrice: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Pay Featured Listing</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Payment Methods</h3>
        <form className="fo-grid cols-3" style={{ gap: '10px', marginBottom: '10px' }} onSubmit={handleAddPaymentMethod}>
          <select className="fo-select" value={paymentMethodForm.methodType} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, methodType: event.target.value }))}>
            <option value="Card">Card</option>
            <option value="Bank">Bank</option>
          </select>
          <input className="fo-input" placeholder="Provider" value={paymentMethodForm.provider} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, provider: event.target.value }))} />
          <input className="fo-input" placeholder="Last 4" value={paymentMethodForm.last4} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, last4: event.target.value }))} />
          <input className="fo-input" placeholder="Card holder" value={paymentMethodForm.cardHolder} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, cardHolder: event.target.value }))} />
          <input className="fo-input" placeholder="Expiry month" value={paymentMethodForm.expiryMonth} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, expiryMonth: event.target.value }))} />
          <input className="fo-input" placeholder="Expiry year" value={paymentMethodForm.expiryYear} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, expiryYear: event.target.value }))} />
          <input className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Billing email" value={paymentMethodForm.billingEmail} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, billingEmail: event.target.value }))} />
          <label className="fo-list-item" style={{ gridColumn: '1 / -1' }}>
            <input type="checkbox" checked={paymentMethodForm.isDefault} onChange={(event) => setPaymentMethodForm((prev) => ({ ...prev, isDefault: event.target.checked }))} /> Default method
          </label>
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Save Payment Method</button>
        </form>
        {(paymentMethods || []).length === 0 ? <p className="fo-muted">No payment methods added yet.</p> : null}
        {(paymentMethods || []).map((method) => (
          <div key={method.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <strong>{method.methodType}</strong> • {method.provider} • ****{method.last4}
            <button type="button" className="fo-btn-outline" style={{ marginLeft: '10px' }} onClick={() => handleRemovePaymentMethod(method.id)}>Remove</button>
          </div>
        ))}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Invoices</h3>
        {(invoices || []).length === 0 ? <p className="fo-muted">No invoices available yet.</p> : null}
        {(invoices || []).map((invoice) => (
          <div key={invoice.id} className="fo-list-item" style={{ marginBottom: '8px' }}>
            <strong>{invoice.invoiceNumber}</strong> • {invoice.status} • Total: {invoice.totalAmount}
            <button type="button" className="fo-btn-outline" style={{ marginLeft: '10px' }} onClick={() => handleDownloadInvoice(invoice.id)}>Download</button>
          </div>
        ))}
      </section>
    </div>
  );

  const renderNotifications = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Notification Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Manage alert types, channels, and mark notification items as read.</p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Alert Preferences</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleSaveNotificationSettings}>
          <label className="fo-list-item">
            <input
              type="checkbox"
              checked={notificationSettings.alerts.newApplicants}
              onChange={(event) => setNotificationSettings((prev) => ({
                ...prev,
                alerts: { ...prev.alerts, newApplicants: event.target.checked },
              }))}
            /> New applicants
          </label>
          <label className="fo-list-item">
            <input
              type="checkbox"
              checked={notificationSettings.alerts.messages}
              onChange={(event) => setNotificationSettings((prev) => ({
                ...prev,
                alerts: { ...prev.alerts, messages: event.target.checked },
              }))}
            /> Candidate messages
          </label>
          <label className="fo-list-item" style={{ gridColumn: '1 / -1' }}>
            <input
              type="checkbox"
              checked={notificationSettings.alerts.interviewConfirmations}
              onChange={(event) => setNotificationSettings((prev) => ({
                ...prev,
                alerts: { ...prev.alerts, interviewConfirmations: event.target.checked },
              }))}
            /> Interview confirmations
          </label>
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Save Alert Preferences</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Notification Channels</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleToggleNotificationChannels}>
          <label className="fo-list-item">
            <input type="checkbox" checked={notificationSettings.emailEnabled} onChange={(event) => setNotificationSettings((prev) => ({ ...prev, emailEnabled: event.target.checked }))} /> Email
          </label>
          <label className="fo-list-item">
            <input type="checkbox" checked={notificationSettings.pushEnabled} onChange={(event) => setNotificationSettings((prev) => ({ ...prev, pushEnabled: event.target.checked }))} /> Push
          </label>
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Save Channel Settings</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Notification Center</h3>
        {(notifications || []).length === 0 ? <p className="fo-muted">No notifications yet.</p> : null}
        {(notifications || []).map((item) => (
          <div key={item.id} className="fo-list-item" style={{ marginBottom: '8px', opacity: item.read ? 0.65 : 1 }}>
            <strong>{item.type}</strong>
            <p className="fo-muted" style={{ margin: '4px 0' }}>{item.message}</p>
            <div className="fo-cta-row">
              <span className="fo-muted">{item.createdAt}</span>
              {!item.read ? <button type="button" className="fo-btn-outline" onClick={() => handleMarkNotificationRead(item.id)}>Mark as Read</button> : null}
            </div>
          </div>
        ))}
      </section>
    </div>
  );

  const renderAIActions = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>AI-Powered Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Generate descriptions, candidate recommendations, match score, rankings and outreach content.</p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>AI Inputs</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleAIGenerateJobDescription}>
          <input className="fo-input" placeholder="Job title" value={aiJobForm.jobTitle} onChange={(event) => setAiJobForm((prev) => ({ ...prev, jobTitle: event.target.value }))} />
          <input className="fo-input" placeholder="Seniority" value={aiJobForm.seniority} onChange={(event) => setAiJobForm((prev) => ({ ...prev, seniority: event.target.value }))} />
          <input className="fo-input" placeholder="Location" value={aiJobForm.location} onChange={(event) => setAiJobForm((prev) => ({ ...prev, location: event.target.value }))} />
          <input className="fo-input" placeholder="Min experience (years)" value={aiJobForm.minExperience} onChange={(event) => setAiJobForm((prev) => ({ ...prev, minExperience: event.target.value }))} />
          <input className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Required skills (comma separated)" value={aiCandidateForm.requiredSkills} onChange={(event) => setAiCandidateForm((prev) => ({ ...prev, requiredSkills: event.target.value }))} />
          <input className="fo-input" placeholder="Candidate ID" value={aiCandidateForm.candidateId} onChange={(event) => setAiCandidateForm((prev) => ({ ...prev, candidateId: event.target.value }))} />
          <input className="fo-input" placeholder="Candidate location" value={aiCandidateForm.location} onChange={(event) => setAiCandidateForm((prev) => ({ ...prev, location: event.target.value }))} />
          <button type="submit" className="fo-btn" style={{ gridColumn: '1 / -1' }}>Generate Job Description</button>
        </form>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleAIRecommendCandidates}>Recommend Candidates</button>
          <button type="button" className="fo-btn-outline" onClick={handleAICandidateMatchScore}>Candidate Match Score</button>
          <button type="button" className="fo-btn-outline" onClick={handleAIAutoRank}>Auto Rank Applicants</button>
          <button type="button" className="fo-btn-outline" onClick={handleAIInterviewQuestions}>Generate Interview Questions</button>
          <button type="button" className="fo-btn-outline" onClick={handleAIOutreachMessage}>Generate Outreach Message</button>
          <button type="button" className="fo-btn-outline" onClick={handleAIPredictSuccess}>Predict Candidate Success</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>AI Results</h3>
        {aiGeneratedDescription ? <p>{aiGeneratedDescription}</p> : <p className="fo-muted">No generated description yet.</p>}
        {aiMatchScore ? <p><strong>Match Score:</strong> {aiMatchScore.score} ({aiMatchScore.label})</p> : null}
        {aiSuccessPrediction ? <p><strong>Success Prediction:</strong> {aiSuccessPrediction.label} ({aiSuccessPrediction.probability}%)</p> : null}
        {aiInterviewQuestions.length ? <ul>{aiInterviewQuestions.map((q) => <li key={q}>{q}</li>)}</ul> : null}
        {aiOutreachMessage && aiOutreachMessage.body ? (
          <div className="fo-list-item" style={{ marginTop: '8px' }}>
            <strong>{aiOutreachMessage.subject}</strong>
            <p style={{ margin: '6px 0 0' }}>{aiOutreachMessage.body}</p>
          </div>
        ) : null}
        {aiRecommendedCandidates.length ? (
          <div style={{ marginTop: '10px' }}>
            <strong>Recommended Candidates</strong>
            {aiRecommendedCandidates.map((candidate) => (
              <div key={candidate.candidateId} className="fo-list-item" style={{ marginTop: '6px' }}>
                #{candidate.candidateId} {candidate.name || 'Candidate'} - Score: {candidate.fitScore}
              </div>
            ))}
          </div>
        ) : null}
        {aiRankedApplicants.length ? (
          <div style={{ marginTop: '10px' }}>
            <strong>Ranked Applicants</strong>
            {aiRankedApplicants.map((applicant) => (
              <div key={applicant.applicationId} className="fo-list-item" style={{ marginTop: '6px' }}>
                Application #{applicant.applicationId} - Score: {applicant.fitScore}
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );

  const renderCrmActions = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Talent Pool & CRM Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Create pools, update CRM tags, view candidate history and re-engage inactive candidates.</p>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Create Talent Pool</h3>
        <form className="fo-grid cols-2" style={{ gap: '10px' }} onSubmit={handleCreatePool}>
          <input className="fo-input" placeholder="Pool name" value={crmPoolForm.name} onChange={(event) => setCrmPoolForm({ name: event.target.value })} />
          <button type="submit" className="fo-btn">Create Pool</button>
        </form>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Candidate CRM Operations</h3>
        <div className="fo-grid cols-3" style={{ gap: '10px' }}>
          <input className="fo-input" placeholder="Candidate ID" value={crmActionForm.candidateId} onChange={(event) => setCrmActionForm((prev) => ({ ...prev, candidateId: event.target.value }))} />
          <input className="fo-input" placeholder="Pool name" value={crmActionForm.poolName} onChange={(event) => setCrmActionForm((prev) => ({ ...prev, poolName: event.target.value }))} />
          <input className="fo-input" placeholder="Tags (comma separated)" value={crmActionForm.tags} onChange={(event) => setCrmActionForm((prev) => ({ ...prev, tags: event.target.value }))} />
        </div>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleRemoveFromPool}>Remove From Pool</button>
          <button type="button" className="fo-btn-outline" onClick={handleTagCandidateCRM}>Save CRM Tags</button>
          <button type="button" className="fo-btn-outline" onClick={handleViewCandidateHistory}>View Candidate History</button>
          <button type="button" className="fo-btn-outline" onClick={handleReengageCandidate}>Re-engage Candidate</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Candidate History</h3>
        {!crmHistory ? <p className="fo-muted">No candidate history loaded.</p> : (
          <div className="fo-grid cols-2" style={{ gap: '10px' }}>
            <div className="fo-list-item"><strong>Applications:</strong> {crmHistory.totalApplications}</div>
            <div className="fo-list-item"><strong>Latest stage:</strong> {crmHistory.latestStage || 'N/A'}</div>
            <div className="fo-list-item"><strong>Last contacted:</strong> {crmHistory.lastContactedAt || 'N/A'}</div>
            <div className="fo-list-item"><strong>Re-engagement count:</strong> {crmHistory.reengagementCount || 0}</div>
          </div>
        )}
      </section>
    </div>
  );

  const renderSettings = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Settings &amp; Control Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Configure pipeline, application form, team permissions, email templates, and integrations.</p>
        {settingsActionMsg && <div className="fo-alert fo-alert--info" style={{ marginTop: '8px' }}>{settingsActionMsg}</div>}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Hiring Pipeline Stages</h4>
        <div className="fo-grid cols-1" style={{ gap: '8px', marginTop: '10px' }}>
          <input className="fo-input" placeholder="Stages (comma separated)" value={pipelineStagesInput} onChange={(e) => setPipelineStagesInput(e.target.value)} />
          <div className="fo-cta-row" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="fo-btn-outline" onClick={handleLoadPipelineSettings}>Load Pipeline Config</button>
            <button type="button" className="fo-btn" onClick={handleSavePipelineStages}>Save Pipeline Stages</button>
          </div>
        </div>
        {pipelineConfig && (
          <div style={{ marginTop: '10px' }}>
            <strong>Current stages:</strong> {(pipelineConfig.stages || []).join(' → ')}
          </div>
        )}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Application Form</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadAppForm}>Load Application Form Config</button>
        </div>
        {appFormConfig && (
          <div style={{ marginTop: '10px' }}>
            {(appFormConfig.fields || []).map((field) => (
              <div key={field.name} className="fo-list-item">
                <strong>{field.label}</strong> — {field.type} {field.required ? '(required)' : '(optional)'}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Team Permissions</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadTeamPermissions}>Load Team Permissions</button>
        </div>
        {teamPermissions.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {teamPermissions.map((member) => (
              <div key={member.memberId} className="fo-list-item">
                <strong>{member.name}</strong> — Role: {member.role} | View: {String(member.permissions.canViewApplications)} | Post: {String(member.permissions.canPostJobs)} | Msg: {String(member.permissions.canSendMessages)}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Default Email Templates</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadEmailTemplates}>Load Email Templates</button>
        </div>
        {emailTemplates.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {emailTemplates.map((tpl) => (
              <div key={tpl.id} className="fo-list-item">
                <strong>{tpl.name}</strong>: {tpl.subject}
              </div>
            ))}
          </div>
        )}
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '14px' }}>
          <input className="fo-input" placeholder="Template ID (e.g. rejection)" value={emailTemplateForm.id} onChange={(e) => setEmailTemplateForm(prev => ({ ...prev, id: e.target.value }))} />
          <input className="fo-input" placeholder="Template name" value={emailTemplateForm.name} onChange={(e) => setEmailTemplateForm(prev => ({ ...prev, name: e.target.value }))} />
          <input className="fo-input" placeholder="Subject" value={emailTemplateForm.subject} onChange={(e) => setEmailTemplateForm(prev => ({ ...prev, subject: e.target.value }))} />
          <input className="fo-input" placeholder="Body" value={emailTemplateForm.body} onChange={(e) => setEmailTemplateForm(prev => ({ ...prev, body: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleSaveEmailTemplate}>Save Email Template</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Integrations (ATS / HR Tools)</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadIntegrations}>Load Integrations</button>
        </div>
        {integrationsList.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {integrationsList.map((intg) => (
              <div key={intg.id} className="fo-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>{intg.name}</strong> ({intg.type})</span>
                <button type="button" className="fo-btn-outline" style={{ fontSize: '11px', padding: '2px 8px' }} onClick={() => handleRemoveIntegration(intg.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '14px' }}>
          <input className="fo-input" placeholder="Integration name (e.g. Greenhouse)" value={integrationForm.name} onChange={(e) => setIntegrationForm(prev => ({ ...prev, name: e.target.value }))} />
          <input className="fo-input" placeholder="Type (ATS, HRIS, etc.)" value={integrationForm.type} onChange={(e) => setIntegrationForm(prev => ({ ...prev, type: e.target.value }))} />
          <input className="fo-input" placeholder="API Key" value={integrationForm.apiKey} onChange={(e) => setIntegrationForm(prev => ({ ...prev, apiKey: e.target.value }))} />
          <input className="fo-input" placeholder="Webhook URL" value={integrationForm.webhookUrl} onChange={(e) => setIntegrationForm(prev => ({ ...prev, webhookUrl: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleSaveIntegration}>Save Integration</button>
        </div>
      </section>
    </div>
  );

  const renderAutomation = () => (
    <div className="fo-member-admin__main">
      <section className="fo-card" style={{ padding: '16px' }}>
        <h3>Automation Actions</h3>
        <p className="fo-muted" style={{ marginTop: '8px' }}>Auto-move/reject candidates, schedule emails, trigger reminders, and create hiring workflows.</p>
        {automationActionMsg && <div className="fo-alert fo-alert--info" style={{ marginTop: '8px' }}>{automationActionMsg}</div>}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Automation Rules</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadAutomationRules}>Load All Rules</button>
        </div>
        {automationRules.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {automationRules.map((rule) => (
              <div key={rule.id} className="fo-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>{rule.type}</strong> — created {rule.createdAt ? rule.createdAt.slice(0, 10) : ''}</span>
                <button type="button" className="fo-btn-outline" style={{ fontSize: '11px', padding: '2px 8px' }} onClick={() => handleDeleteAutomationRule(rule.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Auto-Move Candidates</h4>
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '10px' }}>
          <input className="fo-input" placeholder="Target stage (e.g. Interview)" value={autoMoveForm.targetStage} onChange={(e) => setAutoMoveForm(prev => ({ ...prev, targetStage: e.target.value }))} />
          <input className="fo-input" placeholder="Criteria (key:val,key:val)" value={autoMoveForm.criteria} onChange={(e) => setAutoMoveForm(prev => ({ ...prev, criteria: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleCreateAutoMoveRule}>Create Auto-Move Rule</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Auto-Reject Based on Screening</h4>
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '10px' }}>
          <input className="fo-input" placeholder="Screening conditions (comma separated)" value={autoRejectForm.screeningConditions} onChange={(e) => setAutoRejectForm(prev => ({ ...prev, screeningConditions: e.target.value }))} />
          <input className="fo-input" placeholder="Rejection message" value={autoRejectForm.rejectMessage} onChange={(e) => setAutoRejectForm(prev => ({ ...prev, rejectMessage: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleCreateAutoRejectRule}>Create Auto-Reject Rule</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Schedule Follow-up Email</h4>
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '10px' }}>
          <input className="fo-input" placeholder="Candidate ID" value={followUpForm.candidateId} onChange={(e) => setFollowUpForm(prev => ({ ...prev, candidateId: e.target.value }))} />
          <input className="fo-input" placeholder="Job ID" value={followUpForm.jobId} onChange={(e) => setFollowUpForm(prev => ({ ...prev, jobId: e.target.value }))} />
          <input className="fo-input" placeholder="Email subject" value={followUpForm.subject} onChange={(e) => setFollowUpForm(prev => ({ ...prev, subject: e.target.value }))} />
          <input className="fo-input" placeholder="Send at (ISO date)" value={followUpForm.sendAt} onChange={(e) => setFollowUpForm(prev => ({ ...prev, sendAt: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleScheduleFollowUp}>Schedule Follow-up</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Trigger Reminders for Inactive Candidates</h4>
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '10px' }}>
          <input className="fo-input" placeholder="Inactive days threshold" value={String(reminderForm.inactiveDaysThreshold)} onChange={(e) => setReminderForm(prev => ({ ...prev, inactiveDaysThreshold: Number(e.target.value) || 7 }))} />
          <input className="fo-input" placeholder="Stage filter (optional)" value={reminderForm.stage || ''} onChange={(e) => setReminderForm(prev => ({ ...prev, stage: e.target.value }))} />
          <input className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Reminder message" value={reminderForm.message} onChange={(e) => setReminderForm(prev => ({ ...prev, message: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleTriggerReminder}>Trigger Reminder</button>
        </div>
      </section>

      <section className="fo-card" style={{ padding: '16px' }}>
        <h4>Hiring Workflows</h4>
        <div className="fo-cta-row" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="fo-btn-outline" onClick={handleLoadWorkflows}>Load Workflows</button>
        </div>
        {hiringWorkflows.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {hiringWorkflows.map((wf) => (
              <div key={wf.id} className="fo-list-item">
                <strong>{wf.name}</strong> — Steps: {(wf.steps || []).join(' → ')}
              </div>
            ))}
          </div>
        )}
        <div className="fo-grid cols-2" style={{ gap: '8px', marginTop: '14px' }}>
          <input className="fo-input" placeholder="Workflow name" value={workflowForm.name} onChange={(e) => setWorkflowForm(prev => ({ ...prev, name: e.target.value }))} />
          <input className="fo-input" placeholder="Description" value={workflowForm.description} onChange={(e) => setWorkflowForm(prev => ({ ...prev, description: e.target.value }))} />
          <input className="fo-input" style={{ gridColumn: '1 / -1' }} placeholder="Steps (comma separated)" value={workflowForm.steps} onChange={(e) => setWorkflowForm(prev => ({ ...prev, steps: e.target.value }))} />
          <button type="button" className="fo-btn" style={{ gridColumn: '1 / -1' }} onClick={handleCreateWorkflow}>Create Hiring Workflow</button>
        </div>
      </section>
    </div>
  );

  const renderActiveSection = () => {
    if (activeSection === 'overview') return renderOverview();
    if (activeSection === 'account') return renderAccountWorkspace();
    if (activeSection === 'team') return renderTeamManagement();
    if (activeSection === 'company') return renderCompanyProfile();
    if (activeSection === 'media') return renderBrandingVisibility();
    if (activeSection === 'jobs') return renderJobManagement();
    if (activeSection === 'ats') return renderAts();
    if (activeSection === 'sourcing') return renderSourcing();
    if (activeSection === 'communication') return renderCommunication();
    if (activeSection === 'interviews') return renderInterviewManagement();
    if (activeSection === 'evaluation') return renderCandidateEvaluation();
    if (activeSection === 'offers') return renderOfferHiring();
    if (activeSection === 'analytics') return renderAnalyticsReporting();
    if (activeSection === 'billing') return renderSubscriptionBilling();
    if (activeSection === 'notifications') return renderNotifications();
    if (activeSection === 'ai') return renderAIActions();
    if (activeSection === 'crm') return renderCrmActions();
    if (activeSection === 'settings') return renderSettings();
    if (activeSection === 'automation') return renderAutomation();
    return renderReviews();
  };

  if (isLoading) {
    return (
      <FrontOfficeLayout>
        <section className="fo-section-wrap fo-section-wrap--contained">
          <div className="fo-card" style={{ padding: '18px' }}>Loading recruiter workspace...</div>
        </section>
      </FrontOfficeLayout>
    );
  }

  return (
    <FrontOfficeLayout>
      <section className="fo-section-wrap" style={{ paddingLeft: 0, paddingRight: 0, marginTop: 0, marginBottom: 0 }}>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
          <aside style={{ width: '240px', minWidth: '240px', background: '#10203a', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
            <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', letterSpacing: '0.04em' }}>UPRECRUIT</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recruiter Portal</div>
            </div>
            <div style={{ flex: 1, padding: '16px 0' }}>
              <div style={{ padding: '0 14px 8px', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Dashboard
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                {RECRUITER_MENU.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 20px',
                      color: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.65)',
                      background: activeSection === item.id ? 'rgba(35,88,216,0.35)' : 'transparent',
                      border: 'none',
                      borderRadius: 0,
                      fontSize: '13px',
                      fontWeight: activeSection === item.id ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <i className={`fa ${item.icon}`} aria-hidden="true" style={{ width: '16px', textAlign: 'center', opacity: 0.75 }}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <div className="fo-member-admin__main" style={{ maxWidth: '1180px', margin: '0 auto' }}>
              {actionMessage ? (
                <div className="fo-card" style={{ padding: '12px', marginBottom: '12px' }}>{actionMessage}</div>
              ) : null}
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </section>
    </FrontOfficeLayout>
  );
};

export default FrontOfficeRecruiterHubNative;
