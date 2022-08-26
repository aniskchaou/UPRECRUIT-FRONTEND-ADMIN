import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllInterview = () => {
    return http.get(`${BASE_URL}/api/interview`)
}
const createInterview = data => {
    return http.post(`${BASE_URL}/api/interview`, data);
};

const editInterview = (id, data) => {
    return http.put(`${BASE_URL}/api/interview/${id}`, data);
};

const removeInterview = id => {
    return http.delete(`${BASE_URL}/api/interview/${id}`);
};

export default {
    getAllInterview,
    createInterview,
    editInterview,
    removeInterview
};