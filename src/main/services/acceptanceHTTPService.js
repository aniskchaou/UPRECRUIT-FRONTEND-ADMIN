import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllAcceptance = () => {
    return http.get(`${BASE_URL}/api/acceptance`)
}
const createAcceptance = data => {
    return http.post(`${BASE_URL}/api/acceptance`, data);
};

const editAcceptance = (id, data) => {
    return http.put(`${BASE_URL}/api/acceptance/${id}`, data);
};

const removeAcceptance = id => {
    return http.delete(`${BASE_URL}/api/acceptance/${id}`);
};

export default {
    getAllAcceptance,
    createAcceptance,
    editAcceptance,
    removeAcceptance
};