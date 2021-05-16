"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
typeorm_1.createConnection().then(() => {
    console.log('DB initializated');
}).catch((err) => {
    console.log(err);
});
