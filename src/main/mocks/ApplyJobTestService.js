const _applyJob = [{ "full_name": "Martine Clavette", "email": "matine@gmail.com", "phone": "06 23 44 56 33" }]

const getAll = () => {
    return _applyJob;
};

const get = id => {
    return _applyJob.find(item => item.id === id);
};

const create = (data) => {
    _applyJob.push(data);
};

const update = (old, data) => {

    var foundIndex = _applyJob.findIndex(item => item === old);
    _applyJob[foundIndex] = data;
};

const remove = id => {
    _applyJob.splice(id, 1);
};

const removeAll = () => {

};

const findByTitle = title => {

};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle
};