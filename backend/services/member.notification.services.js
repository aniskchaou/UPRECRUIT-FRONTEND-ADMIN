const MemberNotification = require("../models/member.notification.models");

exports.findAllByUser = (userId, res) => {
    MemberNotification.findAll({ where: { userId: userId } })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error retrieving member notifications." });
        });
};

exports.createNotification = (payload, res) => {
    MemberNotification.create(payload)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error creating notification." });
        });
};

exports.updateNotification = (id, req, res) => {
    MemberNotification.update(req.body, { where: { id: id } })
        .then(() => res.send({ message: "Notification updated successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error updating notification with id=${id}` });
        });
};

exports.deleteNotification = (id, res) => {
    MemberNotification.destroy({ where: { id: id } })
        .then(() => res.send({ message: "Notification deleted successfully." }))
        .catch(err => {
            res.status(500).send({ message: err.message || `Error deleting notification with id=${id}` });
        });
};

exports.markAllAsReadByUser = (userId, res) => {
    MemberNotification.update(
        { readStatus: 'true' },
        { where: { userId: userId } }
    )
        .then(() => res.send({ message: "All notifications marked as read." }))
        .catch(err => {
            res.status(500).send({ message: err.message || "Error marking notifications as read." });
        });
};
