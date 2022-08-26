import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCategory = () => {
    return http.get(`${BASE_URL}/api/category`)
}
const createCategory = data => {
    return http.post(`${BASE_URL}/api/category`, data);
};

const editCategory = (id, data) => {
    return http.put(`${BASE_URL}/api/category/${id}`, data);
};

const removeCategory = id => {
    return http.delete(`${BASE_URL}/api/category/${id}`);
};

export default {
    getAllCategory,
    createCategory,
    editCategory,
    removeCategory
};