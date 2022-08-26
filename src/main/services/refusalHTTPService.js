import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllRefusal = () => {
    return http.get(`${BASE_URL}/api/refusal`)
}
const createRefusal = data => {
    return http.post(`${BASE_URL}/api/refusal`, data);
};

const editRefusal = (id, data) => {
    return http.put(`${BASE_URL}/api/refusal/${id}`, data);
};

const removeRefusal = id => {
    return http.delete(`${BASE_URL}/api/refusal/${id}`);
};

export default {
    getAllRefusal,
    createRefusal,
    editRefusal,
    removeRefusal
};