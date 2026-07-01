const { updateNewsLetter,findNewsLetter,updateSummary,findSummary,findFooter,updateFooter,updateHeader,findHeader,findInsightContent} = require("../../services/frontoffice.service");

exports.findHeader = (req, res) => {
    findHeader(res)
};

exports.updateHeader = (req, res) => {
    const id = req.params.id;
    updateHeader(id, req, res)
};

exports.findFooter= (req, res) => {
    findFooter(res)
};

exports.updateFooter = (req, res) => {
    const id = req.params.id;
    updateFooter(id, req, res)
};

exports.findSummary = (req, res) => {
    findSummary(res)
};

exports.updateSummary = (req, res) => {
    const id = req.params.id;
    updateSummary(id, req, res)
};

exports.findNewsLetter = (req, res) => {
    findNewsLetter(res)
};

exports.updateNewsLetter = (req, res) => {
    const id = req.params.id;
    updateNewsLetter(id, req, res)
};

exports.findInsightContent = (req, res) => {
    findInsightContent(res)
};