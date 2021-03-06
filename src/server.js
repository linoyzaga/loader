const express = require('express');
const {
    createLoader
} = require('./middlewares/loader');
const {
    getManyUsers
} = require('./models/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`Server running on ${PORT}`);
});

// First Task
const getOneUser1 = createLoader(getManyUsers);
(async function main() {
    console.log(await getOneUser1(1));
    console.log(await getOneUser1(4));
})();

// Second Task
const getOneUser2 = createLoader(getManyUsers, {
    batchInterval: 100
});

(async function () {
    const user = getOneUser2(1);

    await new Promise((resolve) => setTimeout(resolve, 50))

    const rest = await Promise.all([getOneUser2(2), getOneUser2(3), getOneUser2(4)]);
})();

const getOneUser3 = createLoader(getManyUsers, {
    batchInterval: 100
});

(async function () {
    const user = getOneUser3(1);

    await new Promise((resolve) => setTimeout(resolve, 150))

    const rest = await Promise.all([getOneUser3(2), getOneUser3(3), getOneUser3(4)]);
})();

// Third Task
const getOneUser4 = createLoader(getManyUsers, {
    batchInterval: 100
});

(async function () {
    const rest = await Promise.all([
        getOneUser4(1),
        getOneUser4(2),
        getOneUser4(1),
        getOneUser4(2),
    ]);
})();

// Forth task
const getOneUser5 = createLoader(getManyUsers, {
    batchInterval: 100
});

(async function () {
    const user1 = await getOneUser5(1, {
        freshness: "1m"
    });
    const user2 = await getOneUser5(1, {
        freshness: "1m"
    });
    const user3 = await getOneUser5(1, {
        freshness: "1m"
    });
})();