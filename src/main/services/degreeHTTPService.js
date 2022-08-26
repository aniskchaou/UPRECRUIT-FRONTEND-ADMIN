import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllDegree = () => {
    return http.get(`${BASE_URL}/api/degree`)
}
const createDegree = data => {
    return http.post(`${BASE_URL}/api/degree`, data);
};

const editDegree = (id, data) => {
    return http.put(`${BASE_URL}/api/degree/${id}`, data);
};

const removeDegree = id => {
    return http.delete(`${BASE_URL}/api/degree/${id}`);
};

export default {
    getAllDegree,
    createDegree,
    editDegree,
    removeDegree
};