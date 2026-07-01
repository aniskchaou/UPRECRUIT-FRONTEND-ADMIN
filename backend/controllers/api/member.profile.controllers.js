const {
    findByUser,
    upsertByUser,
    addResumeVersion,
    updateResumeVersion,
    deleteResumeVersion,
} = require("../../services/member.profile.services");

exports.findOne = (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    findByUser(userId, res);
};

exports.upsert = (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    upsertByUser(userId, req.body || {}, res);
};

exports.addResume = (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    addResumeVersion(userId, req.body || {}, res);
};

exports.updateResume = (req, res) => {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    if (!userId || !resumeId) {
        res.status(400).send({ message: "userId and resumeId are required" });
        return;
    }

    updateResumeVersion(userId, resumeId, req.body || {}, res);
};

exports.deleteResume = (req, res) => {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    if (!userId || !resumeId) {
        res.status(400).send({ message: "userId and resumeId are required" });
        return;
    }

    deleteResumeVersion(userId, resumeId, res);
};
