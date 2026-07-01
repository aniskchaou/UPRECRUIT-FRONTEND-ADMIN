const {
    findByUser,
    upsertByUser,
} = require("../../services/member.preference.services");

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
