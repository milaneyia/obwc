"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../../shared/models");
const results_1 = require("../helpers/results");
const authentication_1 = require("../middlewares/authentication");
const Round_1 = require("../models/Round");
const roundsRouter = new router_1.default();
roundsRouter.prefix('/api/rounds');
roundsRouter.get('/', async (ctx) => {
    const rounds = await Round_1.Round.find({});
    ctx.body = rounds;
});
roundsRouter.get('/:id/results', authentication_1.simpleAuthenticate, async (ctx) => {
    const id = validator_1.default.toInt(ctx.params.id);
    const judgingType = ctx.query.type ? validator_1.default.toInt(ctx.query.type.toString()) : models_1.JUDGING_TYPE.Mappers;
    const scope = ctx.state?.user?.isStaff ? Round_1.ResultsScope.Staff : Round_1.ResultsScope.User;
    return ctx.body = await results_1.getRoundResults(id, judgingType, scope);
});
exports.default = roundsRouter;
