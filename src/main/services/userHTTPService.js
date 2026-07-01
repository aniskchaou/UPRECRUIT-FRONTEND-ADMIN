import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllUser = () => {
    return http.get(`${BASE_URL}/api/user`)
}
const createUser = data => {
    return http.post(`${BASE_URL}/api/user`, data);
};

const editUser = (id, data) => {
    return http.put(`${BASE_URL}/api/user/${id}`, data);
};

const removeUser = id => {
    return http.delete(`${BASE_URL}/api/user/${id}`);
};

const login = data => {
    return http.post(`${BASE_URL}/api/user/login`, data);
};

const requestReset = data => {
    return http.post(`${BASE_URL}/api/user/request-reset`, data);
};

const resetPassword = data => {
    return http.post(`${BASE_URL}/api/user/reset-password`, data);
};

const socialLogin = data => {
    return http.post(`${BASE_URL}/api/user/social-login`, data);
};

export default {
    getAllUser,
    createUser,
    editUser,
    removeUser,
    login,
    requestReset,
    resetPassword,
    socialLogin
};