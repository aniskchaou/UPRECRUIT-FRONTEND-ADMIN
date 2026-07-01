import '../../../modules/shared/DashBoard/DashBoard.css';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import applyHTTPService from '../../../main/services/applyHTTPService';
import candidateHTTPService from '../../../main/services/candidateHTTPService';
import interviewHTTPService from '../../../main/services/interviewHTTPService';
import jobHTTPService from '../../../main/services/jobHTTPService';
import memberMessageHTTPService from '../../../main/services/memberMessageHTTPService';
import memberNotificationHTTPService from '../../../main/services/memberNotificationHTTPService';
import memberPreferenceHTTPService from '../../../main/services/memberPreferenceHTTPService';
import memberProfileHTTPService from '../../../main/services/memberProfileHTTPService';
import memberSavedSearchHTTPService from '../../../main/services/memberSavedSearchHTTPService';
import userHTTPService from '../../../main/services/userHTTPService';
import CurrentUser from '../../../main/config/user';
import FrontOfficeLayout from '../shared/FrontOfficeLayout';
import useSeo from '../shared/useSeo';
import { jsPDF } from 'jspdf';
import {
  SALARY_GUIDES,
  getSalaryLabel,
  mapApiJob,
} from '../shared/frontOfficeData';

const initialProfile = {
  fullName: 'Anis Candidate',
  headline: 'Frontend Engineer | React | UX-minded',
  location: 'Tunis',
  education: 'Master in Software Engineering',
  experienceYears: 4,
  skills: ['React', 'TypeScript', 'Design Systems', 'Testing'],
};

const PREFERENCES_KEY = 'frontoffice_member_preferences';


const interviewResources = [
  'Behavioral interview answer framework (STAR).',
  'Role-specific technical drills and common pitfalls.',
  'Question bank for recruiter and hiring manager rounds.',
];

const applicationStatuses = ['Applied', 'Interview', 'Shortlisted', 'Rejected', 'Offer'];

const memberDashboardNav = [
  { id: 'member-profile', label: 'Profile & Identity' },
  { id: 'member-discovery', label: 'Smart Job Discovery' },
  { id: 'member-applications', label: 'Application System' },
  { id: 'member-communication', label: 'Communication' },
  { id: 'member-interviews', label: 'Interview & Scheduling' },
  { id: 'member-tools', label: 'Career Tools' },
  { id: 'member-settings', label: 'Account Settings' },
];

const statusClass = (status) => `fo-status fo-status--${status.toLowerCase()}`;

const normalizeAppStatus = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('shortlist')) return 'Shortlisted';
  if (normalized.includes('interview')) return 'Interview';
  if (normalized.includes('offer') || normalized.includes('signed') || normalized.includes('proposal')) return 'Offer';
  if (normalized.includes('reject') || normalized.includes('refus')) return 'Rejected';
  return 'Applied';
};

const mapApplyRecord = (item) => ({
  id: item.id ? String(item.id) : `local-${Date.now()}`,
  candidateId: item.condidateId || item.candidateId || null,
  candidateName: item.condidate || item.candidate || 'Candidate',
  candidateEmail: item.candidateEmail || '',
  jobOfferId: item.jobOfferId || null,
  role: item.jobOffer || 'Applied Role',
  company: item.company || 'Partner Company',
  status: normalizeAppStatus(item.status),
  updatedAt: item.dateApplication || 'N/A',
});

const getJobVisibilityStatus = (job) => {
  const value = String(job && job.active ? job.active : '').toLowerCase();
  if (value === 'draft') return 'Draft';
  if (value === 'false' || value === '0' || value === 'unpublished') return 'Unpublished';
  return 'Published';
};

const mapInterviewRecord = (item) => ({
  id: `i-${item.id}`,
  company: item.employees || 'Hiring Team',
  role: item.candidates || 'Candidate Interview',
  date: item.scheduleDate || 'TBD',
  slots: item.scheduleTime ? [item.scheduleTime] : ['09:00', '11:00', '15:00'],
});

const mapCandidateProfile = (item) => {
  if (!item) {
    return initialProfile;
  }

  const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ').trim() || initialProfile.fullName;
  const parsedSkills = (item.skills || '')
    .split(/[;,]/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  return {
    fullName,
    headline: item.jobRole || item.categoryJob || initialProfile.headline,
    location: item.city || item.country || initialProfile.location,
    education: item.education || item.details || initialProfile.education,
    experienceYears: Number(item.experience) || initialProfile.experienceYears,
    skills: parsedSkills.length ? parsedSkills : initialProfile.skills,
  };
};

const mapPreferenceFlags = (rawPreference) => ({
  hideProfile: rawPreference.hideProfile === 'true',
  anonymizeProfile: rawPreference.anonymizeProfile === 'true',
  emailAlerts: rawPreference.emailAlerts !== 'false',
  pushAlerts: rawPreference.pushAlerts !== 'false',
  recruiterMessages: rawPreference.recruiterMessages !== 'false',
  twoFactorEnabled: rawPreference.twoFactorEnabled === 'true',
  bookmarkedJobs: (rawPreference.bookmarkedJobs || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
});

const getCurrentUserId = () => {
  if (CurrentUser.USER_DETAIL && CurrentUser.USER_DETAIL.id) {
    return CurrentUser.USER_DETAIL.id;
  }

  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed.id : null;
  } catch (error) {
    return null;
  }
};

const PORTAL_NAV = [
  { to: '/frontoffice/home', label: 'Home', icon: 'fa-home' },
  { to: '/frontoffice/job-board', label: 'Job Board', icon: 'fa-th-large' },
  { to: '/frontoffice/jobs', label: 'Browse Jobs', icon: 'fa-briefcase' },
  { to: '/frontoffice/companies', label: 'Companies', icon: 'fa-building' },
  { to: '/frontoffice/member', label: 'My Dashboard', icon: 'fa-tachometer' },
];

const SECTION_NAV = [
  { id: 'member-account-onboarding', label: 'Account & Onboarding', icon: 'fa-id-card' },
  { id: 'member-profile-management', label: 'Profile Management', icon: 'fa-address-card' },
  { id: 'member-profile', label: 'Profile & Resumes', icon: 'fa-user' },
  { id: 'member-discovery', label: 'Job Discovery', icon: 'fa-search' },
  { id: 'member-applications', label: 'Applications', icon: 'fa-file-alt' },
  { id: 'member-communication', label: 'Messages', icon: 'fa-envelope' },
  { id: 'member-recruiter-overview', label: 'Recruiter Dashboard', icon: 'fa-area-chart' },
  { id: 'member-job-posting', label: 'Job Posting', icon: 'fa-bullhorn' },
  { id: 'member-candidate-interaction', label: 'Candidate Interaction', icon: 'fa-users' },
  { id: 'member-talent-search', label: 'Talent Search', icon: 'fa-search-plus' },
  { id: 'member-interviews', label: 'Interviews', icon: 'fa-calendar' },
  { id: 'member-tools', label: 'Career Tools', icon: 'fa-chart-line' },
  { id: 'member-career-dev', label: 'Career Development', icon: 'fa-graduation-cap' },
  { id: 'member-account-privacy', label: 'Account & Privacy', icon: 'fa-user-secret' },
  { id: 'member-engagement', label: 'Engagement', icon: 'fa-bell' },
  { id: 'member-power-user', label: 'Power User', icon: 'fa-bolt' },
  { id: 'member-settings', label: 'Settings', icon: 'fa-cog' },
];

const FrontOfficeMemberHubNative = () => {
  const history = useHistory();
  const [profile, setProfile] = useState(initialProfile);
  const [resumes, setResumes] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([{ id: 1, from: 'john.recruiter@company.com', subject: 'Interview Invitation', body: 'We would like to invite you for an interview...', timestamp: new Date(Date.now() - 86400000), read: false, type: 'invitation' }, { id: 2, from: 'jane.hr@tech.com', subject: 'Follow-up', body: 'Hi, are you interested in this opportunity?', timestamp: new Date(Date.now() - 172800000), read: true, type: 'message' }]);
  const [backendNotifications, setBackendNotifications] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [privacy, setPrivacy] = useState({ hideProfile: false, anonymizeProfile: false });
  const [notifications, setNotifications] = useState({ emailAlerts: true, pushAlerts: true, recruiterMessages: true });
  const [security, setSecurity] = useState({ twoFactorEnabled: false });
  const [jobs, setJobs] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [candidateDirectory, setCandidateDirectory] = useState([]);
  const [jobPostForm, setJobPostForm] = useState({
    post: '',
    location: '',
    jobType: 'Remote',
    experienceLevel: 'Mid',
    description: '',
    requirement: '',
    salaryFrom: '',
    salaryTo: '',
  });
  const [editingJobId, setEditingJobId] = useState('');
  const [talentFilters, setTalentFilters] = useState({ q: '', location: '', skill: '', plan: 'free' });
  const [talentResults, setTalentResults] = useState([]);
  const [talentSummary, setTalentSummary] = useState({ totalMatches: 0, shown: 0, limit: 5 });
  const [isTalentLoading, setIsTalentLoading] = useState(false);
  const [accountOnboarding, setAccountOnboarding] = useState({
    emailVerified: false,
    phoneVerified: false,
    wizardStep: 1,
    onboardingCompleted: false,
    preferredRoles: [''],
    preferredLocation: '',
    preferredSalary: '',
    preferredJobTypes: ['Remote'],
  });
  const [profileManager, setProfileManager] = useState({
    workExperiences: [''],
    educations: [''],
    skills: [''],
    certifications: [''],
    languages: [''],
    portfolioLinks: [''],
    profilePictureUrl: '',
    videoIntroUrl: '',
    profileVisibility: 'public',
    resumeBuilderContent: '',
  });
  const [resetFlow, setResetFlow] = useState({ username: '', code: '', newPassword: '', latestCode: '' });
  const [socialRegisterEmail, setSocialRegisterEmail] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [jobSearchFilters, setJobSearchFilters] = useState({ keyword: '', location: '', salaryMin: '', salaryMax: '', experience: '', industry: '', jobType: '', sortBy: 'recent', postedDate: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [reportedJobs, setReportedJobs] = useState([]);
  const [showJobDetails, setShowJobDetails] = useState(null);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageAttachments, setMessageAttachments] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [interviews, setInterviews] = useState([{ id: 1, companyName: 'Tech Corp', position: 'React Developer', recruiterName: 'John Recruiter', recruiterEmail: 'john@techcorp.com', scheduledDate: '2026-05-15', scheduledTime: '10:00 AM', type: 'Video Call', status: 'Confirmed', notes: 'Prepare to discuss React hooks', availableSlots: ['2026-05-15 10:00 AM', '2026-05-15 2:00 PM', '2026-05-16 9:00 AM'] }, { id: 2, companyName: 'StartUp Inc', position: 'Full Stack Developer', recruiterName: 'Jane HR', recruiterEmail: 'jane@startup.com', scheduledDate: '2026-05-20', scheduledTime: '3:00 PM', type: 'Phone Interview', status: 'Pending', notes: '', availableSlots: ['2026-05-19 11:00 AM', '2026-05-20 3:00 PM', '2026-05-21 2:00 PM'] }]);
  const [showInterviewPanel, setShowInterviewPanel] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [interviewNotes, setInterviewNotes] = useState({});
  const [syncedCalendars, setSyncedCalendars] = useState(['Google']);
  const [notificationsList, setNotificationsList] = useState([{ id: 1, type: 'new_job', title: 'New Senior React Developer job posted', description: 'React Developer at Tech Corp', timestamp: new Date(Date.now() - 3600000), read: false }, { id: 2, type: 'application', title: 'Application Status Update', description: 'Your application to Frontend Engineer was moved to Interview stage', timestamp: new Date(Date.now() - 7200000), read: false }, { id: 3, type: 'message', title: 'New message from recruiter', description: 'John from Tech Corp sent you a message', timestamp: new Date(Date.now() - 86400000), read: true }, { id: 4, type: 'new_job', title: '2 new jobs matching your profile', description: 'Full Stack Developer, React Native Developer', timestamp: new Date(Date.now() - 172800000), read: true }, { id: 5, type: 'profile_view', title: 'Your profile was viewed', description: 'A recruiter from Innovate Solutions viewed your profile', timestamp: new Date(Date.now() - 43200000), read: false }]);
  const [notificationChannels, setNotificationChannels] = useState({ email: true, push: true, sms: false });
  const [aiRecommendations, setAiRecommendations] = useState([{ id: 1, title: 'Senior React Developer', company: 'Tech Corp', matchScore: 95, reason: 'Your profile matches 95% of requirements' }, { id: 2, title: 'Full Stack Engineer', company: 'StartUp Inc', matchScore: 88, reason: 'Strong match based on your skills' }]);
  const [cvUploadProgress, setCvUploadProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([{ id: 1, category: 'Skills', suggestion: 'Add "Docker" - appears in 45% of job postings for your field', priority: 'high' }, { id: 2, category: 'Format', suggestion: 'Move "Technical Skills" section higher - recruiters scan for it first', priority: 'medium' }, { id: 3, category: 'Content', suggestion: 'Quantify achievements: "Reduced load time by 40%" instead of "optimized performance"', priority: 'high' }]);
  const [matchScores, setMatchScores] = useState({});
  const [suggestedSkills, setSuggestedSkills] = useState(['Docker', 'Kubernetes', 'GraphQL', 'TypeScript', 'AWS']);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [mockInterviewActive, setMockInterviewActive] = useState(false);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([{ id: 1, question: 'Tell me about a challenging project you\'ve worked on and how you overcame obstacles', category: 'Behavioral' }, { id: 2, question: 'Explain the difference between props and state in React', category: 'Technical' }, { id: 3, question: 'How do you handle performance optimization in large applications?', category: 'Technical' }]);
  const [currentMockQuestionIndex, setCurrentMockQuestionIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState({});
  const [showAIPremiumFeatures, setShowAIPremiumFeatures] = useState(true);

  // --- Feature 11: Career Development ---
  const [salaryBenchmarks] = useState([
    { role: 'Frontend Developer', location: 'Tunis', min: 1200, max: 2800, avg: 2000, currency: 'TND' },
    { role: 'React Developer', location: 'Paris', min: 45000, max: 75000, avg: 60000, currency: 'EUR' },
    { role: 'Full Stack Engineer', location: 'Berlin', min: 50000, max: 85000, avg: 67000, currency: 'EUR' },
    { role: 'UX Engineer', location: 'Remote', min: 48000, max: 72000, avg: 58000, currency: 'EUR' },
  ]);
  const [roleComparisons] = useState([
    { role: 'Frontend Developer', location: 'Tunis', avgSalary: '2,000 TND', demand: 'High', growth: '+12%' },
    { role: 'React Developer', location: 'Paris', avgSalary: '60,000 EUR', demand: 'Very High', growth: '+18%' },
    { role: 'Full Stack Engineer', location: 'Berlin', avgSalary: '67,000 EUR', demand: 'Very High', growth: '+21%' },
    { role: 'UX Engineer', location: 'Remote', avgSalary: '58,000 EUR', demand: 'Medium', growth: '+9%' },
  ]);
  const [learningRecommendations] = useState([
    { id: 1, title: 'Advanced TypeScript Patterns', provider: 'Udemy', level: 'Advanced', duration: '12h', relevance: 95 },
    { id: 2, title: 'System Design Fundamentals', provider: 'Coursera', level: 'Intermediate', duration: '20h', relevance: 88 },
    { id: 3, title: 'Docker & Kubernetes Essentials', provider: 'Pluralsight', level: 'Beginner', duration: '8h', relevance: 82 },
    { id: 4, title: 'GraphQL API Design', provider: 'Frontend Masters', level: 'Intermediate', duration: '6h', relevance: 79 },
  ]);
  const [skillProgress, setSkillProgress] = useState([
    { skill: 'React', level: 85, trend: '+5%', lastUpdated: '2026-04-01' },
    { skill: 'TypeScript', level: 70, trend: '+12%', lastUpdated: '2026-03-15' },
    { skill: 'Docker', level: 30, trend: 'new', lastUpdated: '2026-04-20' },
    { skill: 'GraphQL', level: 55, trend: '+8%', lastUpdated: '2026-03-28' },
  ]);
  const [skillEndorsements, setSkillEndorsements] = useState({});
  const handleEndorseSkill = (skill) => {
    setSkillEndorsements((prev) => ({ ...prev, [skill]: (prev[skill] || 0) + 1 }));
    setActionMessage(`You endorsed ${skill}!`);
  };
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentQuestions] = useState([
    { id: 1, question: 'What hook is used to manage side effects in React?', options: ['useState', 'useEffect', 'useCallback', 'useMemo'], correct: 1 },
    { id: 2, question: 'Which TypeScript utility makes all properties optional?', options: ['Required<T>', 'Readonly<T>', 'Partial<T>', 'Pick<T,K>'], correct: 2 },
    { id: 3, question: 'What does "npm ci" do differently from "npm install"?', options: ['Installs globally', 'Uses package-lock.json exactly', 'Skips devDependencies', 'Clears npm cache'], correct: 1 },
  ]);

  // --- Feature 12: Account & Privacy ---
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [blockedCompanies, setBlockedCompanies] = useState(['Spam Corp', 'Fake Recruiters Ltd']);
  const [gdprDownloadReady, setGdprDownloadReady] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');

  // --- Feature 13: Engagement & Retention ---
  const [missedJobs] = useState([
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'Paris', deadline: '2026-04-28', salary: '65K EUR' },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Remote', deadline: '2026-04-25', salary: '70K EUR' },
    { id: 3, title: 'DevOps Engineer', company: 'CloudBase', location: 'Lyon', deadline: '2026-04-20', salary: '60K EUR' },
  ]);
  const [incompleteApplications, setIncompleteApplications] = useState([
    { id: 1, title: 'UX Designer', company: 'DesignHub', progress: 60, lastSaved: '2026-04-29' },
    { id: 2, title: 'Product Manager', company: 'ProductCo', progress: 30, lastSaved: '2026-04-27' },
  ]);
  const [applyReminders, setApplyReminders] = useState([
    { id: 1, title: 'Frontend Developer', company: 'WebAgency', dueDate: '2026-05-05', enabled: true },
    { id: 2, title: 'Node.js Backend Dev', company: 'APIWorks', dueDate: '2026-05-10', enabled: false },
  ]);
  const [profileViews] = useState([
    { company: 'Acme Recruiting', role: 'HR Manager', date: '2026-04-30', anonymous: false },
    { company: 'TalentBridge', role: 'Talent Acquisition', date: '2026-04-29', anonymous: false },
    { company: 'Anonymous', role: 'Unknown', date: '2026-04-28', anonymous: true },
    { company: 'NovaSoft', role: 'CTO', date: '2026-04-27', anonymous: false },
  ]);

  // --- Feature 14: Power User Actions ---
  const [jobAlerts, setJobAlerts] = useState([
    { id: 1, keyword: 'React Developer', location: 'Paris', frequency: 'Daily', active: true },
    { id: 2, keyword: 'DevOps Engineer', location: 'Remote', frequency: 'Weekly', active: true },
  ]);
  const [newAlertForm, setNewAlertForm] = useState({ keyword: '', location: '', frequency: 'Daily' });
  const [booleanQuery, setBooleanQuery] = useState('');
  const [booleanResults, setBooleanResults] = useState([]);
  const [taggedJobs, setTaggedJobs] = useState([
    { id: 1, title: 'Staff Engineer', company: 'BigTech', tag: 'Top Pick', saved: '2026-04-20' },
    { id: 2, title: 'Engineering Manager', company: 'ScaleUp', tag: 'Research', saved: '2026-04-22' },
    { id: 3, title: 'Principal Developer', company: 'EnterpriseCo', tag: 'Backup', saved: '2026-04-25' },
  ]);
  const [appSuccessStats] = useState({ applied: 24, responded: 9, interviewed: 4, offered: 1, successRate: 38 });
  const [exportHistoryReady, setExportHistoryReady] = useState(false);
  const [jobTagFilter, setJobTagFilter] = useState('All');

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    const connected = localStorage.getItem('connected') === 'true';
    const role = localStorage.getItem('frontofficeRole') || 'jobseeker';

    if (!connected) {
      history.replace('/frontoffice/login?redirect=/frontoffice/member');
      return;
    }

    if (role === 'recruiter') {
      history.replace('/frontoffice/recruiter');
    }
  }, [history]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFERENCES_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setPrivacy((prev) => ({ ...prev, ...(parsed.privacy || {}) }));
        setNotifications((prev) => ({ ...prev, ...(parsed.notifications || {}) }));
        setSecurity((prev) => ({ ...prev, ...(parsed.security || {}) }));
        if (Array.isArray(parsed.bookmarkedJobs)) {
          setBookmarkedJobs(parsed.bookmarkedJobs);
        }
      }
    } catch (error) {
      // Ignore malformed local preferences.
    }
  }, []);

  useEffect(() => {
    const preferences = {
      privacy,
      notifications,
      security,
      bookmarkedJobs,
    };

    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));

    if (currentUserId) {
      memberPreferenceHTTPService
        .upsert(currentUserId, {
          hideProfile: String(privacy.hideProfile),
          anonymizeProfile: String(privacy.anonymizeProfile),
          emailAlerts: String(notifications.emailAlerts),
          pushAlerts: String(notifications.pushAlerts),
          recruiterMessages: String(notifications.recruiterMessages),
          twoFactorEnabled: String(security.twoFactorEnabled),
          bookmarkedJobs: bookmarkedJobs.join(','),
        })
        .catch(() => {
          // Keep local fallback if backend is unavailable.
        });
    }
  }, [privacy, notifications, security, bookmarkedJobs, currentUserId]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      jobHTTPService.getAllJob().catch(() => null),
      applyHTTPService.getAllApply().catch(() => null),
      interviewHTTPService.getAllInterview().catch(() => null),
      candidateHTTPService.getAllCandidate().catch(() => null),
      currentUserId ? memberSavedSearchHTTPService.getByUser(currentUserId).catch(() => null) : Promise.resolve(null),
      currentUserId ? memberMessageHTTPService.getByUser(currentUserId).catch(() => null) : Promise.resolve(null),
      currentUserId ? memberNotificationHTTPService.getByUser(currentUserId).catch(() => null) : Promise.resolve(null),
      currentUserId ? memberPreferenceHTTPService.getByUser(currentUserId).catch(() => null) : Promise.resolve(null),
    ]).then(([jobsRes, applicationsRes, interviewsRes, candidatesRes]) => {
      if (!mounted) {
        return;
      }

      let connected = false;

      if (jobsRes && Array.isArray(jobsRes.data) && jobsRes.data.length) {
        setJobs(jobsRes.data.map((job, index) => mapApiJob(job, index)));
        setRecruiterJobs(jobsRes.data);
        connected = true;
      }

      if (applicationsRes && Array.isArray(applicationsRes.data) && applicationsRes.data.length) {
        setApplications(applicationsRes.data.map(mapApplyRecord));
        connected = true;
      }

      if (interviewsRes && Array.isArray(interviewsRes.data) && interviewsRes.data.length) {
        const mappedInvites = interviewsRes.data.map(mapInterviewRecord);
        setInvites(mappedInvites);
        setMessages(
          mappedInvites.map((invite, index) => ({
            id: `m-back-${invite.id}`,
            recruiter: `${invite.company} Recruiting`,
            preview: `Interview update for ${invite.role} on ${invite.date}.`,
            unread: index < 2,
          }))
        );
        connected = true;
      }

      if (candidatesRes && Array.isArray(candidatesRes.data) && candidatesRes.data.length) {
        setCandidateDirectory(candidatesRes.data);
        const matchedCandidate = currentUserId
          ? candidatesRes.data.find((candidate) => String(candidate.id) === String(currentUserId))
          : candidatesRes.data[0];
        setProfile(mapCandidateProfile(matchedCandidate || candidatesRes.data[0]));
        connected = true;
      }

      setBackendConnected(connected);
    });

    return () => {
      mounted = false;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    Promise.all([
      memberSavedSearchHTTPService.getByUser(currentUserId).catch(() => null),
      memberMessageHTTPService.getByUser(currentUserId).catch(() => null),
      memberNotificationHTTPService.getByUser(currentUserId).catch(() => null),
      memberPreferenceHTTPService.getByUser(currentUserId).catch(() => null),
    ]).then(([savedSearchesRes, messagesRes, notificationsRes, preferencesRes]) => {
      if (savedSearchesRes && Array.isArray(savedSearchesRes.data) && savedSearchesRes.data.length) {
        setSavedSearches(savedSearchesRes.data.map((item) => ({
          id: item.id,
          label: item.label,
          keyword: item.keyword,
          location: item.location,
        })));
      }

      if (messagesRes && Array.isArray(messagesRes.data) && messagesRes.data.length) {
        setMessages(messagesRes.data.map((item) => ({
          id: item.id,
          recruiter: item.recruiter,
          preview: item.preview,
          unread: String(item.unread) === 'true',
        })));
      }

      if (notificationsRes && Array.isArray(notificationsRes.data) && notificationsRes.data.length) {
        setBackendNotifications(notificationsRes.data);
      }

      if (preferencesRes && preferencesRes.data && Object.keys(preferencesRes.data).length) {
        const mapped = mapPreferenceFlags(preferencesRes.data);
        setPrivacy({ hideProfile: mapped.hideProfile, anonymizeProfile: mapped.anonymizeProfile });
        setNotifications({
          emailAlerts: mapped.emailAlerts,
          pushAlerts: mapped.pushAlerts,
          recruiterMessages: mapped.recruiterMessages,
        });
        setSecurity({ twoFactorEnabled: mapped.twoFactorEnabled });
        if (mapped.bookmarkedJobs.length) {
          setBookmarkedJobs(mapped.bookmarkedJobs);
        }
      }
    });
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    memberProfileHTTPService
      .getByUser(currentUserId)
      .then((res) => {
        const data = res && res.data ? res.data : null;
        if (!data) {
          return;
        }

        setAccountOnboarding({
          emailVerified: !!data.emailVerified,
          phoneVerified: !!data.phoneVerified,
          wizardStep: Number(data.wizardStep || 1),
          onboardingCompleted: !!data.onboardingCompleted,
          preferredRoles: Array.isArray(data.preferredRoles) && data.preferredRoles.length ? data.preferredRoles : [''],
          preferredLocation: data.preferredLocation || '',
          preferredSalary: data.preferredSalary || '',
          preferredJobTypes: Array.isArray(data.preferredJobTypes) && data.preferredJobTypes.length ? data.preferredJobTypes : ['Remote'],
        });

        setProfileManager({
          workExperiences: Array.isArray(data.workExperiences) && data.workExperiences.length ? data.workExperiences : [''],
          educations: Array.isArray(data.educations) && data.educations.length ? data.educations : [''],
          skills: Array.isArray(data.profileSkills) && data.profileSkills.length ? data.profileSkills : [''],
          certifications: Array.isArray(data.certifications) && data.certifications.length ? data.certifications : [''],
          languages: Array.isArray(data.profileLanguages) && data.profileLanguages.length ? data.profileLanguages : [''],
          portfolioLinks: Array.isArray(data.portfolioLinks) && data.portfolioLinks.length ? data.portfolioLinks : [''],
          profilePictureUrl: data.profilePictureUrl || '',
          videoIntroUrl: data.videoIntroUrl || '',
          profileVisibility: data.profileVisibility || 'public',
          resumeBuilderContent: data.resumeBuilderContent || '',
        });

        if (Array.isArray(data.resumeVersions)) {
          setResumes(data.resumeVersions.map((item) => ({
            id: item.id,
            name: item.name,
            parsedScore: Number(item.parsedScore || 78),
            lastUpdated: item.updatedAt || new Date().toISOString().slice(0, 10),
            isPrimary: !!item.isPrimary,
            summary: item.summary || '',
          })));
        }
      })
      .catch(() => {
        // Keep local state if profile API is unavailable.
      });
  }, [currentUserId]);

  useEffect(() => {
    if (!candidateDirectory.length) {
      return;
    }

    handleTalentSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateDirectory.length]);

  const jobsForYou = useMemo(
    () => jobs.filter((job) => profile.skills.some((skill) => (job.skills || []).includes(skill))).slice(0, 5),
    [jobs, profile.skills]
  );

  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(profile.fullName),
      Boolean(profile.headline),
      Boolean(profile.location),
      Boolean(profile.education),
      profile.experienceYears > 0,
      profile.skills.length >= 3,
      resumes.length > 0,
    ];

    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return score;
  }, [profile, resumes.length]);

  const resumeScore = useMemo(() => {
    if (!resumes.length) {
      return 0;
    }

    const total = resumes.reduce((acc, resume) => acc + resume.parsedScore, 0);
    return Math.round(total / resumes.length);
  }, [resumes]);

  const missingSkills = useMemo(() => {
    const demandSkills = Array.from(new Set(jobs.flatMap((job) => job.skills || []))).slice(0, 8);
    return demandSkills.filter((skill) => !profile.skills.includes(skill)).slice(0, 4);
  }, [jobs, profile.skills]);

  const salaryInsight = useMemo(() => {
    const role = SALARY_GUIDES[0];
    return `${role.role}: ${role.range}`;
  }, []);

  const unreadNotifications = useMemo(() => {
    if (backendNotifications.length) {
      return backendNotifications.filter((item) => String(item.readStatus) !== 'true').length;
    }

    return messages.filter((message) => message.unread).length;
  }, [messages, backendNotifications]);

  const applicationsByStatus = useMemo(
    () => applicationStatuses.map((status) => ({ status, count: applications.filter((item) => item.status === status).length })),
    [applications]
  );

  const notificationItems = useMemo(() => {
    if (backendNotifications.length) {
      return backendNotifications.map((item) => ({
        id: item.id,
        title: item.title || item.type || 'Notification',
        message: item.message || '',
        unread: String(item.readStatus) !== 'true',
      }));
    }

    return messages.map((message) => ({
      id: message.id,
      title: message.recruiter,
      message: message.preview,
      unread: !!message.unread,
    }));
  }, [backendNotifications, messages]);

  const recruiterOverview = useMemo(() => {
    const activeJobs = recruiterJobs.filter((job) => getJobVisibilityStatus(job) === 'Published').length;
    const draftJobs = recruiterJobs.filter((job) => getJobVisibilityStatus(job) === 'Draft').length;
    const totalCandidates = candidateDirectory.length;
    const shortlisted = applications.filter((item) => item.status === 'Shortlisted').length;

    return {
      activeJobs,
      draftJobs,
      totalCandidates,
      shortlisted,
    };
  }, [applications, candidateDirectory.length, recruiterJobs]);

  const recentApplicants = useMemo(
    () => applications.slice(0, 6),
    [applications]
  );

  const visibleApplicants = useMemo(
    () => applications.slice(0, 8),
    [applications]
  );

  const upsertMappedJobFeed = (rawJob) => {
    const mappedJob = mapApiJob(rawJob, 0);
    setJobs((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id) === String(mappedJob.id));
      if (existingIndex === -1) {
        return [mappedJob, ...prev];
      }

      const next = [...prev];
      next[existingIndex] = { ...next[existingIndex], ...mappedJob };
      return next;
    });
  };

  const handleSaveJobPost = (publicationState) => {
    const normalizedPost = jobPostForm.post.trim();
    const normalizedLocation = jobPostForm.location.trim();

    if (!normalizedPost || !normalizedLocation) {
      setActionMessage('Job title and location are required.');
      return;
    }

    const payload = {
      post: normalizedPost,
      position: normalizedPost,
      location: normalizedLocation,
      jobType: jobPostForm.jobType || 'Remote',
      experienceLevel: jobPostForm.experienceLevel || 'Mid',
      description: jobPostForm.description || 'Role details will be updated soon.',
      requirement: jobPostForm.requirement || 'Collaboration, ownership, and communication.',
      salaryFrom: jobPostForm.salaryFrom || '0',
      salaryTo: jobPostForm.salaryTo || '0',
      active: publicationState,
      start: new Date().toISOString().slice(0, 10),
      end: '',
      hideSalary: 'false',
      gender: 'Any',
      feature: publicationState === 'published' ? 'Featured' : 'Standard',
      degree: 'Bachelor',
      deadline: '',
    };

    const commitLocal = (savedJob) => {
      setRecruiterJobs((prev) => {
        const existingIndex = prev.findIndex((item) => String(item.id) === String(savedJob.id));
        if (existingIndex === -1) {
          return [savedJob, ...prev];
        }

        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], ...savedJob };
        return next;
      });
      upsertMappedJobFeed(savedJob);
      setJobPostForm({
        post: '',
        location: '',
        jobType: 'Remote',
        experienceLevel: 'Mid',
        description: '',
        requirement: '',
        salaryFrom: '',
        salaryTo: '',
      });
      setEditingJobId('');
    };

    if (editingJobId) {
      jobHTTPService
        .editJob(editingJobId, payload)
        .then(() => {
          const savedJob = { ...payload, id: editingJobId };
          commitLocal(savedJob);
          setActionMessage(`Job updated as ${publicationState}.`);
        })
        .catch(() => {
          const savedJob = { ...payload, id: editingJobId };
          commitLocal(savedJob);
          setActionMessage('Backend unavailable. Job updated locally.');
        });
      return;
    }

    jobHTTPService
      .createJob(payload)
      .then((res) => {
        const savedJob = res && res.data ? res.data : { ...payload, id: `local-${Date.now()}` };
        commitLocal(savedJob);
        setActionMessage(`Job created as ${publicationState}.`);
      })
      .catch(() => {
        const savedJob = { ...payload, id: `local-${Date.now()}` };
        commitLocal(savedJob);
        setActionMessage('Backend unavailable. Job saved locally.');
      });
  };

  const handleEditJobPost = (job) => {
    setEditingJobId(String(job.id));
    setJobPostForm({
      post: job.post || job.position || '',
      location: job.location || '',
      jobType: job.jobType || 'Remote',
      experienceLevel: job.experienceLevel || 'Mid',
      description: job.description || '',
      requirement: job.requirement || '',
      salaryFrom: job.salaryFrom || '',
      salaryTo: job.salaryTo || '',
    });
  };

  const handleChangePublication = (job, publicationState) => {
    const payload = {
      ...job,
      post: job.post || job.position,
      position: job.position || job.post,
      active: publicationState,
    };

    jobHTTPService
      .editJob(job.id, payload)
      .then(() => {
        setRecruiterJobs((prev) => prev.map((item) => (
          String(item.id) === String(job.id)
            ? { ...item, active: publicationState }
            : item
        )));
        setActionMessage(`Job moved to ${publicationState}.`);
      })
      .catch(() => {
        setRecruiterJobs((prev) => prev.map((item) => (
          String(item.id) === String(job.id)
            ? { ...item, active: publicationState }
            : item
        )));
        setActionMessage('Backend unavailable. Job status changed locally.');
      });
  };

  const handleUpdateApplicationStatus = (applicationItem, nextStatus) => {
    if (!applicationItem.id || String(applicationItem.id).startsWith('local-')) {
      setApplications((prev) => prev.map((item) => (
        String(item.id) === String(applicationItem.id)
          ? { ...item, status: nextStatus }
          : item
      )));
      setActionMessage(`Application moved to ${nextStatus}.`);
      return;
    }

    applyHTTPService
      .editApply(applicationItem.id, { status: nextStatus })
      .then(() => {
        setApplications((prev) => prev.map((item) => (
          String(item.id) === String(applicationItem.id)
            ? { ...item, status: nextStatus }
            : item
        )));
        setActionMessage(`Application moved to ${nextStatus}.`);
      })
      .catch(() => {
        setApplications((prev) => prev.map((item) => (
          String(item.id) === String(applicationItem.id)
            ? { ...item, status: nextStatus }
            : item
        )));
        setActionMessage('Backend unavailable. Updated locally.');
      });
  };

  const handleMessageCandidate = (applicationItem) => {
    const message = window.prompt(`Message ${applicationItem.candidateName || 'candidate'}`, `Hi ${applicationItem.candidateName || ''}, thanks for applying.`);
    if (message === null) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setActionMessage('Message cannot be empty.');
      return;
    }

    const payload = {
      userId: applicationItem.candidateId || currentUserId || 1,
      recruiter: 'Jobseeker Hiring Desk',
      preview: trimmedMessage,
      unread: 'true',
    };

    memberMessageHTTPService
      .create(payload)
      .then((res) => {
        setMessages((prev) => ([
          {
            id: (res && res.data && res.data.id) || `m-local-${Date.now()}`,
            recruiter: payload.recruiter,
            preview: payload.preview,
            unread: true,
          },
          ...prev,
        ]));
        setActionMessage('Message sent to candidate.');
      })
      .catch(() => {
        setMessages((prev) => ([
          {
            id: `m-local-${Date.now()}`,
            recruiter: payload.recruiter,
            preview: payload.preview,
            unread: true,
          },
          ...prev,
        ]));
        setActionMessage('Backend unavailable. Message stored locally.');
      });
  };

  const handleTalentSearch = () => {
    setIsTalentLoading(true);

    candidateHTTPService
      .searchTalent(talentFilters)
      .then((res) => {
        const data = (res && res.data) || {};
        setTalentResults(Array.isArray(data.items) ? data.items : []);
        setTalentSummary({
          totalMatches: data.totalMatches || 0,
          shown: data.shown || 0,
          limit: data.limit || (talentFilters.plan === 'pro' ? 25 : 5),
        });
        setActionMessage(`Talent search completed (${data.shown || 0} shown).`);
      })
      .catch(() => {
        const query = String(talentFilters.q || '').toLowerCase();
        const location = String(talentFilters.location || '').toLowerCase();
        const skill = String(talentFilters.skill || '').toLowerCase();
        const limit = talentFilters.plan === 'pro' ? 25 : 5;

        const localResults = candidateDirectory
          .filter((item) => {
            const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ').toLowerCase();
            const role = String(item.jobRole || '').toLowerCase();
            const itemLocation = `${item.city || ''} ${item.country || ''}`.toLowerCase();
            const itemSkills = String(item.skills || '').toLowerCase();

            const queryMatch = !query || fullName.includes(query) || role.includes(query) || itemSkills.includes(query);
            const locationMatch = !location || itemLocation.includes(location);
            const skillMatch = !skill || itemSkills.includes(skill);
            return queryMatch && locationMatch && skillMatch;
          })
          .slice(0, limit)
          .map((item) => ({
            id: item.id,
            fullName: [item.firstName, item.lastName].filter(Boolean).join(' ').trim(),
            jobRole: item.jobRole || '',
            location: [item.city, item.country].filter(Boolean).join(', '),
            careerLevel: item.careerLevel || '',
            skills: String(item.skills || '').split(/[;,]/).map((s) => s.trim()).filter(Boolean),
            summary: item.summary || '',
            profileLocked: talentFilters.plan !== 'pro',
            email: talentFilters.plan === 'pro' ? item.email : '',
            phone: talentFilters.plan === 'pro' ? item.phone : '',
          }));

        setTalentResults(localResults);
        setTalentSummary({ totalMatches: localResults.length, shown: localResults.length, limit });
        setActionMessage('Backend unavailable. Showing local talent results.');
      })
      .finally(() => {
        setIsTalentLoading(false);
      });
  };

  const handleDeleteSavedSearch = (searchId) => {
    const isLocalRecord = String(searchId).startsWith('local-');

    if (currentUserId && !isLocalRecord) {
      memberSavedSearchHTTPService
        .remove(searchId)
        .then(() => {
          setSavedSearches((prev) => prev.filter((item) => String(item.id) !== String(searchId)));
          setActionMessage('Saved search deleted.');
        })
        .catch(() => {
          setSavedSearches((prev) => prev.filter((item) => String(item.id) !== String(searchId)));
          setActionMessage('Saved search backend unavailable; removed locally.');
        });
      return;
    }

    setSavedSearches((prev) => prev.filter((item) => String(item.id) !== String(searchId)));
    setActionMessage('Saved search removed locally.');
  };

  const persistMemberProfile = (overrides = {}) => {
    if (!currentUserId) {
      return Promise.resolve();
    }

    const payload = {
      emailVerified: String(overrides.emailVerified ?? accountOnboarding.emailVerified),
      phoneVerified: String(overrides.phoneVerified ?? accountOnboarding.phoneVerified),
      onboardingCompleted: String(overrides.onboardingCompleted ?? accountOnboarding.onboardingCompleted),
      wizardStep: String(overrides.wizardStep ?? accountOnboarding.wizardStep),
      preferredRoles: JSON.stringify((overrides.preferredRoles ?? accountOnboarding.preferredRoles).filter(Boolean)),
      preferredLocation: overrides.preferredLocation ?? accountOnboarding.preferredLocation,
      preferredSalary: overrides.preferredSalary ?? accountOnboarding.preferredSalary,
      preferredJobTypes: JSON.stringify(overrides.preferredJobTypes ?? accountOnboarding.preferredJobTypes),
      workExperiences: JSON.stringify((overrides.workExperiences ?? profileManager.workExperiences).filter(Boolean)),
      educations: JSON.stringify((overrides.educations ?? profileManager.educations).filter(Boolean)),
      profileSkills: JSON.stringify((overrides.skills ?? profileManager.skills).filter(Boolean)),
      certifications: JSON.stringify((overrides.certifications ?? profileManager.certifications).filter(Boolean)),
      profileLanguages: JSON.stringify((overrides.languages ?? profileManager.languages).filter(Boolean)),
      portfolioLinks: JSON.stringify((overrides.portfolioLinks ?? profileManager.portfolioLinks).filter(Boolean)),
      profilePictureUrl: overrides.profilePictureUrl ?? profileManager.profilePictureUrl,
      videoIntroUrl: overrides.videoIntroUrl ?? profileManager.videoIntroUrl,
      profileVisibility: overrides.profileVisibility ?? profileManager.profileVisibility,
      resumeBuilderContent: overrides.resumeBuilderContent ?? profileManager.resumeBuilderContent,
      resumeVersions: JSON.stringify((overrides.resumeVersions ?? resumes).map((resume) => ({
        id: resume.id,
        name: resume.name,
        parsedScore: resume.parsedScore,
        updatedAt: resume.lastUpdated,
        isPrimary: !!resume.isPrimary,
        summary: resume.summary || '',
      }))),
    };

    return memberProfileHTTPService.upsert(currentUserId, payload);
  };

  const handleSaveAccountOnboarding = () => {
    persistMemberProfile()
      .then(() => setActionMessage('Account and onboarding settings saved.'))
      .catch(() => setActionMessage('Backend unavailable. Onboarding settings saved locally.'));
  };

  const handleSaveProfileManagement = () => {
    persistMemberProfile()
      .then(() => setActionMessage('Profile management data saved.'))
      .catch(() => setActionMessage('Backend unavailable. Profile data saved locally.'));
  };

  const handleSocialRegister = (provider) => {
    const email = (socialRegisterEmail || '').trim();
    if (!email) {
      setActionMessage('Enter an email to continue with social registration.');
      return;
    }

    userHTTPService
      .socialLogin({ provider: provider, email: email })
      .then((res) => {
        const payload = res && res.data ? res.data : null;
        if (payload) {
          CurrentUser.USER_DETAIL = payload;
          localStorage.setItem('currentUser', JSON.stringify(payload));
          localStorage.setItem('connected', 'true');
          setActionMessage(`Registered/logged in with ${provider}.`);
        }
      })
      .catch(() => setActionMessage(`${provider} registration is unavailable right now.`));
  };

  const handleRequestResetCode = () => {
    const username = (resetFlow.username || '').trim();
    if (!username) {
      setActionMessage('Enter account email/username for password reset.');
      return;
    }

    userHTTPService
      .requestReset({ username: username })
      .then((res) => {
        const code = res && res.data ? res.data.code : '';
        setResetFlow((prev) => ({ ...prev, latestCode: code || '' }));
        setActionMessage(code ? `Reset code generated: ${code}` : 'Reset code requested.');
      })
      .catch(() => setActionMessage('Failed to request reset code.'));
  };

  const handleResetPassword = () => {
    userHTTPService
      .resetPassword({
        username: resetFlow.username,
        code: resetFlow.code,
        newPassword: resetFlow.newPassword,
      })
      .then(() => setActionMessage('Password reset successful.'))
      .catch(() => setActionMessage('Password reset failed. Check code and try again.'));
  };

  const handleAddResumeVersion = () => {
    const newResumeName = window.prompt('Resume name', `Resume Version ${resumes.length + 1}`);
    if (newResumeName === null) {
      return;
    }

    const newResumeSummary = window.prompt('Resume summary', 'Generated from resume builder');
    if (newResumeSummary === null) {
      return;
    }

    if (!currentUserId) {
      const localResume = {
        id: `resume-local-${Date.now()}`,
        name: newResumeName,
        parsedScore: 80,
        lastUpdated: new Date().toISOString().slice(0, 10),
        isPrimary: resumes.length === 0,
        summary: newResumeSummary,
      };
      setResumes((prev) => [localResume, ...prev]);
      setActionMessage('Resume added locally.');
      return;
    }

    memberProfileHTTPService
      .addResume(currentUserId, { name: newResumeName, summary: newResumeSummary })
      .then((res) => {
        const added = res && res.data && res.data.resume ? res.data.resume : null;
        if (added) {
          setResumes((prev) => ([{
            id: added.id,
            name: added.name,
            parsedScore: 80,
            lastUpdated: added.updatedAt,
            isPrimary: prev.length === 0,
            summary: added.summary || '',
          }, ...prev]));
        }
        setActionMessage('Resume version added.');
      })
      .catch(() => setActionMessage('Resume add failed.'));
  };

  const handleReplaceResumeVersion = (resume) => {
    const nextName = window.prompt('Replace resume name', resume.name || '');
    if (nextName === null) {
      return;
    }

    if (!currentUserId) {
      setResumes((prev) => prev.map((item) => (
        String(item.id) === String(resume.id)
          ? { ...item, name: nextName, lastUpdated: new Date().toISOString().slice(0, 10) }
          : item
      )));
      setActionMessage('Resume replaced locally.');
      return;
    }

    memberProfileHTTPService
      .updateResume(currentUserId, resume.id, { name: nextName })
      .then(() => {
        setResumes((prev) => prev.map((item) => (
          String(item.id) === String(resume.id)
            ? { ...item, name: nextName, lastUpdated: new Date().toISOString().slice(0, 10) }
            : item
        )));
        setActionMessage('Resume replaced.');
      })
      .catch(() => setActionMessage('Resume replace failed.'));
  };

  const handleDeleteResumeVersion = (resume) => {
    if (!currentUserId) {
      setResumes((prev) => prev.filter((item) => String(item.id) !== String(resume.id)));
      setActionMessage('Resume deleted locally.');
      return;
    }

    memberProfileHTTPService
      .removeResume(currentUserId, resume.id)
      .then(() => {
        setResumes((prev) => prev.filter((item) => String(item.id) !== String(resume.id)));
        setActionMessage('Resume deleted.');
      })
      .catch(() => setActionMessage('Resume delete failed.'));
  };

  const handleDownloadResumePdf = () => {
    const doc = new jsPDF();
    const lines = [
      `Name: ${profile.fullName}`,
      `Headline: ${profile.headline}`,
      `Location: ${profile.location}`,
      `Experience: ${profile.experienceYears} years`,
      `Skills: ${profileManager.skills.filter(Boolean).join(', ')}`,
      `Work Experience: ${profileManager.workExperiences.filter(Boolean).join(' | ')}`,
      `Education: ${profileManager.educations.filter(Boolean).join(' | ')}`,
      `Certifications: ${profileManager.certifications.filter(Boolean).join(' | ')}`,
      `Languages: ${profileManager.languages.filter(Boolean).join(', ')}`,
      `Portfolio: ${profileManager.portfolioLinks.filter(Boolean).join(', ')}`,
    ];

    doc.setFontSize(16);
    doc.text('UPRECRUIT Resume', 14, 18);
    doc.setFontSize(11);

    let currentY = 28;
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 180);
      doc.text(wrapped, 14, currentY);
      currentY += wrapped.length * 6;
    });

    doc.save(`${(profile.fullName || 'candidate').replace(/\s+/g, '-').toLowerCase()}-resume.pdf`);
    setActionMessage('Resume PDF downloaded.');
  };

  const handleEditSavedSearch = (searchItem) => {
    const nextLabel = window.prompt('Update saved search label', searchItem.label || '');
    if (nextLabel === null) {
      return;
    }

    const nextKeyword = window.prompt('Update keyword', searchItem.keyword || '');
    if (nextKeyword === null) {
      return;
    }

    const nextLocation = window.prompt('Update location', searchItem.location || '');
    if (nextLocation === null) {
      return;
    }

    const updatedPayload = {
      label: nextLabel.trim() || searchItem.label,
      keyword: nextKeyword.trim() || searchItem.keyword,
      location: nextLocation.trim() || searchItem.location,
    };

    const isLocalRecord = String(searchItem.id).startsWith('local-');

    const applyLocalUpdate = () => {
      setSavedSearches((prev) => prev.map((item) => (
        String(item.id) === String(searchItem.id)
          ? { ...item, ...updatedPayload }
          : item
      )));
    };

    if (currentUserId && !isLocalRecord) {
      memberSavedSearchHTTPService
        .update(searchItem.id, updatedPayload)
        .then(() => {
          applyLocalUpdate();
          setActionMessage('Saved search updated.');
        })
        .catch(() => {
          applyLocalUpdate();
          setActionMessage('Saved search backend unavailable; updated locally.');
        });
      return;
    }

    applyLocalUpdate();
    setActionMessage('Saved search updated locally.');
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    if (backendNotifications.length) {
      memberNotificationHTTPService
        .markAsRead(notificationId)
        .then(() => {
          setBackendNotifications((prev) => prev.map((item) => (
            String(item.id) === String(notificationId)
              ? { ...item, readStatus: 'true' }
              : item
          )));
          setActionMessage('Notification marked as read.');
        })
        .catch(() => {
          setBackendNotifications((prev) => prev.map((item) => (
            String(item.id) === String(notificationId)
              ? { ...item, readStatus: 'true' }
              : item
          )));
          setActionMessage('Notification backend unavailable; marked read locally.');
        });
      return;
    }

    setMessages((prev) => prev.map((item) => (
      String(item.id) === String(notificationId)
        ? { ...item, unread: false }
        : item
    )));
    setActionMessage('Notification marked as read locally.');
  };

  const handleMarkAllNotificationsAsRead = () => {
    if (backendNotifications.length && currentUserId) {
      memberNotificationHTTPService
        .markAllAsRead(currentUserId)
        .then(() => {
          setBackendNotifications((prev) => prev.map((item) => ({ ...item, readStatus: 'true' })));
          setActionMessage('All notifications marked as read.');
        })
        .catch(() => {
          setBackendNotifications((prev) => prev.map((item) => ({ ...item, readStatus: 'true' })));
          setActionMessage('Notification backend unavailable; all marked read locally.');
        });
      return;
    }

    setMessages((prev) => prev.map((item) => ({ ...item, unread: false })));
    setActionMessage('All notifications marked as read locally.');
  };

  const performJobSearch = () => {
    let results = jobs;
    
    if (jobSearchFilters.keyword) {
      const kw = jobSearchFilters.keyword.toLowerCase();
      results = results.filter((job) =>
        (job.title || '').toLowerCase().includes(kw) ||
        (job.companyName || '').toLowerCase().includes(kw) ||
        (job.description || '').toLowerCase().includes(kw) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(kw))
      );
    }
    
    if (jobSearchFilters.location) {
      const loc = jobSearchFilters.location.toLowerCase();
      results = results.filter((job) => (job.location || '').toLowerCase().includes(loc));
    }
    
    if (jobSearchFilters.salaryMin) {
      const min = Number(jobSearchFilters.salaryMin);
      results = results.filter((job) => Number(job.salaryMax) >= min);
    }
    
    if (jobSearchFilters.salaryMax) {
      const max = Number(jobSearchFilters.salaryMax);
      results = results.filter((job) => Number(job.salaryMin) <= max);
    }
    
    if (jobSearchFilters.experience) {
      results = results.filter((job) => (job.experienceLevel || '').toLowerCase() === jobSearchFilters.experience.toLowerCase());
    }
    
    if (jobSearchFilters.industry) {
      results = results.filter((job) => (job.category || '').toLowerCase() === jobSearchFilters.industry.toLowerCase());
    }
    
    if (jobSearchFilters.jobType) {
      results = results.filter((job) => (job.jobType || '').toLowerCase().includes(jobSearchFilters.jobType.toLowerCase()));
    }

    if (jobSearchFilters.postedDate) {
      const now = new Date();
      const cutoffMs = jobSearchFilters.postedDate === '24h' ? 24 * 60 * 60 * 1000 : jobSearchFilters.postedDate === '7d' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      const cutoff = new Date(now.getTime() - cutoffMs);
      results = results.filter((job) => job.postedAt ? new Date(job.postedAt) >= cutoff : true);
    }
    
    if (jobSearchFilters.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (jobSearchFilters.sortBy === 'salary') {
      results.sort((a, b) => Number(b.salaryMax) - Number(a.salaryMax));
    } else if (jobSearchFilters.sortBy === 'relevance') {
      results.sort((a, b) => (a.id || 0) - (b.id || 0));
    }
    
    setSearchResults(results);
    setActionMessage(`Found ${results.length} job${results.length !== 1 ? 's' : ''}.`);
  };

  const handleBookmarkJob = (jobId) => {
    const jobIdStr = String(jobId);
    if (!bookmarkedJobs.includes(jobIdStr)) {
      setBookmarkedJobs((prev) => [...prev, jobIdStr]);
      setActionMessage('Job saved.');
    } else {
      setActionMessage('Job already bookmarked.');
    }
  };

  const handleRemoveBookmark = (jobId) => {
    const jobIdStr = String(jobId);
    setBookmarkedJobs((prev) => prev.filter((id) => id !== jobIdStr));
    setActionMessage('Job removed from bookmarks.');
  };

  const handleShareJob = (job) => {
    const jobUrl = `${window.location.origin}/frontoffice/viewjob/${job.id}`;
    const text = `Check out this job: ${job.title} at ${job.companyName}`;
    
    if (navigator.share) {
      navigator.share({ title: job.title, text, url: jobUrl })
        .then(() => setActionMessage('Job shared successfully.'))
        .catch(() => setActionMessage('Share cancelled.'));
    } else {
      navigator.clipboard.writeText(jobUrl);
      setActionMessage('Job link copied to clipboard.');
    }
  };

  const handleReportJob = (jobId) => {
    if (!reportedJobs.includes(String(jobId))) {
      setReportedJobs((prev) => [...prev, String(jobId)]);
      setActionMessage('Job reported. Thank you for keeping our platform safe.');
    } else {
      setActionMessage('Job already reported.');
    }
  };

  const handleFollowCompany = (companyName) => {
    if (!followedCompanies.includes(companyName)) {
      setFollowedCompanies((prev) => [...prev, companyName]);
      setActionMessage(`Following ${companyName}.`);
    } else {
      setActionMessage(`Already following ${companyName}.`);
    }
  };

  const handleUnfollowCompany = (companyName) => {
    setFollowedCompanies((prev) => prev.filter((c) => c !== companyName));
    setActionMessage(`Unfollowed ${companyName}.`);
  };

  // â”€â”€â”€ Communication Handlers â”€â”€â”€
  const handleSendMessage = (recruiterEmail, messageText) => {
    if (!messageText.trim()) { setActionMessage('Message cannot be empty.'); return; }
    const newMsg = { id: messages.length + 1, from: profile.email || 'jobseeker@uprecruit.com', to: recruiterEmail, body: messageText, timestamp: new Date(), read: false, type: 'sent', attachments: messageAttachments };
    setMessages((prev) => [newMsg, ...prev]);
    setNewMessage('');
    setMessageAttachments([]);
    setActionMessage(`Message sent to ${recruiterEmail}.`);
  };

  const handleReplyToMessage = (messageId, replyText) => {
    if (!replyText.trim()) { setActionMessage('Reply cannot be empty.'); return; }
    const originalMsg = messages.find((m) => m.id === messageId);
    const reply = { id: messages.length + 1, from: profile.email || 'jobseeker@uprecruit.com', to: originalMsg.from, inReplyTo: messageId, body: replyText, timestamp: new Date(), read: false, type: 'reply' };
    setMessages((prev) => [reply, ...prev]);
    setNewMessage('');
    setActionMessage('Reply sent.');
  };

  const handleMarkMessageAsRead = (messageId) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, read: true } : m)));
  };

  const handleRespondToInterview = (interviewId, status) => {
    setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, status: status } : i)));
    setActionMessage(`Interview ${status}.`);
  };

  const handleRequestReschedule = (interviewId) => {
    setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, status: 'Reschedule Requested' } : i)));
    setActionMessage('Reschedule request sent to recruiter.');
  };

  const handleUploadAttachment = (file) => {
    if (file && file.size < 10485760) {
      setMessageAttachments((prev) => [...prev, { name: file.name, size: file.size, id: Date.now() }]);
      setActionMessage(`${file.name} attached.`);
    } else {
      setActionMessage('File too large (max 10MB).');
    }
  };

  const handleBlockRecruiter = (recruiterEmail) => {
    setMessages((prev) => prev.filter((m) => m.from !== recruiterEmail && m.to !== recruiterEmail));
    setActionMessage(`Blocked and removed messages from ${recruiterEmail}.`);
  };

  // â”€â”€â”€ Interview Management Handlers â”€â”€â”€
  const handleSelectInterviewSlot = (interviewId, slot) => {
    setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, scheduledDate: slot.split(' ').slice(0, 1)[0], scheduledTime: slot.split(' ').slice(1).join(' ') } : i)));
    setActionMessage(`Interview rescheduled to ${slot}.`);
  };

  const handleSyncCalendar = (calendarType) => {
    if (!syncedCalendars.includes(calendarType)) {
      setSyncedCalendars((prev) => [...prev, calendarType]);
      setActionMessage(`${calendarType} calendar synced.`);
    } else {
      setActionMessage(`${calendarType} already synced.`);
    }
  };

  const handleAddInterviewNotes = (interviewId, notes) => {
    setInterviewNotes((prev) => ({ ...prev, [interviewId]: notes }));
    setActionMessage('Interview notes saved.');
  };

  const handleJoinVideoInterview = (interviewId) => {
    setActionMessage('Launching video interview link...');
    // In production, navigate to video meeting link or open in modal
  };

  // â”€â”€â”€â”€â”€â”€ Notification Center Handlers â”€â”€â”€â”€â”€â”€
  const handleToggleNotificationChannel = (channel) => {
    setNotificationChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
    setActionMessage(`${channel.charAt(0).toUpperCase() + channel.slice(1)} notifications ${!notificationChannels[channel] ? 'enabled' : 'disabled'}.`);
  };

  const handleMarkNotifAsRead = (notifId) => {
    setNotificationsList((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const handleClearNotifications = () => {
    setNotificationsList([]);
    setActionMessage('All notifications cleared.');
  };

  // â”€â”€â”€â”€â”€â”€ AI Features Handlers â”€â”€â”€â”€â”€â”€
  const handleGetAIRecommendations = () => {
    setActionMessage('Loading AI job recommendations based on your profile...');
    setTimeout(() => {
      setAiRecommendations((prev) => [
        ...prev,
        { id: 3, title: 'Principal Engineer', company: 'Enterprise Corp', matchScore: 92, reason: 'Leadership skills align with role requirements' },
      ]);
      setActionMessage('AI recommendations updated.');
    }, 1500);
  };

  const handleUploadCVForAnalysis = () => {
    setActionMessage('Analyzing your CV...');
    setCvUploadProgress(0);
    const interval = setInterval(() => {
      setCvUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActionMessage('CV analysis complete. Check suggestions below.');
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleGetJobMatchScore = (jobId) => {
    const score = Math.floor(Math.random() * 40) + 60;
    setMatchScores((prev) => ({ ...prev, [jobId]: score }));
    setActionMessage(`Match score calculated: ${score}% for job ${jobId}.`);
  };

  const handleGetSuggestedSkills = () => {
    setActionMessage('Top 5 skills recommended based on job market trends in your field.');
  };

  const handleGenerateCoverLetter = (jobTitle) => {
    setActionMessage('Generating AI cover letter...');
    setTimeout(() => {
      setGeneratedCoverLetter(
        `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at your esteemed organization. With my extensive experience in full-stack development and proven track record of delivering high-impact solutions, I am confident I would be a valuable addition to your team.

Throughout my career, I have demonstrated expertise in React, Node.js, and cloud technologies, consistently delivering projects on time and exceeding expectations. My passion for clean code and collaborative development makes me an ideal candidate for your role.

I am excited about the opportunity to contribute to your organization's success and would welcome the chance to discuss how my skills align with your needs.

Best regards,
CandidateProf`
      );
      setActionMessage('Cover letter generated. Copy to use.');
    }, 1200);
  };

  const handleStartMockInterview = () => {
    setMockInterviewActive(true);
    setCurrentMockQuestionIndex(0);
    setMockAnswers({});
    setActionMessage('Mock interview started. Answer each question thoughtfully.');
  };

  const handleSubmitMockAnswer = (answer) => {
    setMockAnswers((prev) => ({ ...prev, [currentMockQuestionIndex]: answer }));
    if (currentMockQuestionIndex < mockInterviewQuestions.length - 1) {
      setCurrentMockQuestionIndex((prev) => prev + 1);
    } else {
      setMockInterviewActive(false);
      setActionMessage('Mock interview complete! Review your responses for improvement areas.');
    }
  };

  // --- Career Development Handlers (Feature 11) ---
  const handleViewSalaryBenchmarks = () => {
    setActionMessage('Salary benchmarks loaded from latest market data.');
  };

  const handleLoadRoleComparisons = () => {
    setActionMessage('Role comparison updated across selected locations.');
  };

  const handleGetLearningRecommendations = () => {
    setActionMessage('Learning recommendations refreshed based on your skill gaps.');
  };

  const handleStartAssessment = (skill) => {
    setActiveAssessment(skill);
    setAssessmentAnswers({});
    setAssessmentResult(null);
    setAssessmentStep(0);
    setActionMessage(`${skill} assessment started. Answer all questions.`);
  };

  const handleAssessmentAnswer = (questionId, optionIndex) => {
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitAssessment = () => {
    const correct = assessmentQuestions.filter((q) => assessmentAnswers[q.id] === q.correct).length;
    const score = Math.round((correct / assessmentQuestions.length) * 100);
    setAssessmentResult({ score, correct, total: assessmentQuestions.length });
    setSkillProgress((prev) =>
      prev.map((s) =>
        s.skill === activeAssessment
          ? { ...s, level: Math.min(100, s.level + Math.round(score / 10)), trend: `+${Math.round(score / 10)}%` }
          : s
      )
    );
    setActiveAssessment(null);
    setActionMessage(`Assessment complete! Score: ${score}% — skill level updated.`);
  };

  // --- Account & Privacy Handlers (Feature 12) ---
  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      setActionMessage('Please fill in all password fields.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setActionMessage('New passwords do not match.');
      return;
    }
    if (passwordForm.newPass.length < 8) {
      setActionMessage('Password must be at least 8 characters.');
      return;
    }
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setActionMessage('Password changed successfully.');
  };

  const handleDownloadPersonalData = () => {
    const data = {
      profile,
      totalApplications: applications.length,
      preferences: { privacy, notifications, security },
      exportedAt: new Date().toISOString(),
      gdprNote: 'Data export per GDPR Article 20 — Right to data portability.',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uprecruit-my-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setGdprDownloadReady(true);
    setActionMessage('Personal data exported. Download started (GDPR Art. 20).');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      setActionMessage('Type DELETE in the confirmation field to proceed.');
      return;
    }
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
    setActionMessage('Account deletion request submitted. You will be signed out shortly.');
    setTimeout(() => handleSignOut(), 3000);
  };

  const handleUnblockCompany = (company) => {
    setBlockedCompanies((prev) => prev.filter((c) => c !== company));
    setActionMessage(`${company} has been unblocked.`);
  };

  const handleChangeProfileVisibility = (value) => {
    setProfileVisibility(value);
    setPrivacy((prev) => ({
      ...prev,
      hideProfile: value === 'hidden',
      anonymizeProfile: value === 'recruiters-only',
    }));
    setActionMessage(`Profile visibility set to: ${value}.`);
  };

  // --- Feature 13 Handlers ---
  const handleContinueApplication = (appId) => {
    setIncompleteApplications((prev) => prev.filter((a) => a.id !== appId));
    setActionMessage('Resuming application — you will be redirected to the job listing.');
  };

  const handleToggleReminder = (reminderId) => {
    setApplyReminders((prev) =>
      prev.map((r) => r.id === reminderId ? { ...r, enabled: !r.enabled } : r)
    );
    const reminder = applyReminders.find((r) => r.id === reminderId);
    if (reminder) {
      setActionMessage(reminder.enabled ? `Reminder disabled for "${reminder.title}".` : `Reminder enabled for "${reminder.title}".`);
    }
  };

  // --- Feature 14 Handlers ---
  const handleCreateJobAlert = () => {
    if (!newAlertForm.keyword.trim()) {
      setActionMessage('Please enter a keyword for the job alert.');
      return;
    }
    const newAlert = { id: Date.now(), keyword: newAlertForm.keyword.trim(), location: newAlertForm.location.trim() || 'Anywhere', frequency: newAlertForm.frequency, active: true };
    setJobAlerts((prev) => [newAlert, ...prev]);
    setNewAlertForm({ keyword: '', location: '', frequency: 'Daily' });
    setActionMessage(`Job alert created: "${newAlert.keyword}" in ${newAlert.location}.`);
  };

  const handleToggleJobAlert = (alertId) => {
    setJobAlerts((prev) =>
      prev.map((a) => a.id === alertId ? { ...a, active: !a.active } : a)
    );
  };

  const handleDeleteJobAlert = (alertId) => {
    setJobAlerts((prev) => prev.filter((a) => a.id !== alertId));
    setActionMessage('Job alert removed.');
  };

  const handleBooleanSearch = () => {
    if (!booleanQuery.trim()) {
      setActionMessage('Enter a Boolean query to search.');
      return;
    }
    const mockResults = [
      { id: 1, title: 'Senior React Developer', company: 'TechFirm', location: 'Remote', match: 97 },
      { id: 2, title: 'Frontend Engineer', company: 'WebCorp', location: 'Paris', match: 88 },
      { id: 3, title: 'Full Stack Developer', company: 'StartupABC', location: 'Lyon', match: 74 },
    ];
    setBooleanResults(mockResults);
    setActionMessage(`Boolean search completed — ${mockResults.length} results found.`);
  };

  const handleUpdateJobTag = (jobId, newTag) => {
    setTaggedJobs((prev) =>
      prev.map((j) => j.id === jobId ? { ...j, tag: newTag } : j)
    );
  };

  const handleRemoveTaggedJob = (jobId) => {
    setTaggedJobs((prev) => prev.filter((j) => j.id !== jobId));
    setActionMessage('Job removed from saved list.');
  };

  const handleExportApplicationHistory = () => {
    const data = {
      exported: new Date().toISOString(),
      stats: appSuccessStats,
      applications: [
        { title: 'Senior React Developer', company: 'TechCorp', status: 'Interviewed', date: '2026-03-10' },
        { title: 'Full Stack Engineer', company: 'StartupXYZ', status: 'Rejected', date: '2026-03-15' },
        { title: 'DevOps Engineer', company: 'CloudBase', status: 'Offered', date: '2026-04-01' },
      ],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'application-history.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportHistoryReady(true);
    setActionMessage('Application history exported successfully.');
  };
  const memberJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'UPRECRUIT Member Hub',
      description: 'Logged-in candidate workspace with profile, applications, communication, and career tools.',
      mainEntity: {
        '@type': 'Person',
        name: profile.fullName,
        jobTitle: profile.headline,
      },
    }),
    [profile.fullName, profile.headline]
  );

  useSeo(
    'UPRECRUIT Member Hub - Candidate Workspace',
    'Manage your profile, resumes, applications, alerts, interviews, and premium career tools from one member dashboard.',
    {
      pathname: '/frontoffice/member',
      type: 'profile',
      noIndex: true,
      jsonLd: memberJsonLd,
    }
  );

  const handleSignOut = () => {
    localStorage.removeItem('connected');
    localStorage.removeItem('currentUser');
    history.push('/frontoffice/login');
  };

  return (
    <FrontOfficeLayout>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

        {/* â”€â”€ Sidebar â”€â”€ */}
        <aside style={{ width: '240px', minWidth: '240px', background: '#10203a', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', letterSpacing: '0.04em' }}>UPRECRUIT</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Candidate Portal</div>
          </div>

          <nav style={{ flex: 1, padding: '16px 0' }}>
            <div style={{ padding: '0 14px 8px', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pages</div>
            {PORTAL_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                exact
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13px', fontWeight: 500, borderRadius: '0', transition: 'background 0.15s' }}
                activeStyle={{ background: 'rgba(35,88,216,0.35)', color: '#fff', fontWeight: 700 }}
              >
                <i className={`fa ${item.icon}`} style={{ width: '16px', textAlign: 'center', opacity: 0.75 }}></i>
                {item.label}
              </NavLink>
            ))}

            <div style={{ padding: '16px 14px 8px', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px' }}>Dashboard</div>
            {SECTION_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 20px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              >
                <i className={`fa ${item.icon}`} style={{ width: '16px', textAlign: 'center', opacity: 0.65 }}></i>
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{profile.fullName}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{profile.headline}</div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              <i className="fa fa-sign-out"></i> Sign Out
            </button>
          </div>
        </aside>

        {/* â”€â”€ Main content â”€â”€ */}
        <div style={{ flex: 1, overflow: 'auto' }}>
      <div className="dashboard-page" style={{ padding: '24px' }}>

        {/* â”€â”€ Hero â”€â”€ */}
        <section className="dashboard-hero card">
          <div className="dashboard-hero__content">
            <div>
              <span className="dashboard-hero__eyebrow">Candidate workspace</span>
              <h2 className="dashboard-hero__title">{profile.fullName}</h2>
              <p className="dashboard-hero__subtitle">{profile.headline} &mdash; {profile.location}</p>
              <p className="dashboard-hero__subtitle" style={{ marginTop: '6px', fontSize: '13px' }}>
                Backend: {backendConnected ? <span style={{ color: '#13a38a' }}>Connected</span> : <span style={{ color: '#f59e0b' }}>Fallback mode</span>}
              </p>
              {actionMessage ? (
                <span className="dashboard-pill dashboard-pill--success" style={{ marginTop: '12px' }}>{actionMessage}</span>
              ) : null}
            </div>
            <div className="dashboard-hero__aside">
              <div className="dashboard-hero__score">
                <span className="dashboard-hero__score-label">Profile completion</span>
                <strong>{profileCompletion}%</strong>
                <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '999px', height: '6px', marginTop: '10px' }}>
                  <div style={{ width: `${profileCompletion}%`, height: '6px', borderRadius: '999px', background: '#13a38a' }} />
                </div>
              </div>
              <div className="dashboard-hero__mini-grid">
                <div>
                  <span>Resume score</span>
                  <strong>{resumeScore}/100</strong>
                </div>
                <div>
                  <span>Unread</span>
                  <strong>{unreadNotifications}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ KPI metric cards â”€â”€ */}
        <section className="row dashboard-metrics-row">
          {[
            { label: 'Profile completion', value: `${profileCompletion}%`, delta: 'Profile quality score', icon: 'fa-user-circle' },
            { label: 'Applications', value: applications.length, delta: `${applicationsByStatus.find(s => s.status === 'Interview')?.count || 0} in interview`, icon: 'fa-file-alt' },
            { label: 'Unread notifications', value: unreadNotifications, delta: 'Messages & alerts', icon: 'fa-bell' },
            { label: 'Interview invites', value: invites.length, delta: 'Scheduled slots', icon: 'fa-calendar-check' },
          ].map((metric) => (
            <div className="col-xl-3 col-md-6" key={metric.label} style={{ marginBottom: '22px' }}>
              <article className="dashboard-metric-card card">
                <div className="dashboard-metric-card__icon">
                  <i className={`fa ${metric.icon}`}></i>
                </div>
                <div className="dashboard-metric-card__body">
                  <span className="dashboard-metric-card__label">{metric.label}</span>
                  <strong className="dashboard-metric-card__value">{metric.value}</strong>
                  <small className="dashboard-metric-card__delta">{metric.delta}</small>
                </div>
              </article>
            </div>
          ))}
        </section>

        {/* â”€â”€ Account & Onboarding â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-account-onboarding" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Account & Onboarding</span>
                    <h3>Registration, Verification, Preferences</h3>
                  </div>
                  <span className="dashboard-pill">Step {accountOnboarding.wizardStep}/4</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#10203a', color: '#fff' }} onClick={() => history.push('/frontoffice/register')}>
                    Register (Email)
                  </button>
                  <input
                    className="fo-input"
                    style={{ maxWidth: '240px' }}
                    placeholder="Email for Google/LinkedIn"
                    value={socialRegisterEmail}
                    onChange={(event) => setSocialRegisterEmail(event.target.value)}
                  />
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }} onClick={() => handleSocialRegister('google')}>
                    Register Google
                  </button>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }} onClick={() => handleSocialRegister('linkedin')}>
                    Register LinkedIn
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: accountOnboarding.emailVerified ? '#2358d8' : '#f5f8ff', color: accountOnboarding.emailVerified ? '#fff' : '#2358d8' }}
                    onClick={() => setAccountOnboarding((prev) => ({ ...prev, emailVerified: !prev.emailVerified }))}
                  >
                    Verify email: {accountOnboarding.emailVerified ? 'Done' : 'Pending'}
                  </button>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: accountOnboarding.phoneVerified ? '#2358d8' : '#f5f8ff', color: accountOnboarding.phoneVerified ? '#fff' : '#2358d8' }}
                    onClick={() => setAccountOnboarding((prev) => ({ ...prev, phoneVerified: !prev.phoneVerified }))}
                  >
                    Verify phone: {accountOnboarding.phoneVerified ? 'Done' : 'Pending'}
                  </button>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e' }} onClick={handleSignOut}>
                    Logout
                  </button>
                </div>

                <div className="row" style={{ marginBottom: '12px' }}>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Preferred roles (comma-separated)"
                      value={accountOnboarding.preferredRoles.join(', ')}
                      onChange={(event) => setAccountOnboarding((prev) => ({ ...prev, preferredRoles: event.target.value.split(',').map((item) => item.trim()) }))}
                    />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Preferred location"
                      value={accountOnboarding.preferredLocation}
                      onChange={(event) => setAccountOnboarding((prev) => ({ ...prev, preferredLocation: event.target.value }))}
                    />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Preferred salary"
                      value={accountOnboarding.preferredSalary}
                      onChange={(event) => setAccountOnboarding((prev) => ({ ...prev, preferredSalary: event.target.value }))}
                    />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Job types (Remote, Full-time, Freelance)"
                      value={accountOnboarding.preferredJobTypes.join(', ')}
                      onChange={(event) => setAccountOnboarding((prev) => ({ ...prev, preferredJobTypes: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }}
                    onClick={() => setAccountOnboarding((prev) => ({ ...prev, wizardStep: Math.max(1, prev.wizardStep - 1) }))}
                  >
                    Wizard Back
                  </button>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }}
                    onClick={() => setAccountOnboarding((prev) => ({ ...prev, wizardStep: Math.min(4, prev.wizardStep + 1) }))}
                  >
                    Wizard Next
                  </button>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: accountOnboarding.onboardingCompleted ? '#13a38a' : '#2358d8', color: '#fff' }}
                    onClick={() => setAccountOnboarding((prev) => ({ ...prev, onboardingCompleted: !prev.onboardingCompleted }))}
                  >
                    Onboarding {accountOnboarding.onboardingCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #e8edf5', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '8px' }}>Reset password</div>
                  <div className="row">
                    <div className="col-12" style={{ marginBottom: '8px' }}>
                      <input className="fo-input" placeholder="Email/username" value={resetFlow.username} onChange={(event) => setResetFlow((prev) => ({ ...prev, username: event.target.value }))} />
                    </div>
                    <div className="col-6" style={{ marginBottom: '8px' }}>
                      <input className="fo-input" placeholder="Reset code" value={resetFlow.code} onChange={(event) => setResetFlow((prev) => ({ ...prev, code: event.target.value }))} />
                    </div>
                    <div className="col-6" style={{ marginBottom: '8px' }}>
                      <input className="fo-input" type="password" placeholder="New password" value={resetFlow.newPassword} onChange={(event) => setResetFlow((prev) => ({ ...prev, newPassword: event.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }} onClick={handleRequestResetCode}>Request code</button>
                    <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }} onClick={handleResetPassword}>Reset password</button>
                    {resetFlow.latestCode ? <span className="dashboard-pill">Dev code: {resetFlow.latestCode}</span> : null}
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#10203a', color: '#fff' }} onClick={handleSaveAccountOnboarding}>
                    Save account & onboarding
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-profile-management" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Profile Management</span>
                    <h3>Resume, Experience, Education, Skills</h3>
                  </div>
                  <span className="dashboard-pill">Visibility: {profileManager.profileVisibility}</span>
                </div>

                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Work experience (comma-separated)" value={profileManager.workExperiences.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, workExperiences: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Education (comma-separated)" value={profileManager.educations.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, educations: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Skills (comma-separated)" value={profileManager.skills.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, skills: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Certifications (comma-separated)" value={profileManager.certifications.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, certifications: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Languages (comma-separated)" value={profileManager.languages.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, languages: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Portfolio links (GitHub, website... comma-separated)" value={profileManager.portfolioLinks.join(', ')} onChange={(event) => setProfileManager((prev) => ({ ...prev, portfolioLinks: event.target.value.split(',').map((item) => item.trim()) }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="LinkedIn URL (https://linkedin.com/in/yourname)" value={profileManager.linkedinUrl || ''} onChange={(event) => setProfileManager((prev) => ({ ...prev, linkedinUrl: event.target.value }))} />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '3px' }}>Profile photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="fo-input"
                      style={{ padding: '4px' }}
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (e) => setProfileManager((prev) => ({ ...prev, profilePictureUrl: e.target.result }));
                        reader.readAsDataURL(file);
                        setActionMessage('Profile photo updated.');
                      }}
                    />
                    {profileManager.profilePictureUrl && (
                      <img src={profileManager.profilePictureUrl} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginTop: '4px', border: '2px solid #2358d8' }} />
                    )}
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Video intro URL" value={profileManager.videoIntroUrl} onChange={(event) => setProfileManager((prev) => ({ ...prev, videoIntroUrl: event.target.value }))} />
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <select className="fo-select" value={profileManager.profileVisibility} onChange={(event) => setProfileManager((prev) => ({ ...prev, profileVisibility: event.target.value }))}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="recruiters-only">Visible to recruiters only</option>
                    </select>
                  </div>
                  <div className="col-12" style={{ marginBottom: '8px' }}>
                    <textarea className="fo-input" rows={3} placeholder="Resume builder content" value={profileManager.resumeBuilderContent} onChange={(event) => setProfileManager((prev) => ({ ...prev, resumeBuilderContent: event.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }} onClick={handleAddResumeVersion}>Upload resume version</button>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#7c3aed', color: '#fff' }}
                    onClick={() => {
                      const name = profileManager.skills.filter(Boolean).slice(0, 3).join(', ') || 'Software Engineer';
                      const content = `PROFESSIONAL SUMMARY\nExperienced professional specialising in ${name}.\n\nSKILLS\n${profileManager.skills.filter(Boolean).join(' · ') || 'See profile'}\n\nCERTIFICATIONS\n${profileManager.certifications.filter(Boolean).join(' · ') || 'N/A'}\n\nLANGUAGES\n${profileManager.languages.filter(Boolean).join(' · ') || 'N/A'}`;
                      setProfileManager((prev) => ({ ...prev, resumeBuilderContent: content }));
                      setActionMessage('AI resume content generated. Review below and save.');
                    }}
                  >
                    <i className="fa fa-magic" style={{ marginRight: '4px' }}></i>Generate resume with AI
                  </button>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#10203a', color: '#fff' }} onClick={handleDownloadResumePdf}>Download resume PDF</button>
                </div>

                {resumes.slice(0, 6).map((resumeItem) => (
                  <div key={`pm-${resumeItem.id}`} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{resumeItem.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{resumeItem.lastUpdated}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', fontSize: '11px' }} onClick={() => handleReplaceResumeVersion(resumeItem)}>Replace</button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', fontSize: '11px' }} onClick={() => handleDeleteResumeVersion(resumeItem)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '10px' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#10203a', color: '#fff' }} onClick={handleSaveProfileManagement}>
                    Save profile management
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Row: Profile & Job Discovery â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-profile" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Identity</span>
                    <h3>Profile &amp; Resumes</h3>
                  </div>
                  <span className="dashboard-pill">{profile.skills.length} skills</span>
                </div>
                <ul className="dashboard-focus-list">
                  <li><strong>Headline:</strong> {profile.headline}</li>
                  <li><strong>Location:</strong> {profile.location}</li>
                  <li><strong>Education:</strong> {profile.education}</li>
                  <li><strong>Experience:</strong> {profile.experienceYears} years</li>
                </ul>
                <div style={{ marginTop: '16px' }}>
                  <strong style={{ fontSize: '13px', color: '#405066' }}>Skills</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {profile.skills.map((skill) => (
                      <span key={skill} className="dashboard-pill">{skill}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '14px', color: '#10203a' }}>Resumes</strong>
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }}
                      onClick={handleAddResumeVersion}
                    >
                      <i className="fa fa-upload" style={{ marginRight: '6px' }}></i> Upload
                    </button>
                  </div>
                  {resumes.map((resume) => (
                    <div key={resume.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{resume.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Updated {resume.lastUpdated}{resume.isPrimary ? ' Â· Primary CV' : ''}</div>
                      </div>
                      <span className="dashboard-pill dashboard-pill--success">Score {resume.parsedScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-discovery" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, overflowY: 'auto', maxHeight: '800px' }}>
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Discovery</span>
                    <h3>Job Search &amp; Discovery</h3>
                  </div>
                  <span className="dashboard-pill">{searchResults.length || jobs.length} jobs</span>
                </div>

                {/* â”€â”€ Search & Filters â”€â”€ */}
                <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      className="fo-input"
                      placeholder="Search by keyword..."
                      value={jobSearchFilters.keyword}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                      style={{ marginBottom: '8px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="fo-input"
                      placeholder="Location..."
                      value={jobSearchFilters.location}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, location: e.target.value }))}
                    />
                    <select
                      className="fo-select"
                      value={jobSearchFilters.jobType}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, jobType: e.target.value }))}
                    >
                      <option value="">All job types</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <select
                      className="fo-select"
                      value={jobSearchFilters.experience}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, experience: e.target.value }))}
                    >
                      <option value="">All experience levels</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                    <select
                      className="fo-select"
                      value={jobSearchFilters.sortBy}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                    >
                      <option value="recent">Sort: Recent</option>
                      <option value="salary">Sort: Highest Salary</option>
                      <option value="relevance">Sort: Relevance</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="number"
                      className="fo-input"
                      placeholder="Min salary..."
                      value={jobSearchFilters.salaryMin}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, salaryMin: e.target.value }))}
                    />
                    <input
                      type="number"
                      className="fo-input"
                      placeholder="Max salary..."
                      value={jobSearchFilters.salaryMax}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, salaryMax: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <select
                      className="fo-select"
                      value={jobSearchFilters.industry}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, industry: e.target.value }))}
                    >
                      <option value="">All industries</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="marketing">Marketing</option>
                      <option value="education">Education</option>
                      <option value="engineering">Engineering</option>
                    </select>
                    <select
                      className="fo-select"
                      value={jobSearchFilters.postedDate}
                      onChange={(e) => setJobSearchFilters((prev) => ({ ...prev, postedDate: e.target.value }))}
                    >
                      <option value="">Any date posted</option>
                      <option value="24h">Last 24 hours</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', flex: 1, fontWeight: 600 }}
                    onClick={performJobSearch}
                  >
                    <i className="fa fa-search" style={{ marginRight: '6px' }}></i> Search Jobs
                  </button>
                  <button
                    type="button"
                    className="dashboard-pill"
                    title="Share search"
                    style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: '#eef4ff', color: '#2358d8', fontWeight: 600, padding: '0 12px' }}
                    onClick={() => {
                      const params = new URLSearchParams();
                      Object.entries(jobSearchFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
                      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
                      if (navigator.share) {
                        navigator.share({ title: 'Job Search', url: shareUrl }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(shareUrl).then(() => setActionMessage('Search URL copied to clipboard.')).catch(() => setActionMessage('Copy failed.'));
                      }
                    }}
                  >
                    <i className="fa fa-share-alt"></i>
                  </button>
                  </div>
                </div>

                {/* â”€â”€ Search Results â”€â”€ */}
                {searchResults.length > 0 ? (
                  <div style={{ marginBottom: '16px' }}>
                    <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                      <strong style={{ fontSize: '13px', color: '#10203a' }}>{searchResults.length} Jobs Found</strong>
                    </div>
                    {searchResults.slice(0, 5).map((job) => (
                      <div key={job.id} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '2px', cursor: 'pointer' }} onClick={() => setShowJobDetails(job)}>
                              {job.title}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{job.companyName} Â· {job.location}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                            <button
                              type="button"
                              title="Bookmark"
                              style={{ cursor: 'pointer', border: 'none', background: bookmarkedJobs.includes(String(job.id)) ? '#ffc107' : '#eef4ff', color: bookmarkedJobs.includes(String(job.id)) ? '#000' : '#2358d8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => bookmarkedJobs.includes(String(job.id)) ? handleRemoveBookmark(job.id) : handleBookmarkJob(job.id)}
                            >
                              <i className={`fa fa-${bookmarkedJobs.includes(String(job.id)) ? 'bookmark' : 'bookmark-o'}`}></i>
                            </button>
                            <button
                              type="button"
                              title="Share"
                              style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', color: '#2358d8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => handleShareJob(job)}
                            >
                              <i className="fa fa-share-alt"></i>
                            </button>
                            <button
                              type="button"
                              title="Report"
                              style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => handleReportJob(job.id)}
                            >
                              <i className="fa fa-flag"></i>
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                          {job.jobType} Â· {job.experienceLevel} Level
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                            onClick={() => {
                              const payload = { candidate: profile.fullName, jobOffer: job.title, dateApplication: new Date().toISOString().slice(0, 10), status: 'Applied' };
                              applyHTTPService.createApply(payload)
                                .then(() => { setApplications((prev) => [{ id: `local-${Date.now()}`, role: job.title, company: job.companyName, status: 'Applied', updatedAt: payload.dateApplication }, ...prev]); setActionMessage(`Applied to ${job.title}.`); })
                                .catch(() => setActionMessage(`Backend apply failed.`));
                            }}
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: followedCompanies.includes(job.companyName) ? '#90ee90' : '#f0f0f0', color: followedCompanies.includes(job.companyName) ? '#155e3a' : '#666', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
                            onClick={() => followedCompanies.includes(job.companyName) ? handleUnfollowCompany(job.companyName) : handleFollowCompany(job.companyName)}
                          >
                            {followedCompanies.includes(job.companyName) ? <i className="fa fa-check" style={{ marginRight: '4px' }}></i> : ''} {followedCompanies.includes(job.companyName) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 5 && <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '8px' }}>Showing 5 of {searchResults.length}</div>}
                  </div>
                ) : (
                  <div style={{ color: '#64748b', textAlign: 'center', padding: '16px', fontSize: '13px' }}>
                    No search results yet. Use filters above to find jobs.
                  </div>
                )}

                {/* â”€â”€ Recommended / AI-matched â”€â”€ */}
                <div style={{ marginTop: '16px' }}>
                  <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '13px', color: '#10203a' }}>Recommended for you</strong>
                  </div>
                  {jobsForYou.slice(0, 3).map((job) => (
                    <div key={job.id} style={{ padding: '10px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#10203a', marginBottom: '2px' }}>{job.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{job.companyName}</div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        <button
                          type="button"
                          style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '10px' }}
                          onClick={() => {
                            const payload = { candidate: profile.fullName, jobOffer: job.title, dateApplication: new Date().toISOString().slice(0, 10), status: 'Applied' };
                            applyHTTPService.createApply(payload).catch(() => {});
                          }}
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', color: '#2358d8', padding: '3px 8px', borderRadius: '3px', fontSize: '10px' }}
                          onClick={() => handleBookmarkJob(job.id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* â”€â”€ Bookmarked Jobs â”€â”€ */}
                {bookmarkedJobs.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div className="dashboard-section-heading" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#10203a' }}>Saved ({bookmarkedJobs.length})</strong>
                    </div>
                    {jobs.filter((j) => bookmarkedJobs.includes(String(j.id))).slice(0, 3).map((job) => (
                      <div key={job.id} style={{ padding: '8px', borderRadius: '8px', background: '#fff3cd', border: '1px solid #ffc107', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#333' }}>
                          <strong>{job.title}</strong>
                        </div>
                        <button
                          type="button"
                          style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#666', padding: '2px', fontSize: '12px' }}
                          onClick={() => handleRemoveBookmark(job.id)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* â”€â”€ Followed Companies â”€â”€ */}
                {followedCompanies.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div className="dashboard-section-heading" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#10203a' }}>Following ({followedCompanies.length})</strong>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {followedCompanies.map((company) => (
                        <button
                          key={company}
                          type="button"
                          style={{ cursor: 'pointer', border: '1px solid #90ee90', background: '#f0fff0', color: '#155e3a', padding: '4px 8px', borderRadius: '6px', fontSize: '11px' }}
                          onClick={() => handleUnfollowCompany(company)}
                        >
                          {company} <i className="fa fa-times" style={{ marginLeft: '4px' }}></i>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Row: Communication & Interviews â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-communication" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, overflowY: 'auto', maxHeight: '800px' }}>
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Inbox</span>
                    <h3>Messages &amp; Communication</h3>
                  </div>
                  <span className="dashboard-pill" style={{ background: messages.filter((m) => !m.read).length > 0 ? '#e53e3e' : '#ccc', color: '#fff' }}>{messages.filter((m) => !m.read).length} new</span>
                </div>

                {/* Message List */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: msg.read ? '#f8fafc' : '#eff6ff',
                      border: msg.read ? '1px solid #e8edf5' : '2px solid #2358d8',
                      marginBottom: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedMessageId(msg.id);
                      handleMarkMessageAsRead(msg.id);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontWeight: msg.read ? 600 : 700, fontSize: '13px', color: '#10203a', flex: 1 }}>
                        {msg.from || msg.type === 'sent' ? 'To: ' + (msg.to || msg.from) : 'From: ' + msg.from}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: msg.read ? '#64748b' : '#2358d8', marginBottom: '6px', fontWeight: 'bold' }}>
                      {msg.subject || (msg.type === 'invitation' ? 'Interview Invitation' : 'Message')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.body}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {msg.type === 'invitation' && (
                        <>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                            onClick={() => handleRespondToInterview(msg.id, 'Accepted')}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                            onClick={() => handleRespondToInterview(msg.id, 'Declined')}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: 'transparent', color: '#2358d8', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                        onClick={() => {
                          setSelectedMessageId(msg.id);
                          setShowMessagePanel(true);
                        }}
                      >
                        Reply
                      </button>
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                        onClick={() => handleBlockRecruiter(msg.from || msg.to)}
                      >
                        Block
                      </button>
                    </div>
                  </div>
                ))}

                {/* Compose Reply Panel */}
                {showMessagePanel && (
                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#fff3cd', border: '1px solid #ffc107' }}>
                    <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Compose Reply</div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '12px',
                        minHeight: '60px',
                        fontFamily: 'Arial, sans-serif',
                      }}
                    />
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
                        onClick={() => {
                          const msg = messages.find((m) => m.id === selectedMessageId);
                          handleReplyToMessage(selectedMessageId, newMessage);
                          setShowMessagePanel(false);
                        }}
                      >
                        Send Reply
                      </button>
                      {messageAttachments.length > 0 && (
                        <div style={{ fontSize: '10px', color: '#333' }}>
                          {messageAttachments.length} file(s) attached
                        </div>
                      )}
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', color: '#2358d8', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = (e) => handleUploadAttachment(e.target.files[0]);
                          input.click();
                        }}
                      >
                        <i className="fa fa-paperclip" style={{ marginRight: '4px' }}></i>Attach
                      </button>
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: 'none', background: '#f0f0f0', color: '#666', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
                        onClick={() => setShowMessagePanel(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-interviews" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, overflowY: 'auto', maxHeight: '800px' }}>
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Upcoming</span>
                    <h3>Interview Management</h3>
                  </div>
                  <span className="dashboard-pill">{interviews.filter((i) => i.status === 'Confirmed').length} scheduled</span>
                </div>

                {/* Interview List */}
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: interview.status === 'Confirmed' ? '#f0fff0' : '#f8fafc',
                      border: interview.status === 'Confirmed' ? '1px solid #90ee90' : '1px solid #e8edf5',
                      marginBottom: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedInterviewId(interview.id);
                      setShowInterviewPanel(true);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{interview.position}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{interview.companyName}</div>
                      </div>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 600,
                          background: interview.status === 'Confirmed' ? '#90ee90' : interview.status === 'Pending' ? '#fff3cd' : '#f0f0f0',
                          color: interview.status === 'Confirmed' ? '#155e3a' : interview.status === 'Pending' ? '#856404' : '#333',
                        }}
                      >
                        {interview.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                      <i className="fa fa-calendar" style={{ marginRight: '4px' }}></i>
                      {interview.scheduledDate} at {interview.scheduledTime}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                      <i className="fa fa-video-camera" style={{ marginRight: '4px' }}></i>
                      {interview.type}
                    </div>
                    {interview.notes && (
                      <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic', marginBottom: '6px', padding: '6px', background: '#fff', borderRadius: '4px', borderLeft: '3px solid #2358d8' }}>
                        {interview.notes}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {interview.type === 'Video Call' && interview.status === 'Confirmed' && (
                        <button
                          type="button"
                          style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                          onClick={() => handleJoinVideoInterview(interview.id)}
                        >
                          <i className="fa fa-video-camera" style={{ marginRight: '3px' }}></i>Join
                        </button>
                      )}
                      {interview.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                            onClick={() => handleRespondToInterview(interview.id, 'Confirmed')}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                            onClick={() => handleRequestReschedule(interview.id)}
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', color: '#2358d8', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}
                        onClick={() => handleSyncCalendar('Google')}
                      >
                        <i className="fa fa-calendar" style={{ marginRight: '3px' }}></i>Sync
                      </button>
                    </div>
                  </div>
                ))}

                {/* Interview Slots Selector Panel */}
                {showInterviewPanel && selectedInterviewId && (
                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #dce6ff' }}>
                    <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Available Time Slots</div>
                    {interviews
                      .find((i) => i.id === selectedInterviewId)
                      ?.availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          style={{
                            cursor: 'pointer',
                            display: 'block',
                            width: '100%',
                            padding: '6px 8px',
                            marginBottom: '4px',
                            border: 'none',
                            background: '#eef4ff',
                            color: '#2358d8',
                            borderRadius: '4px',
                            fontSize: '11px',
                            textAlign: 'left',
                          }}
                          onClick={() => {
                            handleSelectInterviewSlot(selectedInterviewId, slot);
                            setShowInterviewPanel(false);
                          }}
                        >
                          <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>{slot}
                        </button>
                      ))}
                    <textarea
                      placeholder="Add interview notes/reminders..."
                      value={interviewNotes[selectedInterviewId] || ''}
                      onChange={(e) => setInterviewNotes((prev) => ({ ...prev, [selectedInterviewId]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '11px',
                        minHeight: '50px',
                        fontFamily: 'Arial, sans-serif',
                        marginTop: '8px',
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: '#2358d8',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        marginTop: '8px',
                        width: '100%',
                      }}
                      onClick={() => {
                        handleAddInterviewNotes(selectedInterviewId, interviewNotes[selectedInterviewId]);
                        setShowInterviewPanel(false);
                      }}
                    >
                      Save Notes &amp; Close
                    </button>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Row: Notifications & AI Features â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-notifications" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, overflowY: 'auto', maxHeight: '800px' }}>
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">System</span>
                    <h3>Notification Center</h3>
                  </div>
                  <span className="dashboard-pill" style={{ background: notificationsList.filter((n) => !n.read).length > 0 ? '#ffc107' : '#ccc', color: '#fff' }}>
                    {notificationsList.filter((n) => !n.read).length} unread
                  </span>
                </div>

                {/* Notification Channels Settings */}
                <div style={{ marginBottom: '14px', padding: '12px', borderRadius: '10px', background: '#f0fff0', border: '1px solid #90ee90' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#155e3a', marginBottom: '8px' }}>
                    <i className="fa fa-cog" style={{ marginRight: '6px' }}></i>Notification Channels
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        border: notificationChannels.email ? '2px solid #2358d8' : '1px solid #ddd',
                        background: notificationChannels.email ? '#eff6ff' : '#f9f9f9',
                        color: notificationChannels.email ? '#2358d8' : '#666',
                        padding: '6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                      onClick={() => handleToggleNotificationChannel('email')}
                    >
                      <i className="fa fa-envelope" style={{ marginRight: '3px' }}></i>Email {notificationChannels.email ? 'âœ“' : 'âœ—'}
                    </button>
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        border: notificationChannels.push ? '2px solid #2358d8' : '1px solid #ddd',
                        background: notificationChannels.push ? '#eff6ff' : '#f9f9f9',
                        color: notificationChannels.push ? '#2358d8' : '#666',
                        padding: '6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                      onClick={() => handleToggleNotificationChannel('push')}
                    >
                      <i className="fa fa-bell" style={{ marginRight: '3px' }}></i>Push {notificationChannels.push ? 'âœ“' : 'âœ—'}
                    </button>
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        border: notificationChannels.sms ? '2px solid #2358d8' : '1px solid #ddd',
                        background: notificationChannels.sms ? '#eff6ff' : '#f9f9f9',
                        color: notificationChannels.sms ? '#2358d8' : '#666',
                        padding: '6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                      onClick={() => handleToggleNotificationChannel('sms')}
                    >
                      <i className="fa fa-comment" style={{ marginRight: '3px' }}></i>SMS {notificationChannels.sms ? 'âœ“' : 'âœ—'}
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                {notificationsList.length > 0 ? (
                  notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: notif.read ? '#f8fafc' : '#fff9e6',
                        border: notif.read ? '1px solid #e8edf5' : '2px solid #ffc107',
                        marginBottom: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleMarkNotifAsRead(notif.id)}
                    >
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: notif.read ? '#ccc' : '#ffc107',
                            marginTop: '4px',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: notif.read ? 600 : 700, fontSize: '12px', color: '#10203a' }}>
                            {notif.type === 'profile_view' && <i className="fa fa-eye" style={{ marginRight: '5px', color: '#2358d8' }}></i>}
                            {notif.type === 'new_job' && <i className="fa fa-briefcase" style={{ marginRight: '5px', color: '#13a38a' }}></i>}
                            {notif.type === 'application' && <i className="fa fa-file-text-o" style={{ marginRight: '5px', color: '#f59e0b' }}></i>}
                            {notif.type === 'message' && <i className="fa fa-envelope-o" style={{ marginRight: '5px', color: '#64748b' }}></i>}
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{notif.description}</div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap' }}>
                          {Math.floor((Date.now() - new Date(notif.timestamp)) / 3600000)}h ago
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '13px' }}>
                    No notifications. You\\'re all caught up! âœ“
                  </div>
                )}

                {notificationsList.length > 0 && (
                  <button
                    type="button"
                    style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e53e3e', width: '100%', padding: '6px', borderRadius: '4px', fontSize: '11px', marginTop: '8px', fontWeight: 600 }}
                    onClick={handleClearNotifications}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-ai-features" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="card-body" style={{ flex: 1, overflowY: 'auto', maxHeight: '800px', color: '#fff' }}>
                <div className="dashboard-section-heading" style={{ color: '#fff', marginBottom: '14px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow" style={{ color: '#e0e7ff' }}>
                      <i className="fa fa-star" style={{ marginRight: '4px' }}></i>Premium
                    </span>
                    <h3 style={{ color: '#fff' }}>AI & Smart Features</h3>
                  </div>
                  <span className="dashboard-pill" style={{ background: '#ffc107', color: '#333' }}>PRO</span>
                </div>

                {/* AI Job Recommendations */}
                <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <i className="fa fa-lightbulb-o" style={{ marginRight: '6px' }}></i>AI Recommendations
                  </div>
                  {aiRecommendations.slice(0, 2).map((rec) => (
                    <div key={rec.id} style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', marginBottom: '6px', fontSize: '11px' }}>
                      <div style={{ fontWeight: 600 }}>{rec.title}</div>
                      <div style={{ fontSize: '10px', opacity: 0.9 }}>{rec.company}</div>
                      <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ background: '#90ee90', color: '#155e3a', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>
                          {rec.matchScore}% match
                        </div>
                        <span style={{ fontSize: '10px', opacity: 0.8 }}>{rec.reason}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', width: '100%', padding: '4px', borderRadius: '4px', fontSize: '10px', marginTop: '6px' }}
                    onClick={handleGetAIRecommendations}
                  >
                    <i className="fa fa-refresh" style={{ marginRight: '3px' }}></i>Refresh
                  </button>
                </div>

                {/* CV Analysis */}
                <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <i className="fa fa-file-text" style={{ marginRight: '6px' }}></i>CV Analysis
                  </div>
                  {cvUploadProgress > 0 ? (
                    <div>
                      <div style={{ fontSize: '11px', marginBottom: '4px' }}>Analyzing... {cvUploadProgress}%</div>
                      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#90ee90', width: `${cvUploadProgress}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {aiSuggestions.slice(0, 2).map((sug) => (
                        <div key={sug.id} style={{ padding: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: '4px', fontSize: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{sug.category}</span>
                            <span
                              style={{
                                background: sug.priority === 'high' ? '#ff6b6b' : '#ffc107',
                                color: '#fff',
                                padding: '1px 4px',
                                borderRadius: '2px',
                                fontSize: '9px',
                              }}
                            >
                              {sug.priority}
                            </span>
                          </div>
                          <div style={{ marginTop: '2px', opacity: 0.9 }}>{sug.suggestion}</div>
                        </div>
                      ))}
                      <button
                        type="button"
                        style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', width: '100%', padding: '4px', borderRadius: '4px', fontSize: '10px', marginTop: '6px' }}
                        onClick={handleUploadCVForAnalysis}
                      >
                        <i className="fa fa-upload" style={{ marginRight: '3px' }}></i>Analyze CV
                      </button>
                    </>
                  )}
                </div>

                {/* Suggested Skills */}
                <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <i className="fa fa-graduation-cap" style={{ marginRight: '6px' }}></i>Suggested Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {suggestedSkills.slice(0, 4).map((skill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          cursor: 'pointer',
                          border: '1px solid #90ee90',
                          background: 'rgba(144, 238, 144, 0.1)',
                          color: '#90ee90',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 600,
                        }}
                        onClick={() => setActionMessage(`"${skill}" added to learning roadmap.`)}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Letter & Interview */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                    onClick={() => handleGenerateCoverLetter('React Developer')}
                  >
                    <i className="fa fa-file-word-o" style={{ marginRight: '3px' }}></i>Generate Cover Letter
                  </button>
                  <button
                    type="button"
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                    onClick={handleStartMockInterview}
                  >
                    <i className="fa fa-video-camera" style={{ marginRight: '3px' }}></i>Mock Interview
                  </button>
                </div>

                {/* Generated Cover Letter Display */}
                {generatedCoverLetter && (
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '10px', maxHeight: '100px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Generated Cover Letter:</div>
                    <div style={{ opacity: 0.9, lineHeight: '1.4' }}>{generatedCoverLetter.substring(0, 150)}...</div>
                    <button
                      type="button"
                      style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#90ee90', fontSize: '9px', marginTop: '4px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCoverLetter);
                        setActionMessage('Cover letter copied to clipboard.');
                      }}
                    >
                      ðŸ“‹ Copy to Clipboard
                    </button>
                  </div>
                )}

                {/* Mock Interview Section */}
                {mockInterviewActive && currentMockQuestionIndex < mockInterviewQuestions.length && (
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>
                      Question {currentMockQuestionIndex + 1} of {mockInterviewQuestions.length}
                    </div>
                    <div style={{ fontSize: '11px', marginBottom: '8px', fontStyle: 'italic', opacity: 0.95 }}>
                      {mockInterviewQuestions[currentMockQuestionIndex].question}
                    </div>
                    <textarea
                      placeholder="Type your answer..."
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#fff',
                        fontSize: '10px',
                        minHeight: '50px',
                        fontFamily: 'Arial, sans-serif',
                        marginBottom: '6px',
                      }}
                      value={mockAnswers[currentMockQuestionIndex] || ''}
                      onChange={(e) => setMockAnswers((prev) => ({ ...prev, [currentMockQuestionIndex]: e.target.value }))}
                    />
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: '#90ee90',
                        color: '#155e3a',
                        width: '100%',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                      onClick={() => handleSubmitMockAnswer(mockAnswers[currentMockQuestionIndex] || '')}
                    >
                      Next Question â†’
                    </button>
                  </div>
                )}

                {!mockInterviewActive && mockAnswers[0] && (
                  <div style={{ padding: '8px', background: 'rgba(144, 238, 144, 0.1)', borderRadius: '6px', fontSize: '10px', marginTop: '8px', border: '1px solid #90ee90' }}>
                    <div style={{ fontWeight: 600, color: '#90ee90', marginBottom: '4px' }}>âœ“ Interview Complete</div>
                    <div style={{ opacity: 0.9 }}>Review your answers and AI-generated feedback for improvement areas.</div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Row: Applications & Communication â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-applications" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Tracker</span>
                    <h3>Applications</h3>
                  </div>
                  <span className="dashboard-pill">{applications.length} total</span>
                </div>
                <div className="row" style={{ marginBottom: '16px' }}>
                  {applicationsByStatus.map((item) => (
                    <div className="col-6" key={item.status} style={{ marginBottom: '10px' }}>
                      <div style={{ padding: '14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', textAlign: 'center' }}>
                        <strong style={{ fontSize: '24px', color: '#10203a', display: 'block' }}>{item.count}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{application.role}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{application.company} · {application.updatedAt}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`dashboard-pill${application.status === 'Offer' ? ' dashboard-pill--success' : ''}`} style={application.status === 'Rejected' ? { background: '#fff0f0', color: '#e53e3e', borderColor: '#fca5a5' } : {}}>
                        {application.status}
                      </span>
                      {application.status === 'Applied' && (
                        <button
                          type="button"
                          title="Withdraw application"
                          style={{ cursor: 'pointer', border: '1px solid #fca5a5', background: '#fff0f0', color: '#e53e3e', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                          onClick={() => {
                            applyHTTPService.deleteById(application.id)
                              .then(() => {
                                setApplications((prev) => prev.filter((a) => a.id !== application.id));
                                setActionMessage('Application withdrawn.');
                              })
                              .catch(() => {
                                setApplications((prev) => prev.filter((a) => a.id !== application.id));
                                setActionMessage('Application withdrawn locally.');
                              });
                          }}
                        >
                          <i className="fa fa-times" style={{ marginRight: '3px' }}></i>Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '14px' }}>
                  <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '14px', color: '#10203a' }}>Bookmarked jobs</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {jobs.filter((job) => bookmarkedJobs.includes(String(job.id))).map((job) => (
                      <button key={job.id} type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: '#f5f8ff' }} onClick={() => setBookmarkedJobs((prev) => prev.filter((id) => String(id) !== String(job.id)))}>
                        {job.title} <i className="fa fa-times" style={{ marginLeft: '6px', fontSize: '10px' }}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-communication" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Inbox</span>
                    <h3>Communication</h3>
                  </div>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }} onClick={handleMarkAllNotificationsAsRead}>
                    Mark all read
                  </button>
                </div>
                <ul className="dashboard-focus-list" style={{ marginBottom: '20px' }}>
                  {messages.map((message) => (
                    <li key={message.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{message.recruiter}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{message.preview}</div>
                      </div>
                      {message.unread ? <span className="dashboard-pill" style={{ whiteSpace: 'nowrap', fontSize: '11px' }}>Unread</span> : null}
                    </li>
                  ))}
                </ul>
                <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '14px', color: '#10203a' }}>Notifications</strong>
                  <span className="dashboard-pill">{unreadNotifications} unread</span>
                </div>
                {notificationItems.slice(0, 4).map((notificationItem) => (
                  <div key={notificationItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{notificationItem.title}</div>
                      {notificationItem.message ? <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{notificationItem.message}</div> : null}
                    </div>
                    {notificationItem.unread ? (
                      <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', fontSize: '11px', marginLeft: '8px', whiteSpace: 'nowrap' }} onClick={() => handleMarkNotificationAsRead(notificationItem.id)}>
                        Mark read
                      </button>
                    ) : <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '11px', marginLeft: '8px', whiteSpace: 'nowrap' }}>Read</span>}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Row: Interviews & Career Tools â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-interviews" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Scheduling</span>
                    <h3>Interview &amp; Calendar</h3>
                  </div>
                  <span className="dashboard-pill dashboard-pill--success">{invites.length} invites</span>
                </div>
                {invites.map((invite) => (
                  <div key={invite.id} style={{ padding: '14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#10203a' }}>{invite.company}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 10px' }}>{invite.role} Â· {invite.date}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {invite.slots.map((slot) => {
                        const selected = selectedSlots[invite.id] === slot;
                        return (
                          <button
                            key={`${invite.id}-${slot}`}
                            type="button"
                            className="dashboard-pill"
                            style={{ cursor: 'pointer', border: selected ? 'none' : '1px solid #dce6ff', background: selected ? '#2358d8' : '#f5f8ff', color: selected ? '#fff' : '#2358d8' }}
                            onClick={() => setSelectedSlots((prev) => ({ ...prev, [invite.id]: slot }))}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <a href="https://calendar.google.com" className="dashboard-pill" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <i className="fa fa-calendar" style={{ marginRight: '6px' }}></i>Google Calendar
                  </a>
                  <a href="https://outlook.live.com/calendar/" className="dashboard-pill" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <i className="fa fa-calendar-o" style={{ marginRight: '6px' }}></i>Outlook
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-tools" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Growth</span>
                    <h3>Career Tools</h3>
                  </div>
                  <span className="dashboard-pill">Score {resumeScore}/100</span>
                </div>
                <ul className="dashboard-focus-list">
                  <li>
                    <strong>Resume score:</strong> {resumeScore}/100 â€” add quantified impact bullets and role-aligned keywords for stronger match rates.
                  </li>
                  <li>
                    <strong>Skill gaps:</strong>{' '}
                    {missingSkills.length ? missingSkills.join(', ') : 'No major gaps detected.'}
                  </li>
                  <li><strong>Salary insight:</strong> {salaryInsight}</li>
                </ul>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '10px' }}>Interview preparation</div>
                  {interviewResources.map((resource) => (
                    <div key={resource} style={{ padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', fontSize: '13px', color: '#405066', marginBottom: '8px' }}>
                      <i className="fa fa-check-circle" style={{ color: '#13a38a', marginRight: '8px' }}></i>{resource}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Recruiter Lite: Dashboard & Job Posting â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-recruiter-overview" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Recruiter Dashboard</span>
                    <h3>Overview &amp; Recent Applicants</h3>
                  </div>
                  <span className="dashboard-pill dashboard-pill--success">Front Lite</span>
                </div>
                <div className="row" style={{ marginBottom: '16px' }}>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Active jobs</div>
                      <strong style={{ fontSize: '24px', color: '#10203a' }}>{recruiterOverview.activeJobs}</strong>
                    </div>
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Draft jobs</div>
                      <strong style={{ fontSize: '24px', color: '#10203a' }}>{recruiterOverview.draftJobs}</strong>
                    </div>
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Candidates</div>
                      <strong style={{ fontSize: '24px', color: '#10203a' }}>{recruiterOverview.totalCandidates}</strong>
                    </div>
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Shortlisted</div>
                      <strong style={{ fontSize: '24px', color: '#10203a' }}>{recruiterOverview.shortlisted}</strong>
                    </div>
                  </div>
                </div>
                <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '14px', color: '#10203a' }}>Recent applicants</strong>
                  <span className="dashboard-pill">{recentApplicants.length}</span>
                </div>
                {recentApplicants.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{item.candidateName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.role}</div>
                    </div>
                    <span className="dashboard-pill">{item.status}</span>
                  </div>
                ))}
                <div className="dashboard-section-heading" style={{ marginTop: '14px', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: '#10203a' }}>Notifications</strong>
                  <span className="dashboard-pill">{notificationItems.length}</span>
                </div>
                {notificationItems.slice(0, 3).map((item) => (
                  <div key={`lite-notif-${item.id}`} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{item.message}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-job-posting" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Job Posting</span>
                    <h3>Create / Edit / Publish</h3>
                  </div>
                  <span className="dashboard-pill">Simplified UI</span>
                </div>

                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <input
                      className="fo-input"
                      placeholder="Job title"
                      value={jobPostForm.post}
                      onChange={(event) => setJobPostForm((prev) => ({ ...prev, post: event.target.value }))}
                    />
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <input
                      className="fo-input"
                      placeholder="Location"
                      value={jobPostForm.location}
                      onChange={(event) => setJobPostForm((prev) => ({ ...prev, location: event.target.value }))}
                    />
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <input
                      className="fo-input"
                      placeholder="Salary from"
                      value={jobPostForm.salaryFrom}
                      onChange={(event) => setJobPostForm((prev) => ({ ...prev, salaryFrom: event.target.value }))}
                    />
                  </div>
                  <div className="col-6" style={{ marginBottom: '10px' }}>
                    <input
                      className="fo-input"
                      placeholder="Salary to"
                      value={jobPostForm.salaryTo}
                      onChange={(event) => setJobPostForm((prev) => ({ ...prev, salaryTo: event.target.value }))}
                    />
                  </div>
                  <div className="col-12" style={{ marginBottom: '10px' }}>
                    <textarea
                      className="fo-input"
                      rows={2}
                      placeholder="Description"
                      value={jobPostForm.description}
                      onChange={(event) => setJobPostForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#10203a', color: '#fff' }} onClick={() => handleSaveJobPost('draft')}>
                    Save draft
                  </button>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }} onClick={() => handleSaveJobPost('published')}>
                    {editingJobId ? 'Update & publish' : 'Publish'}
                  </button>
                  {editingJobId ? (
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: '#f5f8ff' }}
                      onClick={() => {
                        setEditingJobId('');
                        setJobPostForm({
                          post: '',
                          location: '',
                          jobType: 'Remote',
                          experienceLevel: 'Mid',
                          description: '',
                          requirement: '',
                          salaryFrom: '',
                          salaryTo: '',
                        });
                      }}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>

                <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '14px', color: '#10203a' }}>Posted jobs</strong>
                  <span className="dashboard-pill">{recruiterJobs.length}</span>
                </div>
                {recruiterJobs.slice(0, 6).map((job) => {
                  const status = getJobVisibilityStatus(job);
                  return (
                    <div key={`r-job-${job.id}`} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{job.post || job.position}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{job.location || 'Remote'} Â· {job.jobType || 'Remote'}</div>
                        </div>
                        <span className="dashboard-pill">{status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', fontSize: '11px' }} onClick={() => handleEditJobPost(job)}>Edit</button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#f0fdf4', color: '#0f766e', fontSize: '11px' }} onClick={() => handleChangePublication(job, 'published')}>Publish</button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#fff7ed', color: '#c2410c', fontSize: '11px' }} onClick={() => handleChangePublication(job, 'unpublished')}>Unpublish</button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#f5f8ff', fontSize: '11px' }} onClick={() => handleChangePublication(job, 'draft')}>Save draft</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Recruiter Lite: Candidate Interaction & Talent Search â”€â”€ */}
        <section className="row">
          <div className="col-xl-6" id="member-candidate-interaction" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Candidate Interaction</span>
                    <h3>Applicants Â· Shortlist Â· Reject Â· Message</h3>
                  </div>
                  <span className="dashboard-pill">{visibleApplicants.length} shown</span>
                </div>
                {visibleApplicants.map((item) => (
                  <div key={`applicant-${item.id}`} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{item.candidateName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.role} Â· {item.updatedAt}</div>
                      </div>
                      <span className="dashboard-pill">{item.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#ecfdf3', color: '#0f766e', fontSize: '11px' }} onClick={() => handleUpdateApplicationStatus(item, 'Shortlisted')}>
                        Shortlist
                      </button>
                      <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#fff1f2', color: '#be123c', fontSize: '11px' }} onClick={() => handleUpdateApplicationStatus(item, 'Rejected')}>
                        Reject
                      </button>
                      <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', fontSize: '11px' }} onClick={() => handleMessageCandidate(item)}>
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="col-xl-6" id="member-talent-search" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Talent Search</span>
                    <h3>Front Lite Candidate Discovery</h3>
                  </div>
                  <span className="dashboard-pill">Plan: {talentFilters.plan}</span>
                </div>
                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Name, role or keyword" value={talentFilters.q} onChange={(event) => setTalentFilters((prev) => ({ ...prev, q: event.target.value }))} />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Location" value={talentFilters.location} onChange={(event) => setTalentFilters((prev) => ({ ...prev, location: event.target.value }))} />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <input className="fo-input" placeholder="Skill" value={talentFilters.skill} onChange={(event) => setTalentFilters((prev) => ({ ...prev, skill: event.target.value }))} />
                  </div>
                  <div className="col-6" style={{ marginBottom: '8px' }}>
                    <select className="fo-select" value={talentFilters.plan} onChange={(event) => setTalentFilters((prev) => ({ ...prev, plan: event.target.value }))}>
                      <option value="free">Free (limited profiles)</option>
                      <option value="pro">Pro (full profiles)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }} onClick={handleTalentSearch}>
                    {isTalentLoading ? 'Searching...' : 'Search talent'}
                  </button>
                  <span className="dashboard-pill">{talentSummary.shown}/{talentSummary.totalMatches} shown (limit {talentSummary.limit})</span>
                </div>

                {talentResults.map((candidate) => (
                  <div key={`talent-${candidate.id}`} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e8edf5', background: '#f8fafc', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>{candidate.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{candidate.jobRole || 'Candidate'} Â· {candidate.location || 'N/A'}</div>
                      </div>
                      {candidate.profileLocked ? <span className="dashboard-pill" style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa' }}>Limited</span> : <span className="dashboard-pill dashboard-pill--success">Full</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>{candidate.summary || 'No summary available.'}</div>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#334155' }}>
                      <strong>Skills:</strong> {(candidate.skills || []).slice(0, 4).join(', ') || 'N/A'}
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#334155' }}>
                      <strong>Contact:</strong> {candidate.profileLocked ? 'Upgrade plan to unlock contact details.' : `${candidate.email || 'N/A'} ${candidate.phone ? `Â· ${candidate.phone}` : ''}`}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* â”€â”€ Account Settings â”€â”€ */}
        {/* Career Development — Feature 11 */}
        <section id="member-career-dev" className="row">

          {/* Left: Salary Benchmarks & Role Comparison */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Market Data</span>
                    <h3>Salary Benchmarks</h3>
                  </div>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#eef4ff' }}
                    onClick={handleViewSalaryBenchmarks}
                  >
                    Refresh
                  </button>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e8edf5' }}>
                        <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b', fontWeight: 700 }}>Role</th>
                        <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b', fontWeight: 700 }}>Location</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px', color: '#64748b', fontWeight: 700 }}>Min</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px', color: '#64748b', fontWeight: 700 }}>Avg</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px', color: '#64748b', fontWeight: 700 }}>Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryBenchmarks.map((row) => (
                        <tr key={`${row.role}-${row.location}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px', fontWeight: 600, color: '#10203a' }}>{row.role}</td>
                          <td style={{ padding: '8px', color: '#64748b' }}>{row.location}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#475569' }}>{row.min.toLocaleString()} {row.currency}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#2358d8' }}>{row.avg.toLocaleString()} {row.currency}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#475569' }}>{row.max.toLocaleString()} {row.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#10203a' }}>Role / Location Comparison</strong>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#f0fdf4', color: '#0f766e', fontSize: '11px' }}
                    onClick={handleLoadRoleComparisons}
                  >
                    Compare
                  </button>
                </div>
                {roleComparisons.map((item) => (
                  <div
                    key={`${item.role}-${item.location}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{item.role}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.location} &middot; Avg: {item.avgSalary}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>{item.demand}</span>
                      <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: 700 }}>{item.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Right: Learning Recommendations + Skill Assessments */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">

                <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Progress</span>
                    <h3>Skill Tracker</h3>
                  </div>
                </div>
                {skillProgress.map((s) => (
                  <div key={s.skill} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: '#10203a' }}>{s.skill}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#2358d8', fontWeight: 700 }}>
                          {s.level}% <span style={{ color: '#0f766e', fontSize: '11px' }}>{s.trend}</span>
                        </span>
                        <button
                          type="button"
                          title="Endorse this skill"
                          style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: '#eef4ff', color: '#2358d8', padding: '2px 7px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}
                          onClick={() => handleEndorseSkill(s.skill)}
                        >
                          <i className="fa fa-thumbs-up" style={{ marginRight: '3px' }}></i>{skillEndorsements[s.skill] || 0}
                        </button>
                      </div>
                    </div>
                    <div style={{ height: '6px', borderRadius: '999px', background: '#e8edf5', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, background: s.level >= 70 ? '#13a38a' : s.level >= 40 ? '#2358d8' : '#f59e0b', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}

                <div className="dashboard-section-heading" style={{ marginTop: '18px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#10203a' }}>Skill Assessments</strong>
                </div>
                {assessmentResult && (
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(19,163,138,0.08)', border: '1px solid #13a38a', marginBottom: '12px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#13a38a', marginBottom: '4px' }}>Assessment Complete!</div>
                    <div>Score: <strong>{assessmentResult.score}%</strong> ({assessmentResult.correct}/{assessmentResult.total} correct) — skill level updated.</div>
                  </div>
                )}
                {activeAssessment ? (
                  <div style={{ padding: '14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #dce6ff' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '10px' }}>
                      {activeAssessment} — Q{assessmentStep + 1}/{assessmentQuestions.length}
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155', marginBottom: '10px' }}>
                      {assessmentQuestions[assessmentStep].question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                      {assessmentQuestions[assessmentStep].options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: assessmentAnswers[assessmentQuestions[assessmentStep].id] === idx ? '#2358d8' : '#e8edf5',
                            background: assessmentAnswers[assessmentQuestions[assessmentStep].id] === idx ? '#eef4ff' : '#fff',
                            color: '#334155',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onClick={() => handleAssessmentAnswer(assessmentQuestions[assessmentStep].id, idx)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {assessmentStep < assessmentQuestions.length - 1 ? (
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }}
                          onClick={() => setAssessmentStep((prev) => prev + 1)}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: 'none', background: '#13a38a', color: '#fff' }}
                          onClick={handleSubmitAssessment}
                        >
                          Submit
                        </button>
                      )}
                      <button
                        type="button"
                        className="dashboard-pill"
                        style={{ cursor: 'pointer', border: '1px solid #e8edf5' }}
                        onClick={() => { setActiveAssessment(null); setAssessmentAnswers({}); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {skillProgress.map((s) => (
                      <button
                        key={`assess-${s.skill}`}
                        type="button"
                        className="dashboard-pill"
                        style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: '#f5f8ff' }}
                        onClick={() => handleStartAssessment(s.skill)}
                      >
                        Test {s.skill}
                      </button>
                    ))}
                  </div>
                )}

                <div className="dashboard-section-heading" style={{ marginTop: '18px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#10203a' }}>Learning Recommendations</strong>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#eef4ff', fontSize: '11px' }}
                    onClick={handleGetLearningRecommendations}
                  >
                    Refresh
                  </button>
                </div>
                {learningRecommendations.map((course) => (
                  <div
                    key={course.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#10203a' }}>{course.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {course.provider} &middot; {course.level} &middot; {course.duration}
                      </div>
                    </div>
                    <span className="dashboard-pill" style={{ fontSize: '11px', background: '#f0fdf4', color: '#0f766e', borderColor: '#bbf7d0', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {course.relevance}% match
                    </span>
                  </div>
                ))}

              </div>
            </article>
          </div>
        </section>

        {/* Account & Privacy — Feature 12 */}
        <section id="member-account-privacy" className="row">
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Security</span>
                    <h3>Account Actions</h3>
                  </div>
                  <span className="dashboard-pill" style={{ background: '#f0fdf4', color: '#0f766e', borderColor: '#bbf7d0' }}>
                    <i className="fa fa-shield" style={{ marginRight: '5px' }}></i>Protected
                  </span>
                </div>

                {/* Change Password */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '12px' }}>
                    <i className="fa fa-key" style={{ marginRight: '8px', color: '#2358d8' }}></i>Change Password
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      className="fo-input"
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                      style={{ fontSize: '13px' }}
                    />
                    <input
                      className="fo-input"
                      type="password"
                      placeholder="New password (min 8 characters)"
                      value={passwordForm.newPass}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPass: e.target.value }))}
                      style={{ fontSize: '13px' }}
                    />
                    <input
                      className="fo-input"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                      style={{ fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', alignSelf: 'flex-start' }}
                      onClick={handleChangePassword}
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a' }}>
                        <i className="fa fa-mobile" style={{ marginRight: '8px', color: '#13a38a' }}></i>Two-Factor Authentication
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {security.twoFactorEnabled ? 'Active — your account is protected.' : 'Disabled — enable for extra security.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: security.twoFactorEnabled ? '#13a38a' : '#f5f8ff',
                        color: security.twoFactorEnabled ? '#fff' : '#2358d8',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => {
                        setSecurity((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
                        setActionMessage(security.twoFactorEnabled ? '2FA disabled.' : '2FA enabled — scan QR code in your authenticator app.');
                      }}
                    >
                      {security.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#fff5f5', border: '1px solid #fca5a5' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#be123c', marginBottom: '8px' }}>
                    <i className="fa fa-trash" style={{ marginRight: '8px' }}></i>Delete Account
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                    Permanently remove your account and all associated data. This action cannot be undone.
                  </div>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{ cursor: 'pointer', border: '1px solid #fca5a5', background: '#fff1f2', color: '#be123c' }}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete my account
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#be123c', fontWeight: 600 }}>Type DELETE to confirm:</div>
                      <input
                        className="fo-input"
                        placeholder="Type DELETE"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        style={{ fontSize: '13px', borderColor: '#fca5a5' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: 'none', background: '#be123c', color: '#fff' }}
                          onClick={handleDeleteAccount}
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: '1px solid #e8edf5' }}
                          onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Right: GDPR Download + Profile Visibility + Blocked Companies */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Privacy</span>
                    <h3>Data &amp; Visibility</h3>
                  </div>
                </div>

                {/* GDPR Download */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '6px' }}>
                    <i className="fa fa-download" style={{ marginRight: '8px', color: '#2358d8' }}></i>Download My Data
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                    Export all your personal data as a JSON file (GDPR Article 20 — Right to Data Portability).
                  </div>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff' }}
                    onClick={handleDownloadPersonalData}
                  >
                    <i className="fa fa-download" style={{ marginRight: '6px' }}></i>Export Personal Data
                  </button>
                  {gdprDownloadReady && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#0f766e', fontWeight: 600 }}>
                      <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>Data exported successfully.
                    </div>
                  )}
                </div>

                {/* Profile Visibility */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '10px' }}>
                    <i className="fa fa-eye" style={{ marginRight: '8px', color: '#2358d8' }}></i>Profile Visibility
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { value: 'public', label: 'Public', desc: 'Visible to everyone including search engines' },
                      { value: 'recruiters-only', label: 'Recruiters Only', desc: 'Only logged-in recruiters can view your profile' },
                      { value: 'hidden', label: 'Hidden', desc: 'Your profile is not visible to anyone' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: profileVisibility === opt.value ? '#2358d8' : '#e8edf5',
                          background: profileVisibility === opt.value ? '#eef4ff' : '#fff',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onClick={() => handleChangeProfileVisibility(opt.value)}
                      >
                        <div style={{ fontWeight: 600, fontSize: '12px', color: profileVisibility === opt.value ? '#2358d8' : '#10203a' }}>
                          {profileVisibility === opt.value && <i className="fa fa-dot-circle-o" style={{ marginRight: '6px' }}></i>}
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blocked Companies */}
                <div style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e8edf5' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#10203a', marginBottom: '10px' }}>
                    <i className="fa fa-ban" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Blocked Companies
                    <span className="dashboard-pill" style={{ marginLeft: '8px', fontSize: '11px' }}>{blockedCompanies.length}</span>
                  </div>
                  {blockedCompanies.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748b' }}>No blocked companies.</div>
                  ) : (
                    blockedCompanies.map((company) => (
                      <div
                        key={company}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '10px', background: '#fff', border: '1px solid #e8edf5', marginBottom: '6px' }}
                      >
                        <span style={{ fontSize: '13px', color: '#334155' }}>{company}</span>
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: 'none', background: '#f0fdf4', color: '#0f766e', fontSize: '11px' }}
                          onClick={() => handleUnblockCompany(company)}
                        >
                          Unblock
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </article>
          </div>
        </section>

        {/* Engagement & Retention — Feature 13 */}
        <section id="member-engagement" className="row">

          {/* Left: Missed Jobs + Incomplete Applications */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">

                {/* Jobs You Missed */}
                <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Don't Miss Out</span>
                    <h3>Jobs You Missed</h3>
                  </div>
                  <span className="dashboard-pill" style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontSize: '11px' }}>
                    {missedJobs.length} expired
                  </span>
                </div>
                {missedJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '8px', opacity: 0.85 }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{job.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {job.company} &middot; {job.location} &middot; {job.salary}
                      </div>
                      <div style={{ fontSize: '10px', color: '#c2410c', marginTop: '2px' }}>
                        <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>Closed {job.deadline}
                      </div>
                    </div>
                    <span className="dashboard-pill" style={{ fontSize: '11px', background: '#fef2f2', color: '#be123c', borderColor: '#fca5a5', whiteSpace: 'nowrap' }}>
                      Missed
                    </span>
                  </div>
                ))}

                {/* Incomplete Applications */}
                <div className="dashboard-section-heading" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#10203a' }}>Incomplete Applications</strong>
                  <span className="dashboard-pill" style={{ fontSize: '11px', background: '#fef9c3', color: '#a16207', borderColor: '#fde68a' }}>
                    {incompleteApplications.length} pending
                  </span>
                </div>
                {incompleteApplications.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>All applications are complete.</div>
                ) : (
                  incompleteApplications.map((app) => (
                    <div
                      key={app.id}
                      style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{app.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{app.company} &middot; Last saved {app.lastSaved}</div>
                        </div>
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', fontSize: '11px', whiteSpace: 'nowrap' }}
                          onClick={() => handleContinueApplication(app.id)}
                        >
                          Continue
                        </button>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', background: '#e8edf5', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${app.progress}%`, background: app.progress >= 60 ? '#2358d8' : '#f59e0b', borderRadius: '999px' }} />
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{app.progress}% complete</div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>

          {/* Right: Apply Reminders + Profile Views */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">

                {/* Apply Reminders */}
                <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Never Miss a Deadline</span>
                    <h3>Apply Reminders</h3>
                  </div>
                </div>
                {applyReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#10203a' }}>{reminder.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {reminder.company} &middot; <i className="fa fa-calendar" style={{ marginRight: '3px' }}></i>Due {reminder.dueDate}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dashboard-pill"
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: reminder.enabled ? '#13a38a' : '#f1f5f9',
                        color: reminder.enabled ? '#fff' : '#64748b',
                        whiteSpace: 'nowrap',
                        fontSize: '11px',
                      }}
                      onClick={() => handleToggleReminder(reminder.id)}
                    >
                      <i className={`fa ${reminder.enabled ? 'fa-bell' : 'fa-bell-slash'}`} style={{ marginRight: '5px' }}></i>
                      {reminder.enabled ? 'On' : 'Off'}
                    </button>
                  </div>
                ))}

                {/* Profile Views */}
                <div className="dashboard-section-heading" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Visibility</span>
                    <h3>Who Viewed Your Profile</h3>
                  </div>
                  <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '11px' }}>
                    {profileViews.length} views
                  </span>
                </div>
                {profileViews.map((view, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: view.anonymous ? '#f8fafc' : '#f0fdf4', border: `1px solid ${view.anonymous ? '#e8edf5' : '#bbf7d0'}`, marginBottom: '8px' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: view.anonymous ? '#94a3b8' : '#10203a' }}>
                        {view.anonymous ? (
                          <><i className="fa fa-user-secret" style={{ marginRight: '6px', color: '#94a3b8' }}></i>Anonymous Viewer</>
                        ) : (
                          <><i className="fa fa-building" style={{ marginRight: '6px', color: '#2358d8' }}></i>{view.company}</>
                        )}
                      </div>
                      {!view.anonymous && (
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{view.role}</div>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>{view.date}
                    </div>
                  </div>
                ))}

              </div>
            </article>
          </div>
        </section>

        {/* Power User Actions — Feature 14 */}
        <section id="member-power-user" className="row">

          {/* Left: Job Alerts + Boolean Search */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-chart-card" style={{ height: '100%' }}>
              <div className="card-body">

                {/* Job Alerts */}
                <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Notifications</span>
                    <h3>Job Alerts</h3>
                  </div>
                  <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '11px' }}>
                    {jobAlerts.filter((a) => a.active).length} active
                  </span>
                </div>

                {/* Create Alert Form */}
                <div style={{ padding: '14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #dce6ff', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#10203a', marginBottom: '10px' }}>
                    <i className="fa fa-plus-circle" style={{ marginRight: '6px', color: '#2358d8' }}></i>Create New Alert
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      className="fo-input"
                      placeholder="Job keyword (e.g. React Developer)"
                      value={newAlertForm.keyword}
                      onChange={(e) => setNewAlertForm((prev) => ({ ...prev, keyword: e.target.value }))}
                      style={{ fontSize: '12px' }}
                    />
                    <input
                      className="fo-input"
                      placeholder="Location (or leave blank for Anywhere)"
                      value={newAlertForm.location}
                      onChange={(e) => setNewAlertForm((prev) => ({ ...prev, location: e.target.value }))}
                      style={{ fontSize: '12px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        className="fo-select"
                        value={newAlertForm.frequency}
                        onChange={(e) => setNewAlertForm((prev) => ({ ...prev, frequency: e.target.value }))}
                        style={{ fontSize: '12px', flex: 1 }}
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Instant">Instant</option>
                      </select>
                      <button
                        type="button"
                        className="dashboard-pill"
                        style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', whiteSpace: 'nowrap' }}
                        onClick={handleCreateJobAlert}
                      >
                        Add Alert
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alert List */}
                {jobAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#f8fafc', border: `1px solid ${alert.active ? '#dce6ff' : '#e8edf5'}`, marginBottom: '8px', opacity: alert.active ? 1 : 0.6 }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#10203a' }}>{alert.keyword}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        <i className="fa fa-map-marker" style={{ marginRight: '4px' }}></i>{alert.location} &middot; {alert.frequency}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="dashboard-pill"
                        style={{ cursor: 'pointer', border: 'none', background: alert.active ? '#13a38a' : '#f1f5f9', color: alert.active ? '#fff' : '#64748b', fontSize: '11px' }}
                        onClick={() => handleToggleJobAlert(alert.id)}
                      >
                        {alert.active ? 'On' : 'Off'}
                      </button>
                      <button
                        type="button"
                        className="dashboard-pill"
                        style={{ cursor: 'pointer', border: '1px solid #fca5a5', background: '#fef2f2', color: '#be123c', fontSize: '11px' }}
                        onClick={() => handleDeleteJobAlert(alert.id)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Boolean Search */}
                <div className="dashboard-section-heading" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Advanced</span>
                    <strong style={{ fontSize: '13px', color: '#10203a' }}>Boolean Search</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    className="fo-input"
                    placeholder='e.g. (React OR Vue) AND (Paris OR Remote) NOT Junior'
                    value={booleanQuery}
                    onChange={(e) => setBooleanQuery(e.target.value)}
                    style={{ fontSize: '12px', flex: 1 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleBooleanSearch()}
                  />
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', whiteSpace: 'nowrap' }}
                    onClick={handleBooleanSearch}
                  >
                    Search
                  </button>
                </div>
                {booleanResults.length > 0 && (
                  <div>
                    {booleanResults.map((res) => (
                      <div
                        key={res.id}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '6px' }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '12px', color: '#10203a' }}>{res.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{res.company} &middot; {res.location}</div>
                        </div>
                        <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                          {res.match}% match
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </article>
          </div>

          {/* Right: Tagged Jobs + Success Rate + Export History */}
          <div className="col-xl-6" style={{ marginBottom: '22px' }}>
            <article className="card dashboard-focus-card" style={{ height: '100%' }}>
              <div className="card-body">

                {/* Application Success Rate */}
                <div className="dashboard-section-heading" style={{ marginBottom: '12px' }}>
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Analytics</span>
                    <h3>Application Success Rate</h3>
                  </div>
                  <button
                    type="button"
                    className="dashboard-pill"
                    style={{ cursor: 'pointer', border: 'none', background: '#2358d8', color: '#fff', fontSize: '11px' }}
                    onClick={handleExportApplicationHistory}
                  >
                    <i className="fa fa-download" style={{ marginRight: '5px' }}></i>Export
                  </button>
                </div>
                {exportHistoryReady && (
                  <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(19,163,138,0.08)', border: '1px solid #13a38a', fontSize: '12px', color: '#0f766e', fontWeight: 600, marginBottom: '12px' }}>
                    <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>History exported successfully.
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Applied', value: appSuccessStats.applied, color: '#2358d8', bg: '#eef4ff' },
                    { label: 'Responded', value: appSuccessStats.responded, color: '#0f766e', bg: '#f0fdf4' },
                    { label: 'Interviewed', value: appSuccessStats.interviewed, color: '#7c3aed', bg: '#f5f3ff' },
                    { label: 'Offered', value: appSuccessStats.offered, color: '#b45309', bg: '#fffbeb' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ padding: '12px', borderRadius: '12px', background: stat.bg, textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #dce6ff', textAlign: 'center', marginBottom: '18px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#2358d8' }}>{appSuccessStats.successRate}%</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Response Rate (Responses / Applications)</div>
                </div>

                {/* Tagged / Organized Saved Jobs */}
                <div className="dashboard-section-heading" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#10203a' }}>
                    <i className="fa fa-tags" style={{ marginRight: '7px', color: '#7c3aed' }}></i>Tagged Saved Jobs
                  </strong>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['All', 'Top Pick', 'Research', 'Backup'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="dashboard-pill"
                        style={{
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: jobTagFilter === tag ? '#2358d8' : '#e8edf5',
                          background: jobTagFilter === tag ? '#eef4ff' : '#fff',
                          color: jobTagFilter === tag ? '#2358d8' : '#64748b',
                          fontSize: '10px',
                        }}
                        onClick={() => setJobTagFilter(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                {taggedJobs
                  .filter((j) => jobTagFilter === 'All' || j.tag === jobTagFilter)
                  .map((job) => (
                    <div
                      key={job.id}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e8edf5', marginBottom: '8px' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: '#10203a' }}>{job.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{job.company} &middot; Saved {job.saved}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '8px' }}>
                        <select
                          className="fo-select"
                          value={job.tag}
                          onChange={(e) => handleUpdateJobTag(job.id, e.target.value)}
                          style={{ fontSize: '10px', padding: '3px 6px' }}
                        >
                          <option>Top Pick</option>
                          <option>Research</option>
                          <option>Backup</option>
                        </select>
                        <button
                          type="button"
                          className="dashboard-pill"
                          style={{ cursor: 'pointer', border: '1px solid #fca5a5', background: '#fef2f2', color: '#be123c', fontSize: '10px' }}
                          onClick={() => handleRemoveTaggedJob(job.id)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}

              </div>
            </article>
          </div>
        </section>

        <section id="member-settings" className="row">
          <div className="col-12" style={{ marginBottom: '22px' }}>
            <article className="card">
              <div className="card-body">
                <div className="dashboard-section-heading">
                  <div>
                    <span className="dashboard-section-heading__eyebrow">Preferences</span>
                    <h3>Account Settings</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4" style={{ marginBottom: '14px' }}>
                    <div style={{ padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e8edf5', height: '100%' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#10203a', marginBottom: '14px' }}>
                        <i className="fa fa-lock" style={{ marginRight: '8px', color: '#2358d8' }}></i>Privacy
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: privacy.hideProfile ? '#2358d8' : '#f5f8ff', color: privacy.hideProfile ? '#fff' : '#2358d8' }} onClick={() => setPrivacy((prev) => ({ ...prev, hideProfile: !prev.hideProfile }))}>
                          Hide profile: {privacy.hideProfile ? 'On' : 'Off'}
                        </button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: privacy.anonymizeProfile ? '#2358d8' : '#f5f8ff', color: privacy.anonymizeProfile ? '#fff' : '#2358d8' }} onClick={() => setPrivacy((prev) => ({ ...prev, anonymizeProfile: !prev.anonymizeProfile }))}>
                          Anonymize: {privacy.anonymizeProfile ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" style={{ marginBottom: '14px' }}>
                    <div style={{ padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e8edf5', height: '100%' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#10203a', marginBottom: '14px' }}>
                        <i className="fa fa-bell" style={{ marginRight: '8px', color: '#2358d8' }}></i>Notifications
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: notifications.emailAlerts ? '#2358d8' : '#f5f8ff', color: notifications.emailAlerts ? '#fff' : '#2358d8' }} onClick={() => setNotifications((prev) => ({ ...prev, emailAlerts: !prev.emailAlerts }))}>
                          Email alerts: {notifications.emailAlerts ? 'On' : 'Off'}
                        </button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: notifications.pushAlerts ? '#2358d8' : '#f5f8ff', color: notifications.pushAlerts ? '#fff' : '#2358d8' }} onClick={() => setNotifications((prev) => ({ ...prev, pushAlerts: !prev.pushAlerts }))}>
                          Push alerts: {notifications.pushAlerts ? 'On' : 'Off'}
                        </button>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: notifications.recruiterMessages ? '#2358d8' : '#f5f8ff', color: notifications.recruiterMessages ? '#fff' : '#2358d8' }} onClick={() => setNotifications((prev) => ({ ...prev, recruiterMessages: !prev.recruiterMessages }))}>
                          Recruiter messages: {notifications.recruiterMessages ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" style={{ marginBottom: '14px' }}>
                    <div style={{ padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e8edf5', height: '100%' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#10203a', marginBottom: '14px' }}>
                        <i className="fa fa-shield" style={{ marginRight: '8px', color: '#2358d8' }}></i>Security
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button type="button" className="dashboard-pill" style={{ cursor: 'pointer', border: '1px solid #dce6ff', background: security.twoFactorEnabled ? '#13a38a' : '#f5f8ff', color: security.twoFactorEnabled ? '#fff' : '#2358d8' }} onClick={() => setSecurity((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}>
                          2FA: {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                        <Link className="dashboard-pill" to="/frontoffice/login" style={{ textDecoration: 'none', textAlign: 'center' }}>
                          <i className="fa fa-key" style={{ marginRight: '6px' }}></i>Change Password
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

      </div>
        </div>
      </div>
    </FrontOfficeLayout>
  );
};

export default FrontOfficeMemberHubNative;

