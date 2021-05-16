"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../../middlewares/authentication");
const Contest_1 = require("../../models/Contest");
const Team_1 = require("../../models/Team");
const staffContestsRouter = new router_1.default();
staffContestsRouter.prefix('/api/staff/contests');
staffContestsRouter.use(authentication_1.authenticate);
staffContestsRouter.use(authentication_1.isStaff);
staffContestsRouter.put('/:id', async (ctx) => {
    const contestId = validator_1.default.toInt(ctx.params.id);
    const body = ctx.request.body;
    body.name = validator_1.default.trim(body.name);
    const contest = await Contest_1.Contest.findOneOrFail({ id: contestId });
    contest.name = body.name;
    contest.announcementAt = body.announcementAt;
    contest.registrationStartedAt = body.registrationStartedAt;
    contest.registrationEndedAt = body.registrationEndedAt;
    await contest.save();
    ctx.body = contest;
});
staffContestsRouter.get('/:id/teams', async (ctx) => {
    ctx.body = await Team_1.Team.createQueryBuilder('team')
        .innerJoinAndSelect('team.captain', 'captain')
        .innerJoinAndSelect('team.country', 'country')
        .leftJoinAndSelect('team.users', 'users')
        .leftJoinAndSelect('team.invitations', 'invitations')
        .where('team.contestId = :contestId', { contestId: ctx.params.id })
        .orderBy('country.name', 'ASC')
        .addOrderBy('team.name', 'ASC')
        .getMany();
});
exports.default = staffContestsRouter;
