import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getSummaryPage = () => {
    return http.get(`${BASE_URL}/api/summarypage`)
}

const editSummaryPage = (id, data) => {
    return http.put(`${BASE_URL}/api/summarypage/${id}`, data);
};


const getHeaderPage = () => {
    return http.get(`${BASE_URL}/api/headerpage`)
}

const editHeaderPage = (id, data) => {
    return http.put(`${BASE_URL}/api/headerpage/${id}`, data);
};

const getFooterPage = () => {
    return http.get(`${BASE_URL}/api/footerpage`)
}

const editFooterPage = (id, data) => {
    return http.put(`${BASE_URL}/api/footerpage/${id}`, data);
};

const getNewsLetterPage = () => {
    return http.get(`${BASE_URL}/api/newsletterpage`)
}

const editNewsLetterPage = (id, data) => {
    return http.put(`${BASE_URL}/api/newsletterpage/${id}`, data);
};

export default {
    getSummaryPage,
    editFooterPage,
    getFooterPage,
    editHeaderPage,
    getHeaderPage,
    getNewsLetterPage,
    editNewsLetterPage,
    editSummaryPage
};