const _jobs = []

const getAll = () => {
    return _jobs;
};

const get = id => {
    return _jobs.find(item => item.id === id);
};

const create = (data) => {
    _jobs.push(data);
};

const update = (old, data) => {

    var foundIndex = _jobs.findIndex(item => item === old);
    _jobs[foundIndex] = data;
};

const remove = id => {
    _jobs.splice(id, 1);
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