import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getByUser = (userId) => http.get(`${BASE_URL}/api/member/saved-search`, { params: { userId } });
const create = (data) => http.post(`${BASE_URL}/api/member/saved-search`, data);
const update = (id, data) => http.put(`${BASE_URL}/api/member/saved-search/${id}`, data);
const remove = (id) => http.delete(`${BASE_URL}/api/member/saved-search/${id}`);

export default {
    getByUser,
    create,
    update,
    remove,
};
