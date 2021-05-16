"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const typeorm_1 = require("typeorm");
const validator_1 = __importDefault(require("validator"));
const Team_1 = require("../models/Team");
const authentication_1 = require("../middlewares/authentication");
const User_1 = require("../models/User");
const Contest_1 = require("../models/Contest");
const Log_1 = require("../models/Log");
const teamsRouter = new router_1.default();
teamsRouter.prefix('/api/teams');
teamsRouter.get('/', async (ctx) => {
    ctx.body = await Team_1.Team.find({
        where: {
            wasConfirmed: true,
        },
        relations: [
            'country',
            'captain',
            'users',
        ],
    });
});
teamsRouter.get('/mine', authentication_1.authenticate, async (ctx) => {
    const user = ctx.state.user;
    ctx.body = await Team_1.Team.findOne({
        where: {
            captain: user,
        },
        relations: [
            'contest',
            'users',
            'invitations',
        ],
    });
});
teamsRouter.post('/', authentication_1.authenticate, async (ctx) => {
    const user = ctx.state.user;
    const input = ctx.request.body;
    const name = validator_1.default.trim(input.name);
    const [currentTeam, contest] = await Promise.all([
        Team_1.Team.findOne({
            captain: user,
        }),
        Contest_1.Contest.open()
            .andWhere('id = :id', { id: input.contest.id })
            .getOne(),
    ]);
    if (currentTeam?.wasConfirmed) {
        ctx.status = 400;
        return ctx.body = {
            error: 'Team was locked by a staff member',
        };
    }
    let users = [];
    if (currentTeam) {
        users = await User_1.User.createQueryBuilder('user')
            .where('countryId = :countryId', { countryId: user.country.id })
            .andWhere('id != :userId', { userId: user.id })
            .andWhere('id IN (:ids)', { ids: input.invitations.map(i => i.id) })
            .andWhere(new typeorm_1.Brackets(qb => {
            qb.where('teamId IS NULL')
                .orWhere('teamId = :teamId', { teamId: currentTeam.id });
        }))
            .getMany();
    }
    else {
        users = await User_1.User.findByIds(input.invitations, {
            id: typeorm_1.Not(user.id),
            countryId: user.country.id,
            teamId: typeorm_1.IsNull(),
        });
    }
    if (!validator_1.default.isLength(name, {
        min: 1,
        max: 16,
    }) ||
        users.length < 2 ||
        users.length > 5 ||
        user.teamId ||
        !contest) {
        ctx.status = 400;
        return ctx.body = {
            error: 'Invalid submission',
        };
    }
    let team = currentTeam;
    if (!team) {
        ctx.status = 201;
        team = new Team_1.Team();
    }
    team.contest = contest;
    team.country = user.country;
    team.captain = user;
    team.name = name;
    team.invitations = users;
    await team.save();
    ctx.body = team;
    Log_1.Log.createAndSave(`Team created: "${team.name}" for "${user.country.name}"`, Log_1.LOG_TYPE.User, user.id);
});
teamsRouter.post('/:id/acceptInvitation', authentication_1.authenticate, async (ctx) => {
    const team = await Team_1.Team.findOneOrFail(ctx.params.id, {
        where: {
            wasConfirmed: false,
        },
        relations: [
            'invitations',
            'users',
        ],
    });
    const user = ctx.state.user;
    const invitation = team.invitations.find(i => i.id === user.id);
    const isCaptain = await Team_1.Team.findOne({
        captainId: user.id,
    });
    const hasTeam = user.teamId;
    if (!invitation || isCaptain || hasTeam) {
        ctx.status = 400;
        return ctx.body = {
            error: `Invalid invitation`,
        };
    }
    team.users.push(user);
    await team.save();
    ctx.body = team;
    Log_1.Log.createAndSave(`Accepted invite: "${user.username}" from "${team.name}" for "${user.country.name}"`, Log_1.LOG_TYPE.User, user.id);
});
exports.default = teamsRouter;
