"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../middlewares/authentication");
const Contest_1 = require("../models/Contest");
const Round_1 = require("../models/Round");
const Team_1 = require("../models/Team");
const contestsRouter = new router_1.default();
contestsRouter.prefix('/api/contests');
contestsRouter.get('/', async (ctx) => {
    const contests = await Contest_1.Contest.find();
    ctx.body = contests;
});
contestsRouter.get('/open', async (ctx) => {
    const contests = await Contest_1.Contest.open().getMany();
    ctx.body = contests;
});
contestsRouter.get('/:id/rounds', async (ctx) => {
    const contestId = validator_1.default.toInt(ctx.params.id);
    const contest = await Contest_1.Contest.findOneOrFail({ id: contestId });
    const rounds = await Round_1.Round.find({
        where: {
            contest,
        },
        relations: [
            'judgeToRounds',
            'judgeToRounds.user',
            'judgeToRounds.judgingType',
            'songs',
        ],
    });
    ctx.body = rounds;
});
contestsRouter.get('/:id/teams', async (ctx) => {
    ctx.body = await Team_1.Team.createQueryBuilder('team')
        .innerJoinAndSelect('team.captain', 'captain')
        .innerJoinAndSelect('team.country', 'country')
        .leftJoinAndSelect('team.users', 'users')
        .where('team.wasConfirmed = true')
        .andWhere('team.contestId = :contestId', { contestId: ctx.params.id })
        .orderBy('country.name', 'ASC')
        .addOrderBy('team.name', 'ASC')
        .getMany();
});
contestsRouter.get('/:id/teams/mine', authentication_1.authenticate, async (ctx) => {
    const user = ctx.state.user;
    ctx.body = await Team_1.Team.findOne({
        where: {
            captain: user,
            contestId: ctx.params.id,
        },
        relations: [
            'contest',
            'users',
            'invitations',
        ],
    });
});
exports.default = contestsRouter;
