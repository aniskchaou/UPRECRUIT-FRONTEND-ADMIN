import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getByUser = (userId) => http.get(`${BASE_URL}/api/member/preferences/${userId}`);
const upsert = (userId, data) => http.put(`${BASE_URL}/api/member/preferences/${userId}`, data);

export default {
    getByUser,
    upsert,
};
