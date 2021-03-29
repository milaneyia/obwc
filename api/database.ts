import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection().then(() => {
    console.log('DB initializated');
}).catch((err) => {
    console.log(err);
});
