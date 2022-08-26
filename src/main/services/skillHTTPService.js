import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllSkill = () => {
    return http.get(`${BASE_URL}/api/skill`)
}
const createSkill = data => {
    return http.post(`${BASE_URL}/api/skill`, data);
};

const editSkill = (id, data) => {
    return http.put(`${BASE_URL}/api/skill/${id}`, data);
};

const removeSkill = id => {
    return http.delete(`${BASE_URL}/api/skill/${id}`);
};

export default {
    getAllSkill,
    createSkill,
    editSkill,
    removeSkill
};