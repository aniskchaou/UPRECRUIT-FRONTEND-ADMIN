import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getByUser = (userId) => http.get(`${BASE_URL}/api/member/profile/${userId}`);
const upsert = (userId, data) => http.put(`${BASE_URL}/api/member/profile/${userId}`, data);
const addResume = (userId, data) => http.post(`${BASE_URL}/api/member/profile/${userId}/resume`, data);
const updateResume = (userId, resumeId, data) => http.put(`${BASE_URL}/api/member/profile/${userId}/resume/${resumeId}`, data);
const removeResume = (userId, resumeId) => http.delete(`${BASE_URL}/api/member/profile/${userId}/resume/${resumeId}`);

export default {
    getByUser,
    upsert,
    addResume,
    updateResume,
    removeResume,
};
