import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCompany = () => {
    return http.get(`${BASE_URL}/api/company`)
}
/* const createCompany = data => {
    return http.post(`${BASE_URL}/api/company`, data);
}; */

const editCompany = (id, data) => {
    return http.put(`${BASE_URL}/api/company/${id}`, data);
};

const removeCompany = id => {
    return http.delete(`${BASE_URL}/api/company/${id}`);
};

const createCompany = (filename, data) => {
    return http.post(`${BASE_URL}/api/company/${filename}`, data);
};

const uploadFile = (data) => {
    return http.post(`${BASE_URL}/api/company/image/uploadfile`, data);
};

export default {
    getAllCompany,
    createCompany,
    editCompany,
    removeCompany,
    uploadFile
};