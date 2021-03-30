import './database';
import app from './app';
import config from '../config.json';

app.listen(config.KOA.PORT);
