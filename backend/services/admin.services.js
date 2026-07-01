const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../db/admin/admin.store.json');

function readStore() {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
}

function writeStore(store) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function toNumber(value) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function nowIso() {
    return new Date().toISOString();
}

const DEFAULT_ADMIN_JOB_TEMPLATES = [
    {
        id: 'tpl-engineering',
        name: 'Engineering Standard',
        title: 'Senior Software Engineer',
        description: 'Build and ship reliable product features with measurable business impact.',
        requirements: '5+ years experience, strong problem solving, collaborative communication.',
        salaryRange: { min: 50000, max: 80000 },
        locations: ['Remote'],
        employmentType: 'Full-Time',
        screeningQuestions: [
            { id: 'q-eng-1', type: 'yes_no', question: 'Do you have at least 5 years of software engineering experience?' },
            { id: 'q-eng-2', type: 'custom', question: 'Describe a production system you owned end-to-end.' },
        ],
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
        screeningQuestions: [
            { id: 'q-des-1', type: 'mcq', question: 'Primary tool', options: ['Figma', 'Sketch', 'Adobe XD'] },
        ],
        visibility: 'Public',
    },
];

function parseArrayFromInput(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeScreeningQuestions(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((question, index) => ({
            id: question.id || `q-${Date.now()}-${index}`,
            type: question.type || 'custom',
            question: String(question.question || '').trim(),
            options: parseArrayFromInput(question.options || []),
        }))
        .filter((question) => question.question);
}

function ensureJobPostingConfig(store) {
    if (!store.configuration) {
        store.configuration = {};
    }

    if (!store.configuration.jobPosting) {
        store.configuration.jobPosting = {
            templates: DEFAULT_ADMIN_JOB_TEMPLATES,
            jobs: [],
        };
    }

    if (!Array.isArray(store.configuration.jobPosting.templates) || !store.configuration.jobPosting.templates.length) {
        store.configuration.jobPosting.templates = DEFAULT_ADMIN_JOB_TEMPLATES;
    }

    if (!Array.isArray(store.configuration.jobPosting.jobs)) {
        store.configuration.jobPosting.jobs = [];
    }

    return store.configuration.jobPosting;
}

function normalizeJobPayload(payload, existing = {}) {
    const salaryRangeInput = payload.salaryRange || {};
    const min = payload.salaryMin !== undefined ? payload.salaryMin : salaryRangeInput.min;
    const max = payload.salaryMax !== undefined ? payload.salaryMax : salaryRangeInput.max;
    const promotionInput = payload.promotion || existing.promotion || {};

    return {
        ...existing,
        title: String(payload.title || existing.title || '').trim(),
        description: String(payload.description || existing.description || '').trim(),
        requirements: String(payload.requirements || existing.requirements || '').trim(),
        salaryRange: {
            min: toNumber(min !== undefined ? min : (existing.salaryRange && existing.salaryRange.min)),
            max: toNumber(max !== undefined ? max : (existing.salaryRange && existing.salaryRange.max)),
        },
        locations: parseArrayFromInput(payload.locations !== undefined ? payload.locations : existing.locations),
        employmentType: String(payload.employmentType || existing.employmentType || 'Full-Time').trim(),
        screeningQuestions: normalizeScreeningQuestions(
            payload.screeningQuestions !== undefined ? payload.screeningQuestions : existing.screeningQuestions
        ),
        applicationDeadline: payload.applicationDeadline || existing.applicationDeadline || null,
        visibility: payload.visibility || existing.visibility || 'Public',
        status: payload.status || existing.status || 'Draft',
        scheduledAt: payload.scheduledAt !== undefined ? payload.scheduledAt : (existing.scheduledAt || null),
        publishedAt: existing.publishedAt || null,
        isFeatured: payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : Boolean(existing.isFeatured),
        promotion: {
            paid: payload.paidPromotion !== undefined ? Boolean(payload.paidPromotion) : Boolean(promotionInput.paid),
            plan: payload.promotionPlan || promotionInput.plan || 'None',
        },
        boostCount: toNumber(existing.boostCount),
        refreshedAt: existing.refreshedAt || null,
        updatedAt: nowIso(),
        createdAt: existing.createdAt || nowIso(),
    };
}

function getJobSeekers(query) {
    const store = readStore();
    const email = String(query.email || '').trim().toLowerCase();
    const skill = String(query.skill || '').trim().toLowerCase();
    const status = String(query.status || '').trim();

    return store.jobSeekers.filter((user) => {
        if (user.deleted) {
            return false;
        }

        const emailMatch = !email || user.email.toLowerCase().includes(email) || user.fullName.toLowerCase().includes(email);
        const skillMatch = !skill || (Array.isArray(user.skills) && user.skills.some((item) => String(item).toLowerCase().includes(skill)));
        const statusMatch = !status || user.status === status;
        return emailMatch && skillMatch && statusMatch;
    });
}

function getJobSeekerById(userId) {
    const store = readStore();
    return store.jobSeekers.find((user) => Number(user.id) === Number(userId));
}

function updateJobSeekerState(userId, payload) {
    const store = readStore();
    let updated = null;

    store.jobSeekers = store.jobSeekers.map((user) => {
        if (Number(user.id) !== Number(userId)) {
            return user;
        }

        updated = {
            ...user,
            ...payload,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function deleteJobSeeker(userId, mode) {
    const store = readStore();
    const existing = store.jobSeekers.find((user) => Number(user.id) === Number(userId));

    if (!existing) {
        return null;
    }

    if (mode === 'hard') {
        store.jobSeekers = store.jobSeekers.filter((user) => Number(user.id) !== Number(userId));
        writeStore(store);
        return { id: Number(userId), mode: 'hard' };
    }

    store.jobSeekers = store.jobSeekers.map((user) => (
        Number(user.id) === Number(userId)
            ? {
                ...user,
                deleted: true,
                status: 'Deleted',
            }
            : user
    ));
    writeStore(store);
    return { id: Number(userId), mode: 'soft' };
}

function exportUserData(userId) {
    const user = getJobSeekerById(userId);
    if (!user) {
        return null;
    }

    return {
        exportedAt: nowIso(),
        gdprRegion: 'EU',
        user,
    };
}

function getRecruiters() {
    const store = readStore();
    return store.recruiters;
}

function updateRecruiterState(recruiterId, payload) {
    const store = readStore();
    let updated = null;

    store.recruiters = store.recruiters.map((recruiter) => {
        if (Number(recruiter.id) !== Number(recruiterId)) {
            return recruiter;
        }

        updated = {
            ...recruiter,
            ...payload,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function getConfiguration() {
    const store = readStore();
    return store.configuration;
}

function updateConfiguration(section, data) {
    const store = readStore();

    if (!store.configuration[section]) {
        store.configuration[section] = {};
    }

    store.configuration[section] = {
        ...store.configuration[section],
        ...data,
    };

    writeStore(store);
    return store.configuration;
}

function getAnalyticsSnapshot() {
    const store = readStore();

    const totalUsers = store.jobSeekers.length + store.recruiters.length;
    const activeUsersDaily = store.jobSeekers.filter((user) => user.status === 'Active').length + store.recruiters.filter((user) => user.status === 'Active').length;
    const activeUsersMonthly = activeUsersDaily + 6;
    const jobsPostedVolume = store.recruiters.reduce((sum, recruiter) => sum + toNumber(recruiter.jobsPosted), 0);
    const applicationsPerJob = jobsPostedVolume === 0 ? 0 : Number((store.jobSeekers.length * 2 / jobsPostedVolume).toFixed(2));

    const paidPayments = store.payments.filter((payment) => payment.status === 'Paid');
    const refundedPayments = store.payments.filter((payment) => payment.status === 'Refunded');
    const revenue = paidPayments.reduce((sum, payment) => sum + toNumber(payment.amount), 0);
    const refunds = refundedPayments.reduce((sum, payment) => sum + toNumber(payment.amount), 0);
    const netRevenue = revenue - refunds;

    const premiumOrEnterprise = store.recruiters.filter((recruiter) => recruiter.subscription === 'Premium' || recruiter.subscription === 'Enterprise').length;
    const previousPeriod = Math.max(1, premiumOrEnterprise - 1);
    const subscriptionGrowth = Number((((premiumOrEnterprise - previousPeriod) / previousPeriod) * 100).toFixed(2));
    const churnRate = Number((((store.recruiters.filter((recruiter) => recruiter.status === 'Suspended').length) / Math.max(1, store.recruiters.length)) * 100).toFixed(2));

    return {
        platform: {
            totalUsers,
            jobSeekers: store.jobSeekers.length,
            recruiters: store.recruiters.length,
            activeUsersDaily,
            activeUsersMonthly,
            jobPostingsVolume: jobsPostedVolume,
            applicationsPerJob,
        },
        hiring: {
            timeToHireDays: 18,
            conversionRateViewToApply: 24,
            topPerformingCompanies: store.recruiters.slice(0, 3).map((recruiter) => recruiter.company),
            topPerformingJobs: ['Senior Frontend Engineer', 'Backend Platform Engineer', 'Product Designer'],
        },
        financial: {
            revenue,
            refunds,
            netRevenue,
            subscriptionGrowth,
            churnRate,
        },
        exportActions: {
            scheduledReports: store.analytics.scheduledReports,
            exports: store.analytics.exports,
        },
    };
}

function createAnalyticsExport(format) {
    const store = readStore();
    const exportRecord = {
        id: Date.now(),
        format: String(format || 'CSV').toUpperCase(),
        createdAt: nowIso(),
        status: 'Completed',
    };

    store.analytics.exports.unshift(exportRecord);
    writeStore(store);
    return exportRecord;
}

function scheduleAnalyticsReport(payload) {
    const store = readStore();
    const record = {
        id: Date.now(),
        name: payload.name || 'Automated Report',
        format: String(payload.format || 'CSV').toUpperCase(),
        frequency: payload.frequency || 'Weekly',
        email: payload.email || 'admin@uprecruit.com',
        status: 'Active',
    };

    store.analytics.scheduledReports.unshift(record);
    writeStore(store);
    return record;
}

function getAdminJobPosting() {
    const store = readStore();
    const jobPosting = ensureJobPostingConfig(store);
    writeStore(store);

    return {
        templates: jobPosting.templates,
        jobs: jobPosting.jobs,
    };
}

function createAdminJobPost(payload) {
    const store = readStore();
    const jobPosting = ensureJobPostingConfig(store);
    const job = normalizeJobPayload(payload || {});

    job.id = Date.now();
    jobPosting.jobs.unshift(job);
    writeStore(store);

    return job;
}

function updateAdminJobPost(jobId, payload) {
    const store = readStore();
    const jobPosting = ensureJobPostingConfig(store);
    let updated = null;

    jobPosting.jobs = jobPosting.jobs.map((job) => {
        if (Number(job.id) !== Number(jobId)) {
            return job;
        }

        updated = normalizeJobPayload(payload || {}, job);
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function duplicateAdminJobPost(jobId) {
    const store = readStore();
    const jobPosting = ensureJobPostingConfig(store);
    const existing = jobPosting.jobs.find((job) => Number(job.id) === Number(jobId));

    if (!existing) {
        return null;
    }

    const duplicated = {
        ...existing,
        id: Date.now(),
        title: `${existing.title} (Copy)`,
        status: 'Draft',
        scheduledAt: null,
        publishedAt: null,
        isFeatured: false,
        promotion: { paid: false, plan: 'None' },
        boostCount: 0,
        refreshedAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };

    jobPosting.jobs.unshift(duplicated);
    writeStore(store);
    return duplicated;
}

function publishAdminJobPost(jobId) {
    return updateAdminJobPost(jobId, {
        status: 'Published',
        scheduledAt: null,
        publishedAt: nowIso(),
    });
}

function unpublishAdminJobPost(jobId) {
    return updateAdminJobPost(jobId, {
        status: 'Unpublished',
    });
}

function scheduleAdminJobPost(jobId, scheduledAt) {
    return updateAdminJobPost(jobId, {
        status: 'Scheduled',
        scheduledAt,
    });
}

function promoteAdminJobPost(jobId, payload) {
    return updateAdminJobPost(jobId, {
        isFeatured: true,
        paidPromotion: Boolean(payload && payload.paidPromotion),
        promotionPlan: payload && payload.promotionPlan ? payload.promotionPlan : 'Featured - 7 days',
    });
}

function refreshAdminJobPost(jobId) {
    const store = readStore();
    const jobPosting = ensureJobPostingConfig(store);
    let updated = null;

    jobPosting.jobs = jobPosting.jobs.map((job) => {
        if (Number(job.id) !== Number(jobId)) {
            return job;
        }

        updated = {
            ...job,
            boostCount: toNumber(job.boostCount) + 1,
            refreshedAt: nowIso(),
            updatedAt: nowIso(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

module.exports = {
    getJobSeekers,
    getJobSeekerById,
    updateJobSeekerState,
    deleteJobSeeker,
    exportUserData,
    getRecruiters,
    updateRecruiterState,
    getConfiguration,
    updateConfiguration,
    getAnalyticsSnapshot,
    createAnalyticsExport,
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
