const config = require("../config/connection.server");
const User = require("../models/user.models");

const resetCodes = new Map();



exports.findAllUsers = (res) => {

    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

exports.createUser = (user, res) => {
    User.findOne({ where: { username: user.username } })
        .then((existingUser) => {
            if (existingUser) {
                res.status(409).send({ message: "This email is already registered." });
                return null;
            }

            // Save user in the database
            return User.create(user).then(data => {
                res.send(data);
                return data;
            });
        })
        .catch(err => {
            const isDuplicate = err && err.name === 'SequelizeUniqueConstraintError';
            res.status(isDuplicate ? 409 : 500).send({
                message: isDuplicate
                    ? "This email is already registered."
                    : (err.message || "Some error occurred while creating the User.")
            });
        });
}

exports.findUserById = (id, res) => {
    User.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
}

exports.deleteUserById = (id, res) => {
    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

exports.updateUser = (id, req, res) => {
    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
}

exports.deleteAllUsers = (res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} User were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}

exports.loginUser = (username, password, res) => {
    User.findOne({ where: { username: username, password: password } })
        .then(data => {

            /*  config.user = data
             console.log(config.user) */
            if (data === null) {
                res.send({});
            } else {
                res.send(data);
            }

        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
}

exports.requestPasswordReset = (username, res) => {
    User.findOne({ where: { username: username } })
        .then((user) => {
            if (!user) {
                res.send({ success: true, message: 'If this account exists, a reset code has been generated.', code: '' });
                return;
            }

            const code = String(Math.floor(100000 + Math.random() * 900000));
            resetCodes.set(username, code);

            res.send({ success: true, message: 'Reset code generated for development.', code: code });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || 'Error requesting password reset.' });
        });
}

exports.resetPassword = (username, code, newPassword, res) => {
    const expectedCode = resetCodes.get(username);
    if (!expectedCode || String(expectedCode) !== String(code)) {
        res.status(400).send({ message: 'Invalid or expired reset code.' });
        return;
    }

    User.findOne({ where: { username: username } })
        .then((user) => {
            if (!user) {
                res.status(404).send({ message: 'User not found.' });
                return null;
            }

            return user.update({ password: newPassword });
        })
        .then((updatedUser) => {
            if (!updatedUser) {
                return;
            }

            resetCodes.delete(username);
            res.send({ success: true, message: 'Password reset successful.' });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || 'Error resetting password.' });
        });
}

exports.mockSocialLogin = (provider, email, res) => {
    const normalizedProvider = String(provider || '').toLowerCase();
    if (!['google', 'linkedin'].includes(normalizedProvider)) {
        res.status(400).send({ message: 'provider must be google or linkedin' });
        return;
    }

    const username = String(email || '').trim().toLowerCase();
    if (!username) {
        res.status(400).send({ message: 'email is required' });
        return;
    }

    User.findOne({ where: { username: username } })
        .then((existingUser) => {
            if (existingUser) {
                res.send(existingUser);
                return null;
            }

            return User.create({
                username: username,
                password: `${normalizedProvider}-oauth`,
            }).then((createdUser) => {
                res.send(createdUser);
                return createdUser;
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || 'Error during social login.' });
        });
}