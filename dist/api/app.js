"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const config_json_1 = __importDefault(require("../config.json"));
const auth_1 = __importDefault(require("./routes/auth"));
const contests_1 = __importDefault(require("./routes/contests"));
const rounds_1 = __importDefault(require("./routes/rounds"));
const teams_1 = __importDefault(require("./routes/teams"));
const users_1 = __importDefault(require("./routes/users"));
const judging_1 = __importDefault(require("./routes/judging"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const teams_2 = __importDefault(require("./routes/staff/teams"));
const contests_2 = __importDefault(require("./routes/staff/contests"));
const rounds_2 = __importDefault(require("./routes/staff/rounds"));
const submissions_2 = __importDefault(require("./routes/staff/submissions"));
const logs_1 = __importDefault(require("./routes/staff/logs"));
const Log_1 = require("./models/Log");
const app = new koa_1.default();
app.keys = config_json_1.default.KOA.SESSION_KEYS;
// Middlewares
if (app.env === 'development') {
    app.use(koa_logger_1.default());
}
app.use(koa_helmet_1.default());
app.use(koa_session_1.default({
    key: 'obwc.sess',
    renew: true,
    signed: true,
    maxAge: 86400000 * 5,
    sameSite: 'lax',
}, app));
app.use(koa_bodyparser_1.default());
// Error handler
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.app.emit('error', err, ctx);
    }
});
// Public routes
app.use(auth_1.default.routes());
app.use(users_1.default.routes());
app.use(contests_1.default.routes());
app.use(rounds_1.default.routes());
app.use(teams_1.default.routes());
app.use(judging_1.default.routes());
app.use(submissions_1.default.routes());
// Staff routes
app.use(teams_2.default.routes());
app.use(contests_2.default.routes());
app.use(rounds_2.default.routes());
app.use(submissions_2.default.routes());
app.use(logs_1.default.routes());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.on('error', (err, ctx) => {
    if (app.env === 'development') {
        console.log('Error caught', err);
    }
    else {
        Log_1.Log.createAndSave(JSON.stringify(err), Log_1.LOG_TYPE.Error);
    }
});
exports.default = app;
