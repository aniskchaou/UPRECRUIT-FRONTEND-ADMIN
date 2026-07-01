const MemberPreference = require("../models/member.preference.models");

exports.findByUser = (userId, res) => {
    MemberPreference.findOne({ where: { userId: userId } })
        .then(data => res.send(data || {}))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving member preferences." });
        });
};

exports.upsertByUser = (userId, payload, res) => {
    MemberPreference.findOne({ where: { userId: userId } })
        .then((existing) => {
            if (!existing) {
                return MemberPreference.create({ ...payload, userId: userId });
            }

            return existing.update(payload);
        })
        .then((data) => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error saving member preferences." });
        });
};
