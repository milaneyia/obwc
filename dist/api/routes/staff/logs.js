"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const typeorm_1 = require("typeorm");
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../../middlewares/authentication");
const Log_1 = require("../../models/Log");
const staffLogsRouter = new router_1.default();
staffLogsRouter.prefix('/api/staff/logs');
staffLogsRouter.use(authentication_1.authenticate);
staffLogsRouter.use(authentication_1.isStaff);
staffLogsRouter.get('/', async (ctx) => {
    ctx.body = await Log_1.Log.find({
        where: {
            type: typeorm_1.Not(Log_1.LOG_TYPE.Error),
        },
        order: {
            createdAt: 'DESC',
        },
        take: 30,
        skip: 30 * validator_1.default.toInt(ctx.query.page?.toString() || '0'),
    });
});
exports.default = staffLogsRouter;
