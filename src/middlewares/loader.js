const createLoader = (getMany) => {
    return function(id) {
        return getMany([id]);
    };
};

module.exports = { createLoader };
