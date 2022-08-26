import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCandidate = () => {
    return http.get(`${BASE_URL}/api/candidate`)
}
const createCandidate = data => {
    return http.post(`${BASE_URL}/api/candidate`, data);
};

const editCandidate = (id, data) => {
    return http.put(`${BASE_URL}/api/candidate/${id}`, data);
};

const removeCandidate = id => {
    return http.delete(`${BASE_URL}/api/candidate/${id}`);
};

export default {
    getAllCandidate,
    createCandidate,
    editCandidate,
    removeCandidate
};