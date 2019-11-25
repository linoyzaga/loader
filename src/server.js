const express = require('express');
const { createLoader } = require('./middlewares/loader');
const { getManyUsers } = require('./models/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`Server running on ${PORT}`);
});

const getOneUser = createLoader(getManyUsers);
(async function main(){
    console.log(await getOneUser(1));
    console.log(await getOneUser(4));
    }
)();
