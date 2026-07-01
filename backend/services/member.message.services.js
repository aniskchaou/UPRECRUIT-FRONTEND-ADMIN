const MemberMessage = require("../models/member.message.models");

exports.findAll = (req, res) => {
    MemberMessage.findAll()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving messages." });
        });
};

exports.findAllByUser = (userId, res) => {
    MemberMessage.findAll({ where: { userId: userId } })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving member messages." });
        });
};

exports.createMessage = (payload, res) => {
    MemberMessage.create(payload)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error creating member message." });
        });
};

exports.updateMessage = (id, req, res) => {
    MemberMessage.update(req.body, { where: { id: id } })
        .then(() => res.send({ message: "Member message updated successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error updating member message with id=${id}` });
        });
};

exports.deleteMessage = (id, res) => {
    MemberMessage.destroy({ where: { id: id } })
        .then(() => res.send({ message: "Member message deleted successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error deleting member message with id=${id}` });
        });
};
