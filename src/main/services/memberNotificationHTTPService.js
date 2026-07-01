import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getByUser = (userId) => http.get(`${BASE_URL}/api/member/notification`, { params: { userId } });
const create = (data) => http.post(`${BASE_URL}/api/member/notification`, data);
const update = (id, data) => http.put(`${BASE_URL}/api/member/notification/${id}`, data);
const remove = (id) => http.delete(`${BASE_URL}/api/member/notification/${id}`);
const markAsRead = (id) => http.put(`${BASE_URL}/api/member/notification/${id}`, { readStatus: 'true' });
const markAllAsRead = (userId) => http.put(`${BASE_URL}/api/member/notification/mark-all-read/${userId}`);

export default {
    getByUser,
    create,
    update,
    remove,
    markAsRead,
    markAllAsRead,
};
