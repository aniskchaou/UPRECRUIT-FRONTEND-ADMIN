import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllApply = () => {
    return http.get(`${BASE_URL}/api/apply`)
}
const createApply = data => {
    return http.post(`${BASE_URL}/api/apply`, data);
};

const editApply = (id, data) => {
    return http.put(`${BASE_URL}/api/apply/${id}`, data);
};

const removeApply = id => {
    return http.delete(`${BASE_URL}/api/apply/${id}`);
};
const getAllFirstInterview = () => {
    return http.get(`${BASE_URL}/api/firstinterview`)
}

const getAllSecondInterview = () => {
    return http.get(`${BASE_URL}/api/secondinterview`)
}

const getAllInitialQualification = () => {
    return http.get(`${BASE_URL}/api/initialqualification`)
}

const getAllContractProposal = () => {
    return http.get(`${BASE_URL}/api/contractproposal`)
}

const getAllContractSigned = () => {
    return http.get(`${BASE_URL}/api/contractsigned`)
}
export default {
    getAllApply,
    createApply,
    editApply,
    removeApply,
    getAllFirstInterview,
    getAllSecondInterview,
    getAllInitialQualification,
    getAllContractProposal,
    getAllContractSigned

};