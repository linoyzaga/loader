const uniq = require('lodash/uniq');

function getOne(ids, getMany) {
    return getMany(ids);
};

const createLoader = (getMany, options = {batchInterval: 0}) => {
    const interval = options.batchInterval;
    const resolves = [];
    
    var ids = [];
    var result;

    setInterval(async() => {
        if (ids.length !== 0) {
            result = await getOne(uniq(ids), getMany);
            ids = [];
            resolves.map(res => res(result));
        }
    }, interval);

    return function(id) {
        ids.push(id);

        return new Promise((res) => {
            resolves.push(res);
        });;
    };
};

module.exports = { createLoader };
