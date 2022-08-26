import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllJob = () => {
    return http.get(`${BASE_URL}/api/job`)
}
const createJob = data => {
    return http.post(`${BASE_URL}/api/job`, data);
};

const editJob = (id, data) => {
    return http.put(`${BASE_URL}/api/job/${id}`, data);
};

const removeJob = id => {
    return http.delete(`${BASE_URL}/api/job/${id}`);
};

export default {
    getAllJob,
    createJob,
    editJob,
    removeJob
};