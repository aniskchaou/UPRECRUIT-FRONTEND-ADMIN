
const {  findAllLocations, createLocation, findLocationById, deleteLocationById, updateLocation, deleteAllLocations } = require("../../services/location.services");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {
        city: req.body.city,
        country: req.body.country
    }
    createLocation(user,res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllLocations(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findLocationById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateLocation(id, req,res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteLocationById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllLocations(res)
};