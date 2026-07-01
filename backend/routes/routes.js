var express = require('express');
var routerr = express.Router();
var billingController = require('../controllers/api/billing.controllers')
var languageController = require('../controllers/api/language.controllers')
var educationController = require('../controllers/api/education.controllers')
var userController = require('../controllers/api/user.controllers')
var indexController = require('../controllers/home.controllers')
var applyController = require('../controllers/api/apply.controllers')
var taskController = require('../controllers/api/task.controllers')
var staffController = require('../controllers/api/staff.controllers')
var roleController = require('../controllers/api/role.controllers')
var locationController = require('../controllers/api/location.controllers')
var interviewController = require('../controllers/api/interview.controllers')
var jobController = require('../controllers/api/job.controllers')
var candidateController = require('../controllers/api/candidate.controllers')
var categoryController = require('../controllers/api/category.controllers')
var skillController = require('../controllers/api/skill.controllers')
var companyController = require('../controllers/api/company.controllers')
var degreeController = require('../controllers/api/degree.controllers')
var experienceController = require('../controllers/api/experience.controllers')
var contractController = require('../controllers/api/contract.type.controllers')
var renewController = require('../controllers/api/renew.contract.controllers')
var refusalController = require('../controllers/api/refusal.feedback.controllers')
var acceptanceController = require('../controllers/api/acceptance.feedback.controllers')
var taskController = require('../controllers/api/task.controllers')
var frontOfficeController = require('../controllers/api/frontOffice.controllers')
var contractTypeController = require('../controllers/api/contract.type.controllers')
var settingsController = require('../controllers/api/settings.controllers')
var adminController = require('../controllers/api/admin.controllers')
var memberSavedSearchController = require('../controllers/api/member.saved.search.controllers')
var memberMessageController = require('../controllers/api/member.message.controllers')
var memberNotificationController = require('../controllers/api/member.notification.controllers')
var memberPreferenceController = require('../controllers/api/member.preference.controllers')
var memberProfileController = require('../controllers/api/member.profile.controllers')
var recruiterPortalController = require('../controllers/api/recruiter.portal.controllers')





routerr.get("/api/syssettings", settingsController.findSystemSettings);
routerr.put("/api/edit/systemsettings/:id", settingsController.updateSystemSettings);
routerr.get("/api/restore/syssettings/:id", settingsController.restoreSystemSettings);
routerr.get("/api/dashboardsettings", settingsController.findDashboardSettings);
routerr.put("/api/edit/dashboardsettings/:id", settingsController.updateDashboardSettings);
routerr.get("/api/restore/dashboard/:id", settingsController.restoreDashboardSettings);
routerr.get("/api/emailtemplatesettings", settingsController.findEmailTemplateSettings);
routerr.get("/api/emailsettings", settingsController.findEmailSettings);
routerr.put("/api/edit/emailsettings/:id", settingsController.updateEmailSettings);
routerr.get("/api/footersettings", settingsController.findFooterSettings);
routerr.put("/api/edit/footersettings/:id", settingsController.updateFooterSettings);
routerr.get("/api/restore/footer/:id", settingsController.restoreFooterSettings);
routerr.get("/api/headersettings", settingsController.findHeaderSettings);
routerr.put("/api/edit/headersettings/:id", settingsController.updateHeaderSettings);
routerr.get("/api/restore/header/:id", settingsController.restoreHeaderSettings);
routerr.get("/api/localisationsettings", settingsController.findLocalisationSettings);
routerr.put("/api/edit/localisationsettings/:id", settingsController.updateLocalisationSettings);
routerr.get("/api/notificationsettings", settingsController.findNotificationSettings);
routerr.put("/api/edit/notificationsettings/:id", settingsController.updateNotificationsSettings);
routerr.get("/api/restore/localisationsettings/:id", settingsController.restoreLocalisationSettings);

// admin feature APIs
routerr.get('/api/admin/jobseekers', adminController.findJobSeekers)
routerr.get('/api/admin/jobseekers/:id/activity', adminController.findJobSeekerActivity)
routerr.patch('/api/admin/jobseekers/:id', adminController.updateJobSeeker)
routerr.post('/api/admin/jobseekers/:id/reset-password', adminController.resetJobSeekerPassword)
routerr.post('/api/admin/jobseekers/:id/impersonate', adminController.impersonateJobSeeker)
routerr.delete('/api/admin/jobseekers/:id', adminController.deleteJobSeeker)
routerr.get('/api/admin/jobseekers/:id/export', adminController.exportJobSeekerData)

routerr.get('/api/admin/recruiters', adminController.findRecruiters)
routerr.patch('/api/admin/recruiters/:id', adminController.updateRecruiter)

routerr.get('/api/admin/configuration', adminController.findConfiguration)
routerr.put('/api/admin/configuration/:section', adminController.updateConfiguration)

routerr.get('/api/admin/analytics', adminController.findAnalytics)
routerr.post('/api/admin/analytics/export', adminController.exportAnalytics)
routerr.post('/api/admin/analytics/schedule', adminController.scheduleReport)

routerr.get('/api/admin/job-posting', adminController.findAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs', adminController.createAdminJobPosting)
routerr.put('/api/admin/job-posting/jobs/:id', adminController.updateAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/duplicate', adminController.duplicateAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/publish', adminController.publishAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/unpublish', adminController.unpublishAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/schedule', adminController.scheduleAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/promote', adminController.promoteAdminJobPosting)
routerr.post('/api/admin/job-posting/jobs/:id/refresh', adminController.refreshAdminJobPosting)




//website
routerr.get('/', indexController.getHome)
routerr.get('/companies', indexController.getCompanies)
routerr.get('/jobs', indexController.getJobs)
routerr.get('/login', indexController.getLogin)
routerr.get('/register', indexController.getRegister)
routerr.get('/viewjob/:id', indexController.getJobDetail)
routerr.post('/auth', indexController.getAuth)
routerr.get('/sendcandidature/:idJob/:idUser', indexController.sendCandidature)
routerr.get('/newcandidature/:idJob', indexController.newCandidature)
routerr.post('/finishcandidature', indexController.finishCandidature)
routerr.get('/admin', indexController.adminPanel)
routerr.post("/api/user/login", userController.login);
routerr.post('/api/user/request-reset', userController.requestReset)
routerr.post('/api/user/reset-password', userController.resetPassword)
routerr.post('/api/user/social-login', userController.socialLogin)

// recruiter portal
routerr.post('/api/recruiter/login', recruiterPortalController.login)
routerr.post('/api/recruiter/register', recruiterPortalController.register)
routerr.get('/api/recruiter/workspace/:recruiterId', recruiterPortalController.findWorkspace)
routerr.post('/api/recruiter/:recruiterId/company/create', recruiterPortalController.createCompany)
routerr.post('/api/recruiter/:recruiterId/company/join', recruiterPortalController.joinCompany)
routerr.put('/api/recruiter/:recruiterId/switch-company', recruiterPortalController.switchCompany)
routerr.put('/api/recruiter/:recruiterId/profile', recruiterPortalController.updateProfile)
routerr.post('/api/recruiter/company/:companyId/invite', recruiterPortalController.inviteTeamMember)
routerr.put('/api/recruiter/company/:companyId/team/:memberId/role', recruiterPortalController.assignRole)
routerr.delete('/api/recruiter/company/:companyId/team/:memberId', recruiterPortalController.removeTeamMember)
routerr.get('/api/recruiter/company/:companyId/jobs', recruiterPortalController.listCompanyJobs)
routerr.post('/api/recruiter/company/:companyId/jobs', recruiterPortalController.createCompanyJob)
routerr.put('/api/recruiter/company/:companyId/jobs/:jobId', recruiterPortalController.updateCompanyJob)
routerr.post('/api/recruiter/company/:companyId/jobs/:jobId/publish', recruiterPortalController.publishCompanyJob)
routerr.post('/api/recruiter/company/:companyId/jobs/:jobId/pause', recruiterPortalController.pauseCompanyJob)
routerr.delete('/api/recruiter/company/:companyId/jobs/:jobId', recruiterPortalController.deleteCompanyJob)
routerr.post('/api/recruiter/company/:companyId/jobs/:jobId/duplicate', recruiterPortalController.duplicateCompanyJob)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/assign-recruiter', recruiterPortalController.assignRecruiterToApplicant)
routerr.get('/api/recruiter/company/:companyId/assessment-templates', recruiterPortalController.listAssessmentTemplates)
routerr.post('/api/recruiter/company/:companyId/assessment-templates', recruiterPortalController.createAssessmentTemplate)
routerr.put('/api/recruiter/company/:companyId/offers/:offerId/negotiate', recruiterPortalController.negotiateJobOffer)
routerr.put('/api/recruiter/company/:companyId/profile', recruiterPortalController.updateCompanyProfile)
routerr.post('/api/recruiter/company/:companyId/media', recruiterPortalController.uploadMedia)
routerr.post('/api/recruiter/company/:companyId/location', recruiterPortalController.addLocation)
routerr.put('/api/recruiter/company/:companyId/visibility', recruiterPortalController.updateVisibility)
routerr.post('/api/recruiter/company/:companyId/reviews/:reviewId/respond', recruiterPortalController.respondReview)
routerr.get('/api/recruiter/company/:companyId/applicants', recruiterPortalController.listApplicants)
routerr.get('/api/recruiter/company/:companyId/applicants/:applicationId/profile', recruiterPortalController.openApplicantProfile)
routerr.get('/api/recruiter/company/:companyId/applicants/:applicationId/resume', recruiterPortalController.downloadResume)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/notes', recruiterPortalController.addNote)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/tag', recruiterPortalController.tagCandidate)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/stage', recruiterPortalController.moveStage)
routerr.put('/api/recruiter/company/:companyId/applicants/bulk-stage', recruiterPortalController.bulkMoveStage)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/reject', recruiterPortalController.rejectCandidate)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/reopen', recruiterPortalController.reopenCandidate)
routerr.get('/api/recruiter/company/:companyId/candidates/search', recruiterPortalController.searchCandidates)
routerr.get('/api/recruiter/company/:companyId/candidates/:candidateId/profile', recruiterPortalController.openCandidateProfile)
routerr.post('/api/recruiter/company/:companyId/candidates/:candidateId/shortlist', recruiterPortalController.shortlistCandidate)
routerr.post('/api/recruiter/company/:companyId/talent-pools', recruiterPortalController.createPool)
routerr.post('/api/recruiter/company/:companyId/candidates/:candidateId/talent-pool', recruiterPortalController.addToTalentPool)
routerr.delete('/api/recruiter/company/:companyId/candidates/:candidateId/talent-pool', recruiterPortalController.removeFromTalentPool)
routerr.put('/api/recruiter/company/:companyId/candidates/:candidateId/crm-tags', recruiterPortalController.crmTagCandidate)
routerr.get('/api/recruiter/company/:companyId/candidates/:candidateId/history', recruiterPortalController.findCandidateHistory)
routerr.post('/api/recruiter/company/:companyId/candidates/:candidateId/reengage', recruiterPortalController.reengageCandidate)
routerr.post('/api/recruiter/company/:companyId/candidates/:candidateId/outreach', recruiterPortalController.sendOutreach)
routerr.post('/api/recruiter/company/:companyId/ai/job-description', recruiterPortalController.aiGenerateJobDescription)
routerr.post('/api/recruiter/company/:companyId/ai/recommended-candidates', recruiterPortalController.aiRecommendCandidates)
routerr.post('/api/recruiter/company/:companyId/ai/candidate-match-score', recruiterPortalController.aiCandidateMatchScore)
routerr.post('/api/recruiter/company/:companyId/ai/auto-rank-applicants', recruiterPortalController.aiAutoRankApplicants)
routerr.post('/api/recruiter/company/:companyId/ai/interview-questions', recruiterPortalController.aiInterviewQuestions)
routerr.post('/api/recruiter/company/:companyId/ai/outreach-message', recruiterPortalController.aiOutreachMessage)
routerr.post('/api/recruiter/company/:companyId/ai/predict-success', recruiterPortalController.aiPredictCandidateSuccess)

// ── 15. Settings & Control Actions ───────────────────────────────────────────
routerr.get('/api/recruiter/company/:companyId/settings/pipeline', recruiterPortalController.getPipelineSettings)
routerr.put('/api/recruiter/company/:companyId/settings/pipeline', recruiterPortalController.configurePipelineStages)
routerr.get('/api/recruiter/company/:companyId/settings/application-form', recruiterPortalController.getApplicationFormConfig)
routerr.put('/api/recruiter/company/:companyId/settings/application-form', recruiterPortalController.saveApplicationFormConfig)
routerr.get('/api/recruiter/company/:companyId/settings/team-permissions', recruiterPortalController.getTeamPermissions)
routerr.put('/api/recruiter/company/:companyId/settings/team-permissions/:memberId', recruiterPortalController.updateTeamPermissions)
routerr.get('/api/recruiter/company/:companyId/settings/email-templates', recruiterPortalController.getDefaultEmailTemplates)
routerr.put('/api/recruiter/company/:companyId/settings/email-templates', recruiterPortalController.saveDefaultEmailTemplate)
routerr.get('/api/recruiter/company/:companyId/settings/integrations', recruiterPortalController.getIntegrations)
routerr.post('/api/recruiter/company/:companyId/settings/integrations', recruiterPortalController.saveIntegration)
routerr.delete('/api/recruiter/company/:companyId/settings/integrations/:integrationId', recruiterPortalController.removeIntegration)

// ── 16. Automation Actions ────────────────────────────────────────────────────
routerr.get('/api/recruiter/company/:companyId/automation/rules', recruiterPortalController.getAutomationRules)
routerr.post('/api/recruiter/company/:companyId/automation/rules/auto-move', recruiterPortalController.createAutoMoveRule)
routerr.post('/api/recruiter/company/:companyId/automation/rules/auto-reject', recruiterPortalController.createAutoRejectRule)
routerr.post('/api/recruiter/company/:companyId/automation/follow-up', recruiterPortalController.scheduleFollowUpEmail)
routerr.post('/api/recruiter/company/:companyId/automation/reminder', recruiterPortalController.triggerReminderForInactive)
routerr.get('/api/recruiter/company/:companyId/automation/workflows', recruiterPortalController.getHiringWorkflows)
routerr.post('/api/recruiter/company/:companyId/automation/workflows', recruiterPortalController.createHiringWorkflow)
routerr.delete('/api/recruiter/company/:companyId/automation/rules/:ruleId', recruiterPortalController.deleteAutomationRule)

routerr.get('/api/recruiter/company/:companyId/messages', recruiterPortalController.listMessages)
routerr.post('/api/recruiter/company/:companyId/messages/send', recruiterPortalController.sendMessage)
routerr.post('/api/recruiter/company/:companyId/messages/:messageId/reply', recruiterPortalController.replyMessage)
routerr.post('/api/recruiter/company/:companyId/messages/bulk', recruiterPortalController.sendBulk)
routerr.get('/api/recruiter/company/:companyId/message-templates', recruiterPortalController.findMessageTemplates)
routerr.post('/api/recruiter/company/:companyId/message-templates', recruiterPortalController.saveTemplate)
routerr.post('/api/recruiter/company/:companyId/email/interview-invite', recruiterPortalController.sendInterviewInvite)
routerr.post('/api/recruiter/company/:companyId/email/rejection', recruiterPortalController.sendRejection)
routerr.post('/api/recruiter/company/:companyId/email/follow-up', recruiterPortalController.sendFollowUp)
routerr.post('/api/recruiter/company/:companyId/email/sequences', recruiterPortalController.createSequence)
routerr.get('/api/recruiter/company/:companyId/email/sequences', recruiterPortalController.listSequences)
routerr.post('/api/recruiter/company/:companyId/email/sequences/:sequenceId/assign', recruiterPortalController.assignSequence)
routerr.get('/api/recruiter/company/:companyId/interviews', recruiterPortalController.listInterviewSchedules)
routerr.post('/api/recruiter/company/:companyId/interviews', recruiterPortalController.scheduleInterview)
routerr.put('/api/recruiter/company/:companyId/interviews/:interviewId/sync-calendar', recruiterPortalController.syncInterview)
routerr.put('/api/recruiter/company/:companyId/interviews/:interviewId/reschedule', recruiterPortalController.rescheduleInterview)
routerr.put('/api/recruiter/company/:companyId/interviews/:interviewId/cancel', recruiterPortalController.cancelInterview)
routerr.put('/api/recruiter/company/:companyId/interviews/:interviewId/notes', recruiterPortalController.updateInterviewNotes)
routerr.post('/api/recruiter/company/:companyId/interviews/:interviewId/feedback', recruiterPortalController.saveInterviewFeedback)
routerr.put('/api/recruiter/company/:companyId/interviews/:interviewId/share-feedback', recruiterPortalController.shareFeedbackWithTeam)
routerr.get('/api/recruiter/company/:companyId/applicants/:applicationId/screening-answers', recruiterPortalController.getScreeningAnswers)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/rating', recruiterPortalController.updateCandidateRating)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/structured-feedback', recruiterPortalController.saveStructuredCandidateFeedback)
routerr.post('/api/recruiter/company/:companyId/applicants/compare', recruiterPortalController.compareCandidatesSideBySide)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/assessments', recruiterPortalController.assignCandidateAssessment)
routerr.get('/api/recruiter/company/:companyId/assessments', recruiterPortalController.listAssessmentReviews)
routerr.put('/api/recruiter/company/:companyId/assessments/:assessmentId/review', recruiterPortalController.reviewAssessment)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/select', recruiterPortalController.selectCandidate)
routerr.post('/api/recruiter/company/:companyId/applicants/:applicationId/offers', recruiterPortalController.sendJobOffer)
routerr.get('/api/recruiter/company/:companyId/offers', recruiterPortalController.listOffers)
routerr.put('/api/recruiter/company/:companyId/offers/:offerId/attach-letter', recruiterPortalController.uploadOfferLetter)
routerr.put('/api/recruiter/company/:companyId/offers/:offerId/status', recruiterPortalController.changeOfferStatus)
routerr.put('/api/recruiter/company/:companyId/applicants/:applicationId/hire', recruiterPortalController.hireCandidate)
routerr.put('/api/recruiter/company/:companyId/jobs/:jobId/close', recruiterPortalController.closeJob)
routerr.get('/api/recruiter/company/:companyId/analytics/job-performance', recruiterPortalController.jobPerformanceReport)
routerr.get('/api/recruiter/company/:companyId/analytics/hiring-metrics', recruiterPortalController.hiringMetricsReport)
routerr.get('/api/recruiter/company/:companyId/analytics/team-performance', recruiterPortalController.teamPerformanceReport)
routerr.post('/api/recruiter/company/:companyId/analytics/hiring-manager-feedback', recruiterPortalController.submitHiringManagerFeedback)
routerr.get('/api/recruiter/company/:companyId/subscription', recruiterPortalController.getSubscription)
routerr.put('/api/recruiter/company/:companyId/subscription/plan', recruiterPortalController.updateSubscriptionPlan)
routerr.post('/api/recruiter/company/:companyId/subscription/job-credits/purchase', recruiterPortalController.buyJobCredits)
routerr.post('/api/recruiter/company/:companyId/subscription/featured-listings/pay', recruiterPortalController.payFeaturedListing)
routerr.get('/api/recruiter/company/:companyId/subscription/invoices', recruiterPortalController.listInvoices)
routerr.get('/api/recruiter/company/:companyId/subscription/invoices/:invoiceId/download', recruiterPortalController.downloadBillingInvoice)
routerr.get('/api/recruiter/company/:companyId/subscription/payment-methods', recruiterPortalController.listBillingPaymentMethods)
routerr.post('/api/recruiter/company/:companyId/subscription/payment-methods', recruiterPortalController.addBillingPaymentMethod)
routerr.delete('/api/recruiter/company/:companyId/subscription/payment-methods/:methodId', recruiterPortalController.deleteBillingPaymentMethod)
routerr.get('/api/recruiter/company/:companyId/notifications', recruiterPortalController.getNotifications)
routerr.put('/api/recruiter/company/:companyId/notifications/settings', recruiterPortalController.saveNotificationSettings)
routerr.put('/api/recruiter/company/:companyId/notifications/channels', recruiterPortalController.toggleNotificationChannels)
routerr.put('/api/recruiter/company/:companyId/notifications/:notificationId/read', recruiterPortalController.readNotification)

//summary
routerr.get('/api/summarypage', frontOfficeController.findSummary)
routerr.put('/api/summarypage/:id', frontOfficeController.updateSummary)
//footer
routerr.get('/api/footerpage', frontOfficeController.findFooter)
routerr.put('/api/footerpage/:id', frontOfficeController.updateFooter)
//header
routerr.get('/api/headerpage', frontOfficeController.findHeader)
routerr.put('/api/headerpage/:id', frontOfficeController.updateHeader)
//newsletter
routerr.get('/api/newsletterpage', frontOfficeController.findNewsLetter)
routerr.put('/api/newsletterpage/:id', frontOfficeController.updateNewsLetter)
//insight content
routerr.get('/api/insightcontent', frontOfficeController.findInsightContent)

//users
routerr.post('/api/user', userController.create)
routerr.get('/api/user', userController.findAll)
routerr.get("/api/user/:id", userController.findOne);
routerr.put("/api/user/:id", userController.update);
routerr.delete("/api/user/:id", userController.delete);
routerr.delete("/api/user", userController.deleteAll);

//apply
routerr.post('/api/apply', applyController.create)
routerr.get('/api/apply', applyController.findAll)
routerr.get("/api/apply/:id", applyController.findOne);
routerr.put("/api/apply/:id", applyController.update);
routerr.delete("/api/apply/:id", applyController.delete);
routerr.delete("/api/apply", applyController.deleteAll);





routerr.get('/api/initialqualification', applyController.findInitialQualification)
routerr.get('/api/firstinterview', applyController.findFirstInterview)
routerr.get('/api/secondinterview', applyController.findSecondInterview)
routerr.get('/api/contractproposal', applyController.findContractProposal)
routerr.get('/api/contractsigned', applyController.findContractSigned)

//candidate
routerr.post('/api/candidate', candidateController.create)
routerr.get('/api/candidate', candidateController.findAll)
routerr.get('/api/candidate/search/talent', candidateController.searchTalent)
routerr.get("/api/candidate/:id", candidateController.findOne);
routerr.put("/api/candidate/:id", candidateController.update);
routerr.delete("/api/candidate/:id", candidateController.delete);
routerr.delete("/api/candidate", candidateController.deleteAll);


//category
routerr.post('/api/category', categoryController.create)
routerr.get('/api/category', categoryController.findAll)
routerr.get("/api/category/:id", categoryController.findOne);
routerr.put("/api/category/:id", categoryController.update);
routerr.delete("/api/category/:id", categoryController.delete);
routerr.delete("/api/category", categoryController.deleteAll);


//interview
routerr.post('/api/interview', interviewController.create)
routerr.get('/api/interview', interviewController.findAll)
routerr.get("/api/interview/:id", interviewController.findOne);
routerr.put("/api/interview/:id", interviewController.update);
routerr.delete("/api/interview/:id", interviewController.delete);
routerr.delete("/api/interview", interviewController.deleteAll);


//job
routerr.post('/api/job', jobController.create)
routerr.get('/api/job', jobController.findAll)
routerr.get("/api/job/:id", jobController.findOne);
routerr.put("/api/job/:id", jobController.update);
routerr.delete("/api/job/:id", jobController.delete);
routerr.delete("/api/job", jobController.deleteAll);
routerr.post('/searchjob', jobController.search)



//location
routerr.post('/api/location', locationController.create)
routerr.get('/api/location', locationController.findAll)
routerr.get("/api/location/:id", locationController.findOne);
routerr.put("/api/location/:id", locationController.update);
routerr.delete("/api/location/:id", locationController.delete);
routerr.delete("/api/location", locationController.deleteAll);

//staff
routerr.post('/api/staff', staffController.create)
routerr.get('/api/staff', staffController.findAll)
routerr.get("/api/staff/:id", staffController.findOne);
routerr.put("/api/staff/:id", staffController.update);
routerr.delete("/api/staff/:id", staffController.delete);
routerr.delete("/api/staff", staffController.deleteAll);

routerr.post('/api/role', roleController.create)
routerr.get('/api/role', roleController.findAll)
routerr.get('/api/role/:id', roleController.findOne)
routerr.put('/api/role/:id', roleController.update)
routerr.delete('/api/role/:id', roleController.delete)

//task
routerr.post('/api/task', taskController.create)
routerr.get('/api/task', taskController.findAll)
routerr.get("/api/task/:id", taskController.findOne);
routerr.put("/api/task/:id", taskController.update);
routerr.delete("/api/task/:id", taskController.delete);
routerr.delete("/api/task", taskController.deleteAll);

//skill

routerr.post('/api/skill', skillController.create)
routerr.get('/api/skill', skillController.findAll)
routerr.get("/api/skill/:id", skillController.findOne);
routerr.put("/api/skill/:id", skillController.update);
routerr.delete("/api/skill/:id", skillController.delete);
routerr.delete("/api/skill", skillController.deleteAll);

routerr.post('/api/company/:fileName', companyController.create)
routerr.get('/api/company', companyController.findAll)
routerr.get("/api/company/:id", companyController.findOne);
routerr.put("/api/company/:id", companyController.update);
routerr.delete("/api/company/:id", companyController.delete);
routerr.delete("/api/company", companyController.deleteAll);
routerr.post('/api/company/image/uploadfile', companyController.addImage)

//education
routerr.post('/api/education', educationController.create)
routerr.get('/api/education', educationController.findAll)
routerr.get("/api/education/:id", educationController.findOne);
routerr.put("/api/education/:id", educationController.update);
routerr.delete("/api/education/:id", educationController.delete);
routerr.delete("/api/education", educationController.deleteAll);

//language
routerr.post('/api/language', languageController.create)
routerr.get('/api/language', languageController.findAll)
routerr.get("/api/language/:id", languageController.findOne);
routerr.put("/api/language/:id", languageController.update);
routerr.delete("/api/language/:id", languageController.delete);
routerr.delete("/api/language", languageController.deleteAll);

//degree
routerr.post('/api/degree', degreeController.create)
routerr.get('/api/degree', degreeController.findAll)
routerr.get("/api/degree/:id", degreeController.findOne);
routerr.put("/api/degree/:id", degreeController.update);
routerr.delete("/api/degree/:id", degreeController.delete);
routerr.delete("/api/degree", degreeController.deleteAll);

//experience
routerr.post('/api/experience', experienceController.create)
routerr.get('/api/experience', experienceController.findAll)
routerr.get("/api/experience/:id", experienceController.findOne);
routerr.put("/api/experience/:id", experienceController.update);
routerr.delete("/api/experience/:id", experienceController.delete);
routerr.delete("/api/experience", experienceController.deleteAll);

//skill
routerr.post('/api/skill', skillController.create)
routerr.get('/api/skill', skillController.findAll)
routerr.get("/api/skill/:id", skillController.findOne);
routerr.put("/api/skill/:id", skillController.update);
routerr.delete("/api/skill/:id", skillController.delete);
routerr.delete("/api/skill", skillController.deleteAll);

//contract
routerr.post('/api/contract', contractController.create)
routerr.get('/api/contract', contractController.findAll)
routerr.get("/api/contract/:id", contractController.findOne);
routerr.put("/api/contract/:id", contractController.update);
routerr.delete("/api/contract/:id", contractController.delete);
routerr.delete("/api/contract", contractController.deleteAll);

//type contract

//renew
routerr.post('/api/renew', renewController.create)
routerr.get('/api/renew', renewController.findAll)
routerr.get("/api/renew/:id", renewController.findOne);
routerr.put("/api/renew/:id", renewController.update);
routerr.delete("/api/renew/:id", renewController.delete);
routerr.delete("/api/renew", renewController.deleteAll);

//acceptance
routerr.post('/api/acceptance', acceptanceController.create)
routerr.get('/api/acceptance', acceptanceController.findAll)
routerr.get("/api/acceptance/:id", acceptanceController.findOne);
routerr.put("/api/acceptance/:id", acceptanceController.update);
routerr.delete("/api/acceptance/:id", acceptanceController.delete);
routerr.delete("/api/acceptance", acceptanceController.deleteAll);
//refusal
routerr.post('/api/refusal', refusalController.create)
routerr.get('/api/refusal', refusalController.findAll)
routerr.get("/api/refusal/:id", refusalController.findOne);
routerr.put("/api/refusal/:id", refusalController.update);
routerr.delete("/api/refusal/:id", refusalController.delete);
routerr.delete("/api/refusal", refusalController.deleteAll);


//task
routerr.post('/api/task', taskController.create)
routerr.get('/api/task', taskController.findAll)
routerr.get("/api/task/:id", taskController.findOne);
routerr.put("/api/task/:id", taskController.update);
routerr.delete("/api/task/:id", taskController.delete);
routerr.delete("/api/task", taskController.deleteAll);


//refusal
routerr.post('/api/contract-type', contractTypeController.create)
routerr.get('/api/contract-type', contractTypeController.findAll)
routerr.get("/api/contract-type/:id", contractTypeController.findOne);
routerr.put("/api/contract-type/:id", contractTypeController.update);
routerr.delete("/api/contract-type/:id", contractTypeController.delete);
routerr.delete("/api/contract-type", contractTypeController.deleteAll);

// member saved searches
routerr.get('/api/member/saved-search', memberSavedSearchController.findAll)
routerr.post('/api/member/saved-search', memberSavedSearchController.create)
routerr.put('/api/member/saved-search/:id', memberSavedSearchController.update)
routerr.delete('/api/member/saved-search/:id', memberSavedSearchController.delete)

// member messages
routerr.get('/api/admin/messages', memberMessageController.findAllAdmin)
routerr.get('/api/member/message', memberMessageController.findAll)
routerr.post('/api/member/message', memberMessageController.create)
routerr.put('/api/member/message/:id', memberMessageController.update)
routerr.delete('/api/member/message/:id', memberMessageController.delete)

// member notifications
routerr.get('/api/member/notification', memberNotificationController.findAll)
routerr.post('/api/member/notification', memberNotificationController.create)
routerr.put('/api/member/notification/:id', memberNotificationController.update)
routerr.delete('/api/member/notification/:id', memberNotificationController.delete)
routerr.put('/api/member/notification/mark-all-read/:userId', memberNotificationController.markAllAsRead)

// member preferences
routerr.get('/api/member/preferences/:userId', memberPreferenceController.findOne)
routerr.put('/api/member/preferences/:userId', memberPreferenceController.upsert)

// member profile
routerr.get('/api/member/profile/:userId', memberProfileController.findOne)
routerr.put('/api/member/profile/:userId', memberProfileController.upsert)
routerr.post('/api/member/profile/:userId/resume', memberProfileController.addResume)
routerr.put('/api/member/profile/:userId/resume/:resumeId', memberProfileController.updateResume)
routerr.delete('/api/member/profile/:userId/resume/:resumeId', memberProfileController.deleteResume)

// ── Billing / Stripe ─────────────────────────────────────────────────────────
routerr.post('/api/billing/create-checkout-session', billingController.createCheckoutSession)
routerr.get('/api/billing/session/:sessionId',        billingController.getSession)
routerr.post('/api/billing/webhook',                  billingController.webhook)

module.exports = routerr;