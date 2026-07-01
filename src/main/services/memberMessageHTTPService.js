import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAll = () => http.get(`${BASE_URL}/api/admin/messages`);
const getByUser = (userId) => http.get(`${BASE_URL}/api/member/message`, { params: { userId } });
const create = (data) => http.post(`${BASE_URL}/api/member/message`, data);
const update = (id, data) => http.put(`${BASE_URL}/api/member/message/${id}`, data);
const remove = (id) => http.delete(`${BASE_URL}/api/member/message/${id}`);

export default {
    getAll,
    getByUser,
    create,
    update,
    remove,
};
