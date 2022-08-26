import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllEducation = () => {
    return http.get(`${BASE_URL}/api/education`)
}
const createEducation = data => {
    return http.post(`${BASE_URL}/api/education`, data);
};

const editEducation = (id, data) => {
    return http.put(`${BASE_URL}/api/education/${id}`, data);
};

const removeEducation = id => {
    return http.delete(`${BASE_URL}/api/education/${id}`);
};

export default {
    getAllEducation,
    createEducation,
    editEducation,
    removeEducation
};