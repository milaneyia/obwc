"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../../middlewares/authentication");
const Team_1 = require("../../models/Team");
const User_1 = require("../../models/User");
const staffTeamsRouter = new router_1.default();
staffTeamsRouter.prefix('/api/staff/teams');
staffTeamsRouter.use(authentication_1.authenticate);
staffTeamsRouter.use(authentication_1.isStaff);
staffTeamsRouter.put('/:id/confirm', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const team = await Team_1.Team.findOneOrFail({ id: teamId });
    team.wasConfirmed = true;
    await team.save();
    ctx.body = team;
});
staffTeamsRouter.put('/:id/deny', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const team = await Team_1.Team.findOneOrFail({ id: teamId });
    team.wasConfirmed = false;
    await team.save();
    ctx.body = team;
});
staffTeamsRouter.put('/:id', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const name = validator_1.default.trim(ctx.request.body.name);
    const team = await Team_1.Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
    team.name = name;
    await team.save();
    ctx.body = team;
});
staffTeamsRouter.put('/:id/transferOwnership', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const userId = ctx.request.body.userId;
    const [user, team] = await Promise.all([
        User_1.User.findOneOrFail({ id: userId }),
        Team_1.Team.findOneOrFail({
            where: { id: teamId },
            relations: ['users', 'captain'],
        }),
    ]);
    if (user.teamId !== team.id) {
        throw new Error();
    }
    team.users.push(team.captain);
    team.users.splice(team.users.findIndex(u => u.id === user.id), 1);
    team.captain = user;
    await team.save();
    ctx.body = await Team_1.Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
});
staffTeamsRouter.put('/:id/removeUser', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const userId = ctx.request.body.userId;
    const user = await User_1.User.findOneOrFail({ id: userId });
    if (user.teamId === teamId) {
        user.teamId = null;
        await user.save();
    }
    const team = await Team_1.Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
    ctx.body = team;
});
staffTeamsRouter.delete('/:id', async (ctx) => {
    const teamId = validator_1.default.toInt(ctx.params.id);
    const team = await Team_1.Team.findOneOrFail({
        id: teamId,
    });
    await team.remove();
    ctx.body = {
        success: 'Deleted',
    };
});
exports.default = staffTeamsRouter;
