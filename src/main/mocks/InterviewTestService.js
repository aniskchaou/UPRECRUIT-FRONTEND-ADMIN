const _interview = []

const getAll = () => {
    return _interview;
};

const get = id => {
    return _interview.find(item => item.id === id);
};

const create = (data) => {
    _interview.push(data);
};

const update = (old, data) => {

    var foundIndex = _interview.findIndex(item => item === old);
    _interview[foundIndex] = data;
};

const remove = id => {
    _interview.splice(id, 1);
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