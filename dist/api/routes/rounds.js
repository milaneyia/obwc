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
const Criteria_1 = require("../models/judging/Criteria");
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
    const [round, criterias] = await Promise.all([
        Round_1.Round.findResults(id, judgingType, scope),
        Criteria_1.Criteria.find({
            judgingTypeId: judgingType,
        }),
    ]);
    const judges = round?.judgeToRounds.map(j => j.user);
    const { teamsScores, judgesCorrel } = await results_1.calculateScores(round);
    return ctx.body = {
        criterias,
        round,
        judges,
        teamsScores,
        judgesCorrel,
    };
});
exports.default = roundsRouter;
