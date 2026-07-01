const {
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
} = require('../../services/admin.services');

exports.findJobSeekers = (req, res) => {
    const data = getJobSeekers(req.query || {});
    res.send(data);
};

exports.findJobSeekerActivity = (req, res) => {
    const user = getJobSeekerById(req.params.id);
    if (!user) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send({ id: user.id, fullName: user.fullName, email: user.email, activity: user.activity || [] });
};

exports.updateJobSeeker = (req, res) => {
    const updated = updateJobSeekerState(req.params.id, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send(updated);
};

exports.resetJobSeekerPassword = (req, res) => {
    const user = getJobSeekerById(req.params.id);
    if (!user) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send({ message: `Password reset initiated for ${user.email}.` });
};

exports.impersonateJobSeeker = (req, res) => {
    const user = getJobSeekerById(req.params.id);
    if (!user) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send({
        message: `Impersonation token generated for ${user.fullName}.`,
        impersonationToken: `imp-${user.id}-${Date.now()}`,
    });
};

exports.deleteJobSeeker = (req, res) => {
    const mode = req.query.mode === 'hard' ? 'hard' : 'soft';
    const result = deleteJobSeeker(req.params.id, mode);

    if (!result) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send(result);
};

exports.exportJobSeekerData = (req, res) => {
    const exported = exportUserData(req.params.id);
    if (!exported) {
        res.status(404).send({ message: 'Job seeker not found.' });
        return;
    }

    res.send(exported);
};

exports.findRecruiters = (req, res) => {
    res.send(getRecruiters());
};

exports.updateRecruiter = (req, res) => {
    const updated = updateRecruiterState(req.params.id, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Recruiter not found.' });
        return;
    }

    res.send(updated);
};

exports.findConfiguration = (req, res) => {
    res.send(getConfiguration());
};

exports.updateConfiguration = (req, res) => {
    const section = req.params.section;
    if (!section) {
        res.status(400).send({ message: 'section is required.' });
        return;
    }

    const updated = updateConfiguration(section, req.body || {});
    res.send(updated);
};

exports.findAnalytics = (req, res) => {
    res.send(getAnalyticsSnapshot());
};

exports.exportAnalytics = (req, res) => {
    const format = req.body && req.body.format ? req.body.format : 'CSV';
    const record = createAnalyticsExport(format);
    res.send(record);
};

exports.scheduleReport = (req, res) => {
    const payload = req.body || {};
    const record = scheduleAnalyticsReport(payload);
    res.send(record);
};

exports.findAdminJobPosting = (req, res) => {
    res.send(getAdminJobPosting());
};

exports.createAdminJobPosting = (req, res) => {
    const payload = req.body || {};
    const created = createAdminJobPost(payload);
    res.status(201).send(created);
};

exports.updateAdminJobPosting = (req, res) => {
    const updated = updateAdminJobPost(req.params.id, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};

exports.duplicateAdminJobPosting = (req, res) => {
    const duplicated = duplicateAdminJobPost(req.params.id);
    if (!duplicated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(duplicated);
};

exports.publishAdminJobPosting = (req, res) => {
    const updated = publishAdminJobPost(req.params.id);
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};

exports.unpublishAdminJobPosting = (req, res) => {
    const updated = unpublishAdminJobPost(req.params.id);
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};

exports.scheduleAdminJobPosting = (req, res) => {
    const scheduledAt = req.body && req.body.scheduledAt;
    if (!scheduledAt) {
        res.status(400).send({ message: 'scheduledAt is required.' });
        return;
    }

    const updated = scheduleAdminJobPost(req.params.id, scheduledAt);
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};

exports.promoteAdminJobPosting = (req, res) => {
    const updated = promoteAdminJobPost(req.params.id, req.body || {});
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};

exports.refreshAdminJobPosting = (req, res) => {
    const updated = refreshAdminJobPost(req.params.id);
    if (!updated) {
        res.status(404).send({ message: 'Job post not found.' });
        return;
    }

    res.send(updated);
};
