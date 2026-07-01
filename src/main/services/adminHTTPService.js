import http from '../../libraries/axios/axios';
import BASE_URL from '../urls/urls';

const getJobSeekers = (params = {}) => http.get(`${BASE_URL}/api/admin/jobseekers`, { params });
const getJobSeekerActivity = (id) => http.get(`${BASE_URL}/api/admin/jobseekers/${id}/activity`);
const updateJobSeeker = (id, data) => http.patch(`${BASE_URL}/api/admin/jobseekers/${id}`, data);
const resetJobSeekerPassword = (id) => http.post(`${BASE_URL}/api/admin/jobseekers/${id}/reset-password`);
const impersonateJobSeeker = (id) => http.post(`${BASE_URL}/api/admin/jobseekers/${id}/impersonate`);
const deleteJobSeeker = (id, mode = 'soft') => http.delete(`${BASE_URL}/api/admin/jobseekers/${id}`, { params: { mode } });
const exportJobSeekerData = (id) => http.get(`${BASE_URL}/api/admin/jobseekers/${id}/export`);

const getRecruiters = () => http.get(`${BASE_URL}/api/admin/recruiters`);
const updateRecruiter = (id, data) => http.patch(`${BASE_URL}/api/admin/recruiters/${id}`, data);

const getConfiguration = () => http.get(`${BASE_URL}/api/admin/configuration`);
const updateConfigurationSection = (section, data) => http.put(`${BASE_URL}/api/admin/configuration/${section}`, data);

const getAnalytics = () => http.get(`${BASE_URL}/api/admin/analytics`);
const exportAnalytics = (format = 'CSV') => http.post(`${BASE_URL}/api/admin/analytics/export`, { format });
const scheduleAnalyticsReport = (payload) => http.post(`${BASE_URL}/api/admin/analytics/schedule`, payload);

const getAdminJobPosting = () => http.get(`${BASE_URL}/api/admin/job-posting`);
const createAdminJobPost = (payload) => http.post(`${BASE_URL}/api/admin/job-posting/jobs`, payload);
const updateAdminJobPost = (id, payload) => http.put(`${BASE_URL}/api/admin/job-posting/jobs/${id}`, payload);
const duplicateAdminJobPost = (id) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/duplicate`);
const publishAdminJobPost = (id) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/publish`);
const unpublishAdminJobPost = (id) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/unpublish`);
const scheduleAdminJobPost = (id, scheduledAt) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/schedule`, { scheduledAt });
const promoteAdminJobPost = (id, payload) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/promote`, payload);
const refreshAdminJobPost = (id) => http.post(`${BASE_URL}/api/admin/job-posting/jobs/${id}/refresh`);

export default {
    getJobSeekers,
    getJobSeekerActivity,
    updateJobSeeker,
    resetJobSeekerPassword,
    impersonateJobSeeker,
    deleteJobSeeker,
    exportJobSeekerData,
    getRecruiters,
    updateRecruiter,
    getConfiguration,
    updateConfigurationSection,
    getAnalytics,
    exportAnalytics,
    scheduleAnalyticsReport,
    getAdminJobPosting,
    createAdminJobPost,
    updateAdminJobPost,
    duplicateAdminJobPost,
    publishAdminJobPost,
    unpublishAdminJobPost,
    scheduleAdminJobPost,
    promoteAdminJobPost,
    refreshAdminJobPost,
};
