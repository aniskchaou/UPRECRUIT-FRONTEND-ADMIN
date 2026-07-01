import http from '../../libraries/axios/axios';
import BASE_URL from '../urls/urls';

const login = (payload) => http.post(`${BASE_URL}/api/recruiter/login`, payload);
const register = (payload) => http.post(`${BASE_URL}/api/recruiter/register`, payload);
const getWorkspace = (recruiterId) => http.get(`${BASE_URL}/api/recruiter/workspace/${recruiterId}`);
const createCompanyAccount = (recruiterId, payload) => http.post(`${BASE_URL}/api/recruiter/${recruiterId}/company/create`, payload);
const joinCompanyAccount = (recruiterId, payload) => http.post(`${BASE_URL}/api/recruiter/${recruiterId}/company/join`, payload);
const switchCompany = (recruiterId, companyId) => http.put(`${BASE_URL}/api/recruiter/${recruiterId}/switch-company`, { companyId });
const updateRecruiterProfile = (recruiterId, payload) => http.put(`${BASE_URL}/api/recruiter/${recruiterId}/profile`, payload);
const inviteTeamMember = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/invite`, payload);
const removeTeamMember = (companyId, memberId) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/team/${memberId}`);
const assignRolePermission = (companyId, memberId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/team/${memberId}/role`, payload);
const listCompanyJobs = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/jobs`);
const createCompanyJob = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/jobs`, payload);
const updateCompanyJob = (companyId, jobId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}`, payload);
const publishCompanyJob = (companyId, jobId) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}/publish`);
const pauseCompanyJob = (companyId, jobId) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}/pause`);
const deleteCompanyJob = (companyId, jobId) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}`);
const duplicateCompanyJob = (companyId, jobId) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}/duplicate`);
const assignRecruiterToApplicant = (companyId, applicationId, recruiterId) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/assign-recruiter`, { recruiterId });
const listAssessmentTemplates = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/assessment-templates`);
const createAssessmentTemplate = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/assessment-templates`, payload);
const negotiateJobOffer = (companyId, offerId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/offers/${offerId}/negotiate`, payload);
const updateCompanyProfile = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/profile`, payload);
const uploadCompanyMedia = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/media`, payload);
const addOfficeLocation = (companyId, location) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/location`, { location });
const updateCompanyVisibility = (companyId, visibility) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/visibility`, { visibility });
const respondToCompanyReview = (companyId, reviewId, response) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/reviews/${reviewId}/respond`, { response });
const getApplicants = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/applicants`, { params });
const openApplicantProfile = (companyId, applicationId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/profile`);
const downloadApplicantResume = (companyId, applicationId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/resume`);
const addApplicantNote = (companyId, applicationId, note) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/notes`, { note });
const tagApplicant = (companyId, applicationId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/tag`, payload);
const moveApplicantStage = (companyId, applicationId, stage) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/stage`, { stage });
const bulkMoveApplicants = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/bulk-stage`, payload);
const rejectApplicant = (companyId, applicationId, reason) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/reject`, { reason });
const reopenApplicant = (companyId, applicationId, stage = 'Screening') => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/reopen`, { stage });
const searchCandidates = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/search`, { params });
const openCandidateProfile = (companyId, candidateId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/profile`);
const shortlistCandidate = (companyId, candidateId) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/shortlist`);
const createTalentPool = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/talent-pools`, payload);
const addCandidateToTalentPool = (companyId, candidateId, poolName) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/talent-pool`, { poolName });
const removeCandidateFromTalentPool = (companyId, candidateId, poolName) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/talent-pool`, { data: { poolName } });
const tagCandidateCRM = (companyId, candidateId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/crm-tags`, payload);
const getCandidateHistory = (companyId, candidateId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/history`);
const reengageCandidate = (companyId, candidateId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/reengage`, payload);
const contactPassiveCandidate = (companyId, candidateId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/candidates/${candidateId}/outreach`, payload);
const generateAIJobDescription = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/job-description`, payload);
const getRecommendedCandidatesForJob = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/recommended-candidates`, payload);
const getCandidateMatchScoreAI = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/candidate-match-score`, payload);
const autoRankApplicantsAI = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/auto-rank-applicants`, payload);
const generateInterviewQuestionsAI = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/interview-questions`, payload);
const generateOutreachMessageAI = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/outreach-message`, payload);
const predictCandidateSuccessAI = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/ai/predict-success`, payload);
const getPipelineSettings = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/settings/pipeline`);
const configurePipelineStages = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/settings/pipeline`, payload);
const getApplicationFormConfig = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/settings/application-form`);
const saveApplicationFormConfig = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/settings/application-form`, payload);
const getTeamPermissions = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/settings/team-permissions`);
const updateTeamPermissions = (companyId, memberId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/settings/team-permissions/${memberId}`, payload);
const getDefaultEmailTemplates = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/settings/email-templates`);
const saveDefaultEmailTemplate = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/settings/email-templates`, payload);
const getIntegrations = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/settings/integrations`);
const saveIntegration = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/settings/integrations`, payload);
const removeIntegration = (companyId, integrationId) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/settings/integrations/${integrationId}`);
const getAutomationRules = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/automation/rules`);
const createAutoMoveRule = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/automation/rules/auto-move`, payload);
const createAutoRejectRule = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/automation/rules/auto-reject`, payload);
const scheduleFollowUpEmailAutomation = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/automation/follow-up`, payload);
const triggerReminderForInactive = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/automation/reminder`, payload);
const getHiringWorkflows = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/automation/workflows`);
const createHiringWorkflow = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/automation/workflows`, payload);
const deleteAutomationRule = (companyId, ruleId) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/automation/rules/${ruleId}`);
const getCandidateMessages = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/messages`, { params });
const sendCandidateMessage = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/messages/send`, payload);
const replyCandidateMessage = (companyId, messageId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/messages/${messageId}/reply`, payload);
const sendBulkMessages = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/messages/bulk`, payload);
const getMessageTemplates = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/message-templates`);
const saveMessageTemplate = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/message-templates`, payload);
const sendInterviewInvitation = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/email/interview-invite`, payload);
const sendRejectionEmail = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/email/rejection`, payload);
const sendFollowUpEmail = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/email/follow-up`, payload);
const createAutomatedSequence = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/email/sequences`, payload);
const getAutomatedSequences = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/email/sequences`);
const assignAutomatedSequence = (companyId, sequenceId, candidateId) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/email/sequences/${sequenceId}/assign`, { candidateId });
const getInterviews = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/interviews`, { params });
const scheduleInterview = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/interviews`, payload);
const syncInterviewCalendar = (companyId, interviewId, calendarProvider) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/sync-calendar`, { calendarProvider });
const rescheduleInterview = (companyId, interviewId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/reschedule`, payload);
const cancelInterview = (companyId, interviewId, reason) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/cancel`, { reason });
const updateInterviewNotes = (companyId, interviewId, notes) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/notes`, { notes });
const saveInterviewFeedback = (companyId, interviewId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/feedback`, payload);
const shareInterviewFeedback = (companyId, interviewId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/interviews/${interviewId}/share-feedback`, payload);
const getScreeningAnswers = (companyId, applicationId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/screening-answers`);
const updateCandidateRating = (companyId, applicationId, rating) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/rating`, { rating });
const saveStructuredFeedback = (companyId, applicationId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/structured-feedback`, payload);
const compareCandidates = (companyId, applicationIds) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/compare`, { applicationIds });
const assignAssessment = (companyId, applicationId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/assessments`, payload);
const getAssessmentResults = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/assessments`, { params });
const reviewAssessmentResult = (companyId, assessmentId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/assessments/${assessmentId}/review`, payload);
const markCandidateSelected = (companyId, applicationId, payload = {}) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/select`, payload);
const createJobOffer = (companyId, applicationId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/offers`, payload);
const getJobOffers = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/offers`, { params });
const attachOfferLetter = (companyId, offerId, offerLetterUrl) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/offers/${offerId}/attach-letter`, { offerLetterUrl });
const updateOfferStatus = (companyId, offerId, status, decisionReason = '') => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/offers/${offerId}/status`, { status, decisionReason });
const markCandidateHired = (companyId, applicationId, payload = {}) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/applicants/${applicationId}/hire`, payload);
const closeJobPosting = (companyId, jobId, payload = {}) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/jobs/${jobId}/close`, payload);
const getJobPerformanceReport = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/analytics/job-performance`, { params });
const getHiringMetricsReport = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/analytics/hiring-metrics`);
const getTeamPerformanceReport = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/analytics/team-performance`);
const saveHiringManagerFeedback = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/analytics/hiring-manager-feedback`, payload);
const getSubscription = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/subscription`);
const updateSubscriptionPlan = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/plan`, payload);
const purchaseJobCredits = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/job-credits/purchase`, payload);
const payFeaturedListing = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/featured-listings/pay`, payload);
const getBillingInvoices = (companyId, params = {}) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/invoices`, { params });
const downloadInvoice = (companyId, invoiceId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/invoices/${invoiceId}/download`);
const getPaymentMethods = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/payment-methods`);
const addPaymentMethod = (companyId, payload) => http.post(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/payment-methods`, payload);
const removePaymentMethod = (companyId, methodId) => http.delete(`${BASE_URL}/api/recruiter/company/${companyId}/subscription/payment-methods/${methodId}`);
const getNotifications = (companyId) => http.get(`${BASE_URL}/api/recruiter/company/${companyId}/notifications`);
const updateNotificationSettings = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/notifications/settings`, payload);
const updateNotificationChannels = (companyId, payload) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/notifications/channels`, payload);
const markNotificationAsRead = (companyId, notificationId) => http.put(`${BASE_URL}/api/recruiter/company/${companyId}/notifications/${notificationId}/read`);

export default {
    login,
    register,
    getWorkspace,
    createCompanyAccount,
    joinCompanyAccount,
    switchCompany,
    updateRecruiterProfile,
    inviteTeamMember,
    assignRolePermission,
    updateCompanyProfile,
    uploadCompanyMedia,
    addOfficeLocation,
    updateCompanyVisibility,
    respondToCompanyReview,
    getApplicants,
    openApplicantProfile,
    downloadApplicantResume,
    addApplicantNote,
    tagApplicant,
    moveApplicantStage,
    bulkMoveApplicants,
    rejectApplicant,
    reopenApplicant,
    searchCandidates,
    openCandidateProfile,
    shortlistCandidate,
    createTalentPool,
    addCandidateToTalentPool,
    removeCandidateFromTalentPool,
    tagCandidateCRM,
    getCandidateHistory,
    reengageCandidate,
    contactPassiveCandidate,
    generateAIJobDescription,
    getRecommendedCandidatesForJob,
    getCandidateMatchScoreAI,
    autoRankApplicantsAI,
    generateInterviewQuestionsAI,
    generateOutreachMessageAI,
    predictCandidateSuccessAI,
    getCandidateMessages,
    sendCandidateMessage,
    replyCandidateMessage,
    sendBulkMessages,
    getMessageTemplates,
    saveMessageTemplate,
    sendInterviewInvitation,
    sendRejectionEmail,
    sendFollowUpEmail,
    createAutomatedSequence,
    getAutomatedSequences,
    assignAutomatedSequence,
    getInterviews,
    scheduleInterview,
    syncInterviewCalendar,
    rescheduleInterview,
    cancelInterview,
    updateInterviewNotes,
    saveInterviewFeedback,
    shareInterviewFeedback,
    getScreeningAnswers,
    updateCandidateRating,
    saveStructuredFeedback,
    compareCandidates,
    assignAssessment,
    getAssessmentResults,
    reviewAssessmentResult,
    markCandidateSelected,
    createJobOffer,
    getJobOffers,
    attachOfferLetter,
    updateOfferStatus,
    markCandidateHired,
    closeJobPosting,
    getJobPerformanceReport,
    getHiringMetricsReport,
    getTeamPerformanceReport,
    saveHiringManagerFeedback,
    getSubscription,
    updateSubscriptionPlan,
    purchaseJobCredits,
    payFeaturedListing,
    getBillingInvoices,
    downloadInvoice,
    getPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    getNotifications,
    updateNotificationSettings,
    updateNotificationChannels,
    markNotificationAsRead,
    getPipelineSettings,
    configurePipelineStages,
    getApplicationFormConfig,
    saveApplicationFormConfig,
    getTeamPermissions,
    updateTeamPermissions,
    getDefaultEmailTemplates,
    saveDefaultEmailTemplate,
    getIntegrations,
    saveIntegration,
    removeIntegration,
    getAutomationRules,
    createAutoMoveRule,
    createAutoRejectRule,
    scheduleFollowUpEmailAutomation,
    triggerReminderForInactive,
    getHiringWorkflows,
    createHiringWorkflow,
    deleteAutomationRule,
    removeTeamMember,
    listCompanyJobs,
    createCompanyJob,
    updateCompanyJob,
    publishCompanyJob,
    pauseCompanyJob,
    deleteCompanyJob,
    duplicateCompanyJob,
    assignRecruiterToApplicant,
    listAssessmentTemplates,
    createAssessmentTemplate,
    negotiateJobOffer,
};
