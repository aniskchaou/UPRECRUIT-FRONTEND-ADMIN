const {
    findAll,
    findAllByUser,
    createMessage,
    updateMessage,
    deleteMessage,
} = require("../../services/member.message.services");

exports.findAllAdmin = (req, res) => {
    findAll(req, res);
};

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

    createMessage(req.body, res);
};

exports.update = (req, res) => {
    updateMessage(req.params.id, req, res);
};

exports.delete = (req, res) => {
    deleteMessage(req.params.id, res);
};
