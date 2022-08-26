import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllLanguage = () => {
    return http.get(`${BASE_URL}/api/language`)
}
const createLanguage = data => {
    return http.post(`${BASE_URL}/api/language`, data);
};

const editLanguage = (id, data) => {
    return http.put(`${BASE_URL}/api/language/${id}`, data);
};

const removeLanguage = id => {
    return http.delete(`${BASE_URL}/api/language/${id}`);
};

export default {
    getAllLanguage,
    createLanguage,
    editLanguage,
    removeLanguage
};