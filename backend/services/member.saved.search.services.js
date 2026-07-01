const MemberSavedSearch = require("../models/member.saved.search.models");

exports.findAllByUser = (userId, res) => {
    MemberSavedSearch.findAll({ where: { userId: userId } })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving saved searches." });
        });
};

exports.createSavedSearch = (payload, res) => {
    MemberSavedSearch.create(payload)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error creating saved search." });
        });
};

exports.updateSavedSearch = (id, req, res) => {
    MemberSavedSearch.update(req.body, { where: { id: id } })
        .then(() => res.send({ message: "Saved search updated successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error updating saved search with id=${id}` });
        });
};

exports.deleteSavedSearch = (id, res) => {
    MemberSavedSearch.destroy({ where: { id: id } })
        .then(() => res.send({ message: "Saved search deleted successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error deleting saved search with id=${id}` });
        });
};
