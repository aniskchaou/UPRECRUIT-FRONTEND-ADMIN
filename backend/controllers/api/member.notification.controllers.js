const {
    findAllByUser,
    createNotification,
    updateNotification,
    deleteNotification,
    markAllAsReadByUser,
} = require("../../services/member.notification.services");

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

    createNotification(req.body, res);
};

exports.update = (req, res) => {
    updateNotification(req.params.id, req, res);
};

exports.delete = (req, res) => {
    deleteNotification(req.params.id, res);
};

exports.markAllAsRead = (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send({ message: "userId is required" });
        return;
    }

    markAllAsReadByUser(userId, res);
};
