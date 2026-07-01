import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllRoles = () => {
    return http.get(`${BASE_URL}/api/role`);
};

const createRole = data => {
    return http.post(`${BASE_URL}/api/role`, data);
};

const editRole = (id, data) => {
    return http.put(`${BASE_URL}/api/role/${id}`, data);
};

const removeRole = id => {
    return http.delete(`${BASE_URL}/api/role/${id}`);
};

export default {
    getAllRoles,
    createRole,
    editRole,
    removeRole,
};
