import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllExperience = () => {
    return http.get(`${BASE_URL}/api/experience`)
}
const createExperience = data => {
    return http.post(`${BASE_URL}/api/experience`, data);
};

const editExperience = (id, data) => {
    return http.put(`${BASE_URL}/api/experience/${id}`, data);
};

const removeExperience = id => {
    return http.delete(`${BASE_URL}/api/experience/${id}`);
};



export default {
    getAllExperience,
    createExperience,
    editExperience,
    removeExperience,


};