import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllLocation = () => {
    return http.get(`${BASE_URL}/api/location`)
}
const createLocation = data => {
    return http.post(`${BASE_URL}/api/location`, data);
};

const editLocation = (id, data) => {
    return http.put(`${BASE_URL}/api/location/${id}`, data);
};

const removeLocation = id => {
    return http.delete(`${BASE_URL}/api/location/${id}`);
};

export default {
    getAllLocation,
    createLocation,
    editLocation,
    removeLocation
};