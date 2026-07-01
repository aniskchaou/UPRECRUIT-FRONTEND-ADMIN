const {
    getWorkspace,
    loginRecruiter,
    registerRecruiter,
    createCompanyAccount,
    joinCompanyAccount,
    inviteTeamMember,
    assignRolePermission,
    switchCompany,
    updateRecruiterProfile,
    updateCompanyProfile,
    uploadCompanyMedia,
    addOfficeLocation,
    setCompanyVisibility,
    respondToReview,
    listApplicantsByJob,
    getApplicantProfile,
    downloadApplicantResume,
    addApplicantNote,
    tagApplicant,
    moveApplicantStage,
    bulkMoveApplicants,
    rejectApplicant,
    reopenRejectedApplicant,
    listCandidateDatabase,
    getCandidateProfile,
    saveCandidateToShortlist,
    addCandidateToTalentPool,
    removeCandidateFromTalentPool,
    createTalentPool,
    tagCandidateInCRM,
    getCandidateHistory,
    reengagePastCandidate,
    generateAIJobDescription,
    recommendCandidatesForJob,
    getCandidateMatchScore,
    autoRankApplicants,
    generateInterviewQuestionsAI,
    generateOutreachMessageAI,
    predictCandidateSuccess,
    contactPassiveCandidate,
    listCandidateMessages,
    sendCandidateMessage,
    replyToCandidateMessage,
    listMessageTemplates,
    saveMessageTemplate,
    sendBulkMessages,
    sendInterviewInvitation,
    sendRejectionEmail,
    sendFollowUpEmail,
    createAutomatedSequence,
    listAutomatedSequences,
    assignSequenceToCandidate,
    inviteCandidateToInterview,
    listInterviews,
    syncInterviewCalendar,
    rescheduleInterview,
    cancelInterview,
    addInterviewNotes,
    addInterviewFeedback,
    shareInterviewFeedback,
    reviewScreeningAnswers,
    rateCandidate,
    leaveStructuredFeedback,
    compareCandidates,
    assignAssessment,
    reviewAssessmentResult,
    listAssessmentResults,
    markCandidateSelected,
    createJobOffer,
    attachOfferLetter,
    updateOfferStatus,
    listJobOffers,
    markCandidateHired,
    closeJobPosting,
    getJobPerformanceReport,
    getHiringMetricsReport,
    saveHiringManagerFeedback,
    getTeamPerformanceReport,
    getSubscriptionOverview,
    changeSubscriptionPlan,
    purchaseJobCredits,
    payForFeaturedListing,
    listBillingInvoices,
    downloadInvoice,
    listPaymentMethods,
    savePaymentMethod,
    removePaymentMethod,
    getNotificationCenter,
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
    scheduleFollowUpEmail,
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
} = require('../../services/recruiter.portal.services');

exports.login = (req, res) => {
    const recruiter = loginRecruiter(req.body || {});
    if (!recruiter) {
        res.status(401).send({ message: 'Invalid recruiter credentials.' });
        return;
    }

    res.send(recruiter);
};

exports.register = (req, res) => {
    const created = registerRecruiter(req.body || {});
    if (created && created.error) {
        res.status(400).send({ message: created.error });
        return;
    }

    res.send(created);
};

exports.findWorkspace = (req, res) => {
    const workspace = getWorkspace(req.params.recruiterId);
    if (!workspace) {
        res.status(404).send({ message: 'Recruiter workspace not found.' });
        return;
    }

    res.send(workspace);
};

exports.createCompany = (req, res) => {
    const created = createCompanyAccount(req.params.recruiterId, req.body || {});
    if (!created) {
        res.status(404).send({ message: 'Recruiter not found.' });
        return;
    }

    res.send(created);
};

exports.joinCompany = (req, res) => {
    const joined = joinCompanyAccount(req.params.recruiterId, req.body || {});
    if (!joined) {
        res.status(404).send({ message: 'Recruiter not found.' });
        return;
    }

    if (joined.error) {
        res.status(404).send({ message: joined.error });
        return;
    }

    res.send(joined);
};

exports.inviteTeamMember = (req, res) => {
    const invitation = inviteTeamMember(req.params.companyId, req.body || {});
    if (!invitation) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(invitation);
};

exports.assignRole = (req, res) => {
    const updated = assignRolePermission(req.params.companyId, req.params.memberId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Team member not found.' });
        return;
    }

    res.send(updated);
};

exports.switchCompany = (req, res) => {
    const updated = switchCompany(req.params.recruiterId, req.body && req.body.companyId);
    if (!updated) {
        res.status(404).send({ message: 'Recruiter not found.' });
        return;
    }

    if (updated.error) {
        res.status(400).send({ message: updated.error });
        return;
    }

    res.send(updated);
};

exports.updateProfile = (req, res) => {
    const updated = updateRecruiterProfile(req.params.recruiterId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Recruiter not found.' });
        return;
    }

    res.send(updated);
};

exports.updateCompanyProfile = (req, res) => {
    const updated = updateCompanyProfile(req.params.companyId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(updated);
};

exports.uploadMedia = (req, res) => {
    const updated = uploadCompanyMedia(req.params.companyId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(updated);
};

exports.addLocation = (req, res) => {
    const updated = addOfficeLocation(req.params.companyId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(updated);
};

exports.updateVisibility = (req, res) => {
    const updated = setCompanyVisibility(req.params.companyId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(updated);
};

exports.respondReview = (req, res) => {
    const updated = respondToReview(req.params.companyId, req.params.reviewId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }

    res.send(updated);
};

exports.listApplicants = (req, res) => {
    const result = listApplicantsByJob(req.params.companyId, req.query || {});
    res.send(result);
};

exports.openApplicantProfile = (req, res) => {
    const profile = getApplicantProfile(req.params.companyId, req.params.applicationId);
    if (!profile) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(profile);
};

exports.downloadResume = (req, res) => {
    const resume = downloadApplicantResume(req.params.companyId, req.params.applicationId);
    if (!resume) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(resume);
};

exports.addNote = (req, res) => {
    const updated = addApplicantNote(req.params.companyId, req.params.applicationId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Applicant not found or note missing.' });
        return;
    }

    res.send(updated);
};

exports.tagCandidate = (req, res) => {
    const updated = tagApplicant(req.params.companyId, req.params.applicationId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(updated);
};

exports.moveStage = (req, res) => {
    const updated = moveApplicantStage(req.params.companyId, req.params.applicationId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(updated);
};

exports.bulkMoveStage = (req, res) => {
    const result = bulkMoveApplicants(req.params.companyId, req.body || {});
    res.send(result);
};

exports.rejectCandidate = (req, res) => {
    const updated = rejectApplicant(req.params.companyId, req.params.applicationId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(updated);
};

exports.reopenCandidate = (req, res) => {
    const updated = reopenRejectedApplicant(req.params.companyId, req.params.applicationId, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(updated);
};

exports.searchCandidates = (req, res) => {
    const result = listCandidateDatabase(req.params.companyId, req.query || {});
    res.send(result);
};

exports.openCandidateProfile = (req, res) => {
    const profile = getCandidateProfile(req.params.companyId, req.params.candidateId);
    if (!profile) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(profile);
};

exports.shortlistCandidate = (req, res) => {
    const shortlist = saveCandidateToShortlist(req.params.companyId, req.params.candidateId);
    if (!shortlist) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(shortlist);
};

exports.addToTalentPool = (req, res) => {
    const pool = addCandidateToTalentPool(req.params.companyId, req.params.candidateId, req.body || {});
    if (!pool) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(pool);
};

exports.sendOutreach = (req, res) => {
    const message = contactPassiveCandidate(req.params.companyId, req.params.candidateId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(message);
};

exports.createPool = (req, res) => {
    const pool = createTalentPool(req.params.companyId, req.body || {});
    if (pool && pool.error) {
        res.status(400).send({ message: pool.error });
        return;
    }

    res.send(pool);
};

exports.removeFromTalentPool = (req, res) => {
    const pool = removeCandidateFromTalentPool(req.params.companyId, req.params.candidateId, req.body || {});
    if (!pool) {
        res.status(404).send({ message: 'Pool not found.' });
        return;
    }

    res.send(pool);
};

exports.crmTagCandidate = (req, res) => {
    const candidate = tagCandidateInCRM(req.params.companyId, req.params.candidateId, req.body || {});
    if (!candidate) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(candidate);
};

exports.findCandidateHistory = (req, res) => {
    const history = getCandidateHistory(req.params.companyId, req.params.candidateId);
    if (!history) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(history);
};

exports.reengageCandidate = (req, res) => {
    const message = reengagePastCandidate(req.params.companyId, req.params.candidateId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(message);
};

exports.aiGenerateJobDescription = (req, res) => {
    const result = generateAIJobDescription(req.params.companyId, req.body || {});
    res.send(result);
};

exports.aiRecommendCandidates = (req, res) => {
    const result = recommendCandidatesForJob(req.params.companyId, req.body || {});
    res.send(result);
};

exports.aiCandidateMatchScore = (req, res) => {
    const result = getCandidateMatchScore(req.params.companyId, req.body || {});
    if (!result) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(result);
};

exports.aiAutoRankApplicants = (req, res) => {
    const result = autoRankApplicants(req.params.companyId, req.body || {});
    res.send(result);
};

exports.aiInterviewQuestions = (req, res) => {
    const result = generateInterviewQuestionsAI(req.params.companyId, req.body || {});
    res.send(result);
};

exports.aiOutreachMessage = (req, res) => {
    const result = generateOutreachMessageAI(req.params.companyId, req.body || {});
    res.send(result);
};

exports.aiPredictCandidateSuccess = (req, res) => {
    const result = predictCandidateSuccess(req.params.companyId, req.body || {});
    if (!result) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(result);
};

exports.listMessages = (req, res) => {
    const result = listCandidateMessages(req.params.companyId, req.query || {});
    res.send(result);
};

exports.sendMessage = (req, res) => {
    const message = sendCandidateMessage(req.params.companyId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found or invalid payload.' });
        return;
    }

    res.send(message);
};

exports.replyMessage = (req, res) => {
    const message = replyToCandidateMessage(req.params.companyId, req.params.messageId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Original message not found.' });
        return;
    }

    res.send(message);
};

exports.findMessageTemplates = (req, res) => {
    const templates = listMessageTemplates(req.params.companyId);
    res.send(templates);
};

exports.saveTemplate = (req, res) => {
    const template = saveMessageTemplate(req.params.companyId, req.body || {});
    if (template && template.error) {
        res.status(400).send({ message: template.error });
        return;
    }

    res.send(template);
};

exports.sendBulk = (req, res) => {
    const result = sendBulkMessages(req.params.companyId, req.body || {});
    res.send(result);
};

exports.sendInterviewInvite = (req, res) => {
    const message = sendInterviewInvitation(req.params.companyId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(message);
};

exports.sendRejection = (req, res) => {
    const message = sendRejectionEmail(req.params.companyId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(message);
};

exports.sendFollowUp = (req, res) => {
    const message = sendFollowUpEmail(req.params.companyId, req.body || {});
    if (!message) {
        res.status(404).send({ message: 'Candidate not found.' });
        return;
    }

    res.send(message);
};

exports.createSequence = (req, res) => {
    const sequence = createAutomatedSequence(req.params.companyId, req.body || {});
    if (sequence && sequence.error) {
        res.status(400).send({ message: sequence.error });
        return;
    }

    res.send(sequence);
};

exports.listSequences = (req, res) => {
    const sequences = listAutomatedSequences(req.params.companyId);
    res.send(sequences);
};

exports.assignSequence = (req, res) => {
    const sequence = assignSequenceToCandidate(req.params.companyId, req.params.sequenceId, req.body || {});
    if (!sequence) {
        res.status(404).send({ message: 'Sequence or candidate not found.' });
        return;
    }

    res.send(sequence);
};

exports.scheduleInterview = (req, res) => {
    const interview = inviteCandidateToInterview(req.params.companyId, req.body || {});
    if (!interview) {
        res.status(404).send({ message: 'Candidate/application not found.' });
        return;
    }

    res.send(interview);
};

exports.listInterviewSchedules = (req, res) => {
    const result = listInterviews(req.params.companyId, req.query || {});
    res.send(result);
};

exports.syncInterview = (req, res) => {
    const interview = syncInterviewCalendar(req.params.companyId, req.params.interviewId, req.body || {});
    if (!interview) {
        res.status(404).send({ message: 'Interview not found.' });
        return;
    }

    res.send(interview);
};

exports.rescheduleInterview = (req, res) => {
    const interview = rescheduleInterview(req.params.companyId, req.params.interviewId, req.body || {});
    if (!interview) {
        res.status(404).send({ message: 'Interview not found.' });
        return;
    }

    res.send(interview);
};

exports.cancelInterview = (req, res) => {
    const interview = cancelInterview(req.params.companyId, req.params.interviewId, req.body || {});
    if (!interview) {
        res.status(404).send({ message: 'Interview not found.' });
        return;
    }

    res.send(interview);
};

exports.updateInterviewNotes = (req, res) => {
    const interview = addInterviewNotes(req.params.companyId, req.params.interviewId, req.body || {});
    if (!interview) {
        res.status(404).send({ message: 'Interview not found.' });
        return;
    }

    res.send(interview);
};

exports.saveInterviewFeedback = (req, res) => {
    const feedback = addInterviewFeedback(req.params.companyId, req.params.interviewId, req.body || {});
    if (!feedback) {
        res.status(404).send({ message: 'Interview not found.' });
        return;
    }

    res.send(feedback);
};

exports.shareFeedbackWithTeam = (req, res) => {
    const feedback = shareInterviewFeedback(req.params.companyId, req.params.interviewId, req.body || {});
    if (!feedback) {
        res.status(404).send({ message: 'Interview feedback not found.' });
        return;
    }

    res.send(feedback);
};

exports.getScreeningAnswers = (req, res) => {
    const answers = reviewScreeningAnswers(req.params.companyId, req.params.applicationId);
    if (!answers) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(answers);
};

exports.updateCandidateRating = (req, res) => {
    const candidate = rateCandidate(req.params.companyId, req.params.applicationId, req.body || {});
    if (!candidate) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(candidate);
};

exports.saveStructuredCandidateFeedback = (req, res) => {
    const feedback = leaveStructuredFeedback(req.params.companyId, req.params.applicationId, req.body || {});
    if (!feedback) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(feedback);
};

exports.compareCandidatesSideBySide = (req, res) => {
    const result = compareCandidates(req.params.companyId, req.body || {});
    res.send(result);
};

exports.assignCandidateAssessment = (req, res) => {
    const assessment = assignAssessment(req.params.companyId, req.params.applicationId, req.body || {});
    if (!assessment) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(assessment);
};

exports.reviewAssessment = (req, res) => {
    const assessment = reviewAssessmentResult(req.params.companyId, req.params.assessmentId, req.body || {});
    if (!assessment) {
        res.status(404).send({ message: 'Assessment not found.' });
        return;
    }

    res.send(assessment);
};

exports.listAssessmentReviews = (req, res) => {
    const result = listAssessmentResults(req.params.companyId, req.query || {});
    res.send(result);
};

exports.selectCandidate = (req, res) => {
    const candidate = markCandidateSelected(req.params.companyId, req.params.applicationId, req.body || {});
    if (!candidate) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(candidate);
};

exports.sendJobOffer = (req, res) => {
    const offer = createJobOffer(req.params.companyId, req.params.applicationId, req.body || {});
    if (!offer) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(offer);
};

exports.listOffers = (req, res) => {
    const result = listJobOffers(req.params.companyId, req.query || {});
    res.send(result);
};

exports.uploadOfferLetter = (req, res) => {
    const offer = attachOfferLetter(req.params.companyId, req.params.offerId, req.body || {});
    if (!offer) {
        res.status(404).send({ message: 'Offer not found.' });
        return;
    }

    res.send(offer);
};

exports.changeOfferStatus = (req, res) => {
    const offer = updateOfferStatus(req.params.companyId, req.params.offerId, req.body || {});
    if (!offer) {
        res.status(404).send({ message: 'Offer not found.' });
        return;
    }

    res.send(offer);
};

exports.hireCandidate = (req, res) => {
    const candidate = markCandidateHired(req.params.companyId, req.params.applicationId, req.body || {});
    if (!candidate) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }

    res.send(candidate);
};

exports.closeJob = (req, res) => {
    const posting = closeJobPosting(req.params.companyId, req.params.jobId, req.body || {});
    if (!posting) {
        res.status(404).send({ message: 'Job posting not found.' });
        return;
    }

    res.send(posting);
};

exports.jobPerformanceReport = (req, res) => {
    const result = getJobPerformanceReport(req.params.companyId, req.query || {});
    res.send(result);
};

exports.hiringMetricsReport = (req, res) => {
    const result = getHiringMetricsReport(req.params.companyId);
    res.send(result);
};

exports.teamPerformanceReport = (req, res) => {
    const result = getTeamPerformanceReport(req.params.companyId);
    res.send(result);
};

exports.submitHiringManagerFeedback = (req, res) => {
    const feedback = saveHiringManagerFeedback(req.params.companyId, req.body || {});
    res.send(feedback);
};

exports.getSubscription = (req, res) => {
    const result = getSubscriptionOverview(req.params.companyId);
    res.send(result);
};

exports.updateSubscriptionPlan = (req, res) => {
    const result = changeSubscriptionPlan(req.params.companyId, req.body || {});
    res.send(result);
};

exports.buyJobCredits = (req, res) => {
    const result = purchaseJobCredits(req.params.companyId, req.body || {});
    res.send(result);
};

exports.payFeaturedListing = (req, res) => {
    const result = payForFeaturedListing(req.params.companyId, req.body || {});
    res.send(result);
};

exports.listInvoices = (req, res) => {
    const result = listBillingInvoices(req.params.companyId, req.query || {});
    res.send(result);
};

exports.downloadBillingInvoice = (req, res) => {
    const result = downloadInvoice(req.params.companyId, req.params.invoiceId);
    if (!result) {
        res.status(404).send({ message: 'Invoice not found.' });
        return;
    }

    res.send(result);
};

exports.listBillingPaymentMethods = (req, res) => {
    const result = listPaymentMethods(req.params.companyId);
    res.send(result);
};

exports.addBillingPaymentMethod = (req, res) => {
    const method = savePaymentMethod(req.params.companyId, req.body || {});
    res.send(method);
};

exports.deleteBillingPaymentMethod = (req, res) => {
    const removed = removePaymentMethod(req.params.companyId, req.params.methodId);
    if (!removed) {
        res.status(404).send({ message: 'Payment method not found.' });
        return;
    }

    res.send({ removed: true });
};

exports.getNotifications = (req, res) => {
    const result = getNotificationCenter(req.params.companyId);
    res.send(result);
};

exports.saveNotificationSettings = (req, res) => {
    const settings = updateNotificationSettings(req.params.companyId, req.body || {});
    res.send(settings);
};

exports.toggleNotificationChannels = (req, res) => {
    const settings = updateNotificationChannels(req.params.companyId, req.body || {});
    res.send(settings);
};

exports.readNotification = (req, res) => {
    const settings = markNotificationAsRead(req.params.companyId, req.params.notificationId);
    res.send(settings);
};

// ── 15. Settings & Control Actions ───────────────────────────────────────────

exports.getPipelineSettings = (req, res) => {
    const result = getPipelineSettings(req.params.companyId);
    res.send(result);
};

exports.configurePipelineStages = (req, res) => {
    const result = configurePipelineStages(req.params.companyId, req.body || {});
    res.send(result);
};

exports.getApplicationFormConfig = (req, res) => {
    const result = getApplicationFormConfig(req.params.companyId);
    res.send(result);
};

exports.saveApplicationFormConfig = (req, res) => {
    const result = saveApplicationFormConfig(req.params.companyId, req.body || {});
    res.send(result);
};

exports.getTeamPermissions = (req, res) => {
    const result = getTeamPermissions(req.params.companyId);
    if (!result) {
        res.status(404).send({ message: 'Company not found.' });
        return;
    }
    res.send(result);
};

exports.updateTeamPermissions = (req, res) => {
    const result = updateTeamPermissions(req.params.companyId, req.params.memberId, req.body || {});
    if (!result) {
        res.status(404).send({ message: 'Member not found.' });
        return;
    }
    res.send(result);
};

exports.getDefaultEmailTemplates = (req, res) => {
    const result = getDefaultEmailTemplates(req.params.companyId);
    res.send(result);
};

exports.saveDefaultEmailTemplate = (req, res) => {
    const result = saveDefaultEmailTemplate(req.params.companyId, req.body || {});
    res.send(result);
};

exports.getIntegrations = (req, res) => {
    const result = getIntegrations(req.params.companyId);
    res.send(result);
};

exports.saveIntegration = (req, res) => {
    const result = saveIntegration(req.params.companyId, req.body || {});
    res.send(result);
};

exports.removeIntegration = (req, res) => {
    const result = removeIntegration(req.params.companyId, req.params.integrationId);
    if (!result) {
        res.status(404).send({ message: 'Integration not found.' });
        return;
    }
    res.send(result);
};

// ── 16. Automation Actions ────────────────────────────────────────────────────

exports.getAutomationRules = (req, res) => {
    const result = getAutomationRules(req.params.companyId);
    res.send(result);
};

exports.createAutoMoveRule = (req, res) => {
    const result = createAutoMoveRule(req.params.companyId, req.body || {});
    res.send(result);
};

exports.createAutoRejectRule = (req, res) => {
    const result = createAutoRejectRule(req.params.companyId, req.body || {});
    res.send(result);
};

exports.scheduleFollowUpEmail = (req, res) => {
    const result = scheduleFollowUpEmail(req.params.companyId, req.body || {});
    res.send(result);
};

exports.triggerReminderForInactive = (req, res) => {
    const result = triggerReminderForInactive(req.params.companyId, req.body || {});
    res.send(result);
};

exports.getHiringWorkflows = (req, res) => {
    const result = getHiringWorkflows(req.params.companyId);
    res.send(result);
};

exports.createHiringWorkflow = (req, res) => {
    const result = createHiringWorkflow(req.params.companyId, req.body || {});
    res.send(result);
};

exports.deleteAutomationRule = (req, res) => {
    const result = deleteAutomationRule(req.params.companyId, req.params.ruleId);
    if (!result) {
        res.status(404).send({ message: 'Automation rule not found.' });
        return;
    }
    res.send(result);
};

exports.removeTeamMember = (req, res) => {
    const result = removeTeamMember(req.params.companyId, req.params.memberId);
    if (!result) {
        res.status(404).send({ message: 'Team member not found.' });
        return;
    }
    res.send(result);
};

exports.listCompanyJobs = (req, res) => {
    res.send(listCompanyJobs(req.params.companyId));
};

exports.createCompanyJob = (req, res) => {
    const job = createCompanyJob(req.params.companyId, req.body || {});
    res.status(201).send(job);
};

exports.updateCompanyJob = (req, res) => {
    const job = updateCompanyJob(req.params.companyId, req.params.jobId, req.body || {});
    if (!job) {
        res.status(404).send({ message: 'Job not found.' });
        return;
    }
    res.send(job);
};

exports.publishCompanyJob = (req, res) => {
    const job = publishCompanyJob(req.params.companyId, req.params.jobId);
    if (!job) {
        res.status(404).send({ message: 'Job not found.' });
        return;
    }
    res.send(job);
};

exports.pauseCompanyJob = (req, res) => {
    const job = pauseCompanyJob(req.params.companyId, req.params.jobId);
    if (!job) {
        res.status(404).send({ message: 'Job not found.' });
        return;
    }
    res.send(job);
};

exports.deleteCompanyJob = (req, res) => {
    const result = deleteCompanyJob(req.params.companyId, req.params.jobId);
    if (!result) {
        res.status(404).send({ message: 'Job not found.' });
        return;
    }
    res.send(result);
};

exports.duplicateCompanyJob = (req, res) => {
    const job = duplicateCompanyJob(req.params.companyId, req.params.jobId);
    if (!job) {
        res.status(404).send({ message: 'Job not found.' });
        return;
    }
    res.send(job);
};

exports.assignRecruiterToApplicant = (req, res) => {
    const result = assignRecruiterToApplicant(req.params.companyId, req.params.applicationId, (req.body || {}).recruiterId);
    if (!result) {
        res.status(404).send({ message: 'Applicant not found.' });
        return;
    }
    res.send(result);
};

exports.listAssessmentTemplates = (req, res) => {
    res.send(listAssessmentTemplates(req.params.companyId));
};

exports.createAssessmentTemplate = (req, res) => {
    const template = createAssessmentTemplate(req.params.companyId, req.body || {});
    res.status(201).send(template);
};

exports.negotiateJobOffer = (req, res) => {
    const offer = negotiateJobOffer(req.params.companyId, req.params.offerId, req.body || {});
    if (!offer) {
        res.status(404).send({ message: 'Offer not found.' });
        return;
    }
    res.send(offer);
};
