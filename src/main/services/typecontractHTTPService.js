import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllTypeContract = () => {
    return http.get(`${BASE_URL}/api/typecontract`)
}
const createTypeContract = data => {
    return http.post(`${BASE_URL}/api/typecontract`, data);
};

const editTypeContract = (id, data) => {
    return http.put(`${BASE_URL}/api/typecontract/${id}`, data);
};

const removeTypeContract = id => {
    return http.delete(`${BASE_URL}/api/typecontract/${id}`);
};

export default {
    getAllTypeContract,
    createTypeContract,
    editTypeContract,
    removeTypeContract
};