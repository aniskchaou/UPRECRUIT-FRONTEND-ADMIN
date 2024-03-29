import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllStaff = () => {
    return http.get(`${BASE_URL}/api/staff`)
}
const createStaff = data => {
    return http.post(`${BASE_URL}/api/staff`, data);
};

const editStaff = (id, data) => {
    return http.put(`${BASE_URL}/api/staff/${id}`, data);
};

const removeStaff = id => {
    return http.delete(`${BASE_URL}/api/staff/${id}`);
};

export default {
    getAllStaff,
    createStaff,
    editStaff,
    removeStaff
};