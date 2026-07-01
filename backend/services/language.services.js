const Language = require("../models/language.models");


exports.findAllLanguages = (res) => {

    Language.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Languages."
            });
        });
}

exports.createLanguage = (language,res) => {
    // Save Language in the database
    Language.create(language)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Language."
            });
        });
}

exports.findLanguageById = (id, res) => {
    Language.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Language with id=" + id
            });
        });
}

exports.deleteLanguageById = (id, res) => {
    Language.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Language was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Language with id=${id}. Maybe Language was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Language with id=" + id
            });
        });
}

exports.updateLanguage = (id, req, res) => {
    Language.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Language was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Language with id=${id}. Maybe Language was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Language with id=" + id
            });
        });
}

exports.deleteAllLanguages = (res) => {
    Language.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Language were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}