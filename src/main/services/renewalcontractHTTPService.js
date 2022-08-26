import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllRenewalcontract = () => {
    return http.get(`${BASE_URL}/api/renew`)
}
const createRenewalcontract = data => {
    return http.post(`${BASE_URL}/api/renew`, data);
};

const editRenewalcontract = (id, data) => {
    return http.put(`${BASE_URL}/api/renew/${id}`, data);
};

const removeRenewalcontract = id => {
    return http.delete(`${BASE_URL}/api/renew/${id}`);
};

export default {
    getAllRenewalcontract,
    createRenewalcontract,
    editRenewalcontract,
    removeRenewalcontract
};