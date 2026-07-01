const {
    findAllByUser,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
} = require("../../services/member.saved.search.services");

exports.findAll = (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    findAllByUser(userId, res);
};

exports.create = (req, res) => {
    if (!req.body || !req.body.userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    createSavedSearch(req.body, res);
};

exports.update = (req, res) => {
    updateSavedSearch(req.params.id, req, res);
};

exports.delete = (req, res) => {
    deleteSavedSearch(req.params.id, res);
};
