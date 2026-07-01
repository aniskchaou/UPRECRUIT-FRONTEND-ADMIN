
const {
    loginUser,
    findAllUsers,
    createUser,
    findUserById,
    deleteUserById,
    updateUser,
    deleteAllUsers,
    requestPasswordReset,
    resetPassword,
    mockSocialLogin,
} = require("../../services/user.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "Username and password are required."
        });
        return;
    }
    // Create a user
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    createUser(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllUsers(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findUserById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateUser(id, req)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteUserById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllUsers(res)
};

exports.login = (req, res) => {

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const user = {
        username: req.body.username,
        password: req.body.password,

    }

    loginUser(user.username, user.password, res)
};

exports.requestReset = (req, res) => {
    if (!req.body || !req.body.username) {
        res.status(400).send({ message: "username is required" });
        return;
    }

    requestPasswordReset(req.body.username, res);
};

exports.resetPassword = (req, res) => {
    if (!req.body || !req.body.username || !req.body.code || !req.body.newPassword) {
        res.status(400).send({ message: "username, code and newPassword are required" });
        return;
    }

    resetPassword(req.body.username, req.body.code, req.body.newPassword, res);
};

exports.socialLogin = (req, res) => {
    if (!req.body || !req.body.provider || !req.body.email) {
        res.status(400).send({ message: "provider and email are required" });
        return;
    }

    mockSocialLogin(req.body.provider, req.body.email, res);
};
