const uniq = require('lodash/uniq');
const ms = require('humanize-ms');
const LRU = require('lru-cache'),
    options = {
        max: 1000
    },
    cache = new LRU(options);

function getOne(ids, getMany) {
    return getMany(ids);
};

function getFromCache(ids, freshness) {
    const cachedIdsData = [];
    const notCachedIds = [];

    ids.map((id) => {
        const value = cache.get(id);

        if (value && isFresh(freshness.id, value.time)) {
            cachedIdsData.push(value.data);
        } else {
            notCachedIds.push(id)
        };
    })

    return {
        cachedIdsData,
        notCachedIds
    };
}

function isFresh(timeOfFresh, timeSaved) {
    if (timeOfFresh) {
        if (Date.now() - timeSaved > timeOfFresh) {
            return false;
        }
    };

    return true;
}

function setInCache(ids, result) {
    ids.map((id, i) => {
        cache.set(id, {
            data: result[i],
            time: Date.now
        });
    });
}

const createLoader = (getMany, options = {
    batchInterval: 0
}) => {
    const resolves = [];
    const freshnessHash = {};

    var ids = [];
    var resultFromDB;

    setInterval(async () => {
        if (ids.length !== 0) {
            const uniqIds = uniq(ids);
            const {
                cachedIdsData,
                notCachedIds
            } = getFromCache(uniqIds, freshnessHash);

            try {
                if (notCachedIds.length !== 0) {
                    resultFromDB = await getOne(notCachedIds, getMany);
                    setInCache(notCachedIds, resultFromDB);
                }
            } catch (e) {
                console.log(`Error ocuured: ${e}`)
            }

            ids = [];

            const result = resultFromDB ? resultFromDB.concat(cachedIdsData) : cachedIdsData;
            resolves.map(res => res(result));
        }
    }, options.batchInterval);

    return function (id, options = {
        freshness: null
    }) {
        ids.push(id);

        if (options.freshness) {
            freshnessHash[id] = ms(options.freshness);
        };

        return new Promise((res) => {
            resolves.push(res);
        });;
    };
};

module.exports = {
    createLoader
};