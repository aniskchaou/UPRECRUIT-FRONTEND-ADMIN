
const { findAllCompanys, createCompany, findCompanyById, deleteCompanyById, updateCompany, deleteAllCompanys } = require("../../services/company.services");
const multer = require("multer");
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
        name: req.body.name,
        email: req.body.email,
        category: req.body.category,
        telephone: req.body.telephone,
        address: req.body.address,
        website: req.body.website,
        size: req.body.size,
        logo: req.params.fileName
    }
    createCompany(user, res)
};

exports.addImage = (req, res) => {
    console.log("uploading")
    // console.log(req.body)
    // SET STORAGE
    // const fileName = req.body.file[0].name
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'views/assets/uploads')
        },
        filename: function (req, file, cb) {
            console.log(file)
            cb(null, file.originalname)
        }
    })

    var upload = multer({ storage: storage }).single('file')

    upload(req, res, function (err) {

        if (err) {

            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            console.log("errrrroeeeee")
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
}

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllCompanys(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findCompanyById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateCompany(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCompanyById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllCompanys(res)
};