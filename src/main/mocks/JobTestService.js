const _jobs = [{
    "post": "Développeur Web", "location": "Paris",
    "start": "11/10/2020", "end": "11/11/2020", "state": "Active"
}]

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