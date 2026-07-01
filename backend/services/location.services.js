const Location = require("../models/location.models");


exports.findAllLocations = (res) => {

    Location.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Locations."
            });
        });
}

exports.createLocation = (location,res) => {
    // Save Location in the database
    Location.create(location)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Location."
            });
        });
}

exports.findLocationById = (id, res) => {
    Location.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Location with id=" + id
            });
        });
}

exports.deleteLocationById = (id, res) => {
    Location.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Location was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Location with id=${id}. Maybe Location was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Location with id=" + id
            });
        });
}

exports.updateLocation = (id, req, res) => {
    Location.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Location was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Location with id=" + id
            });
        });
}

exports.deleteAllLocations = (res) => {
    Location.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Location were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}